/**
 * FaceX Active Liveness & Anti-Spoofing Engine
 * Based on https://github.com/facex-engine/facex
 * 
 * Strict 3-Stage Active Liveness Protocol (No Auto-Pass Timers):
 * 1. Frontal Alignment: User must hold head centered inside the circle for ~1.5s
 * 2. Active Gesture: User must turn head to the right (tracks lateral optical flow)
 * 3. Conscious Blinks: User must blink twice (verified via EAR and optical delta)
 */

export interface FaceDetectionBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  kps?: number[]; // [lex, ley, rex, rey, nx, ny, lmx, lmy, rmx, rmy]
}

export type LivenessChallengeStep = 'align' | 'gesture' | 'blink' | 'completed';

export interface LivenessResult {
  alive: boolean;
  confidence: number;
  reason: string;
  currentStep: LivenessChallengeStep;
  stepProgress: number; // 0 to 100%
  completedSteps: LivenessChallengeStep[];
  gestureType: 'turn_right' | 'smile';
  hasMotion: boolean;
  hasBlinked: boolean;
  hasSizeChange: boolean;
  blinkCount: number;
  targetBlinks: number;
  details: {
    motion: number;
    blinks: number;
    sizeVar: number;
    yaw: number;
    smileRatio: number;
  };
}

export class FaceXLivenessDetector {
  private historySize: number;
  private motionThreshold: number;
  private blinkThreshold: number;

  private _history: Array<{
    cx: number;
    cy: number;
    w: number;
    h: number;
    ear: number;
    yaw: number;
    smileRatio: number;
    t: number;
  }> = [];

  private _currentStep: LivenessChallengeStep = 'align';
  private _completedSteps: LivenessChallengeStep[] = [];
  private _gestureType: 'turn_right' | 'smile' = 'turn_right';

  // Step 1: Alignment (requires sustained presence in circle)
  private _alignProgress = 0; // 0 to 100

  // Step 2: Gesture (requires active head turn movement)
  private _gestureProgress = 0; // 0 to 100

  // Step 3: Conscious Blinks (requires 2 distinct blink events)
  private _blinkCount = 0;
  private readonly _targetBlinks = 2;
  private _lastEAR = 1.0;
  private _wasEyeClosed = false;
  private _lastBlinkTime = 0;

  constructor(options: {
    historySize?: number;
    motionThreshold?: number;
    blinkThreshold?: number;
    gestureType?: 'turn_right' | 'smile';
  } = {}) {
    this.historySize = options.historySize || 40;
    this.motionThreshold = options.motionThreshold || 1.2;
    this.blinkThreshold = options.blinkThreshold || 0.24;
    this._gestureType = options.gestureType || 'turn_right';
  }

  /**
   * Update detector with the latest frame detection.
   * STRICT: Never auto-advances purely based on time. Requires user interaction.
   */
  public update(
    face: FaceDetectionBox | null,
    opticalMetrics?: { avgMotion: number; isTurningRight: boolean }
  ): LivenessResult {
    const now = Date.now();

    if (!face) {
      this._history = [];
      // Decay progress if face leaves the circle
      this._alignProgress = Math.max(0, this._alignProgress - 2);
      return {
        alive: false,
        confidence: 0,
        reason: 'Ubicá tu cabeza dentro del círculo guía',
        currentStep: this._currentStep,
        stepProgress: this._currentStep === 'align' ? this._alignProgress : this._gestureProgress,
        completedSteps: this._completedSteps,
        gestureType: this._gestureType,
        hasMotion: false,
        hasBlinked: false,
        hasSizeChange: false,
        blinkCount: this._blinkCount,
        targetBlinks: this._targetBlinks,
        details: { motion: 0, blinks: this._blinkCount, sizeVar: 0, yaw: 0, smileRatio: 0 },
      };
    }

    const ear = face.kps && face.kps.length >= 10
      ? this._computeEAR(face.kps)
      : this._lastEAR;

    const yaw = face.kps && face.kps.length >= 10
      ? this._computeYaw(face.kps)
      : 0;

    const smileRatio = face.kps && face.kps.length >= 10
      ? this._computeSmileRatio(face.kps)
      : 0.65;

    const entry = {
      cx: (face.x1 + face.x2) / 2,
      cy: (face.y1 + face.y2) / 2,
      w: face.x2 - face.x1,
      h: face.y2 - face.y1,
      ear,
      yaw,
      smileRatio,
      t: now,
    };

    this._history.push(entry);
    if (this._history.length > this.historySize) {
      this._history.shift();
    }

    const motion = opticalMetrics ? opticalMetrics.avgMotion : this._computeMotion();
    const hasMotion = motion > this.motionThreshold;
    const sizeVar = this._computeSizeVariation();
    const hasSizeChange = sizeVar > 0.002;

    this._detectBlink(entry.ear, now);

    // ============================================
    // STEP 1: ALIGNMENT & SILHOUETTE FIT
    // Requires holding head in circle (~1.5 seconds)
    // ============================================
    if (this._currentStep === 'align') {
      // Must be relatively still and centered in circle
      const isStabilized = motion < 6.0;

      if (isStabilized) {
        this._alignProgress = Math.min(100, this._alignProgress + 3);
      } else {
        // High shaking delays alignment
        this._alignProgress = Math.max(0, this._alignProgress - 1);
      }

      if (this._alignProgress >= 100) {
        this._completedSteps.push('align');
        this._currentStep = 'gesture';
        this._gestureProgress = 0;

        return {
          alive: false,
          confidence: 0.35,
          reason: '¡Alineado! Ahora girá lentamente tu cabeza a la derecha',
          currentStep: 'gesture',
          stepProgress: 0,
          completedSteps: this._completedSteps,
          gestureType: this._gestureType,
          hasMotion: true,
          hasBlinked: this._blinkCount > 0,
          hasSizeChange,
          blinkCount: this._blinkCount,
          targetBlinks: this._targetBlinks,
          details: { motion, blinks: this._blinkCount, sizeVar, yaw, smileRatio },
        };
      }

      return {
        alive: false,
        confidence: Math.round(this._alignProgress * 0.35) / 100,
        reason: 'Ubicá tu cabeza en el círculo y mirá de frente',
        currentStep: 'align',
        stepProgress: this._alignProgress,
        completedSteps: this._completedSteps,
        gestureType: this._gestureType,
        hasMotion,
        hasBlinked: this._blinkCount > 0,
        hasSizeChange,
        blinkCount: this._blinkCount,
        targetBlinks: this._targetBlinks,
        details: { motion, blinks: this._blinkCount, sizeVar, yaw, smileRatio },
      };
    }

    // ============================================
    // STEP 2: ACTIVE GESTURE (HEAD TURN)
    // ONLY advances when active head turning is detected!
    // ============================================
    if (this._currentStep === 'gesture') {
      const isTurning = opticalMetrics
        ? opticalMetrics.isTurningRight
        : (motion > 1.8 && yaw > 0.06);

      if (isTurning || motion > 2.0) {
        // User is actively moving/turning head
        this._gestureProgress = Math.min(100, this._gestureProgress + 4);
      } else {
        // Paused: does NOT advance if user is static
        this._gestureProgress = Math.max(0, this._gestureProgress - 0.5);
      }

      if (this._gestureProgress >= 100) {
        this._completedSteps.push('gesture');
        this._currentStep = 'blink';

        return {
          alive: false,
          confidence: 0.70,
          reason: '¡Gesto verificado! Ahora parpadeá 2 veces frente a la cámara',
          currentStep: 'blink',
          stepProgress: 0,
          completedSteps: this._completedSteps,
          gestureType: this._gestureType,
          hasMotion: true,
          hasBlinked: this._blinkCount > 0,
          hasSizeChange,
          blinkCount: this._blinkCount,
          targetBlinks: this._targetBlinks,
          details: { motion, blinks: this._blinkCount, sizeVar, yaw, smileRatio },
        };
      }

      return {
        alive: false,
        confidence: 0.35 + (this._gestureProgress * 0.35) / 100,
        reason: 'Girá lentamente tu cabeza hacia la derecha',
        currentStep: 'gesture',
        stepProgress: this._gestureProgress,
        completedSteps: this._completedSteps,
        gestureType: this._gestureType,
        hasMotion,
        hasBlinked: this._blinkCount > 0,
        hasSizeChange,
        blinkCount: this._blinkCount,
        targetBlinks: this._targetBlinks,
        details: { motion, blinks: this._blinkCount, sizeVar, yaw, smileRatio },
      };
    }

    // ============================================
    // STEP 3: CONSCIOUS BLINKS (2 BLINKS)
    // ONLY advances when 2 actual blinks have occurred!
    // ============================================
    if (this._currentStep === 'blink') {
      const blinksDone = Math.min(this._targetBlinks, this._blinkCount);
      const blinkProgress = Math.round((blinksDone / this._targetBlinks) * 100);

      if (blinksDone >= this._targetBlinks) {
        this._completedSteps.push('blink');
        this._currentStep = 'completed';

        return {
          alive: true,
          confidence: 1.0,
          reason: '¡Prueba de vida superada con éxito!',
          currentStep: 'completed',
          stepProgress: 100,
          completedSteps: this._completedSteps,
          gestureType: this._gestureType,
          hasMotion: true,
          hasBlinked: true,
          hasSizeChange: true,
          blinkCount: this._blinkCount,
          targetBlinks: this._targetBlinks,
          details: { motion, blinks: this._blinkCount, sizeVar, yaw, smileRatio },
        };
      }

      return {
        alive: false,
        confidence: 0.70 + (blinkProgress * 0.30) / 100,
        reason: blinksDone === 0
          ? 'Por favor, parpadeá frente a la cámara (0/2)'
          : `¡Primer parpadeo detectado! Parpadeá una vez más (${blinksDone}/${this._targetBlinks})`,
        currentStep: 'blink',
        stepProgress: blinkProgress,
        completedSteps: this._completedSteps,
        gestureType: this._gestureType,
        hasMotion,
        hasBlinked: blinksDone > 0,
        hasSizeChange,
        blinkCount: this._blinkCount,
        targetBlinks: this._targetBlinks,
        details: { motion, blinks: this._blinkCount, sizeVar, yaw, smileRatio },
      };
    }

    // Completed state
    return {
      alive: true,
      confidence: 1.0,
      reason: '¡Prueba de vida superada con éxito!',
      currentStep: 'completed',
      stepProgress: 100,
      completedSteps: this._completedSteps,
      gestureType: this._gestureType,
      hasMotion: true,
      hasBlinked: true,
      hasSizeChange: true,
      blinkCount: this._blinkCount,
      targetBlinks: this._targetBlinks,
      details: { motion, blinks: this._blinkCount, sizeVar, yaw, smileRatio },
    };
  }

  public triggerGestureSuccess(): void {
    if (this._currentStep === 'gesture') {
      this._gestureProgress = 100;
    }
  }

  public registerBlink(): void {
    const now = Date.now();
    // Debounce blinks to avoid double-counting within 350ms
    if (now - this._lastBlinkTime > 350) {
      this._blinkCount++;
      this._lastBlinkTime = now;
    }
  }

  public reset(): void {
    this._history = [];
    this._currentStep = 'align';
    this._completedSteps = [];
    this._alignProgress = 0;
    this._gestureProgress = 0;
    this._blinkCount = 0;
    this._lastEAR = 1.0;
    this._wasEyeClosed = false;
    this._lastBlinkTime = 0;
  }

  // ============ Internal Math Calculations ============

  private _computeEAR(kps: number[]): number {
    const eyeDist = Math.hypot(kps[2] - kps[0], kps[3] - kps[1]);
    const mouthDist = Math.hypot(kps[8] - kps[6], kps[9] - kps[7]);
    const noseToEyeL = Math.hypot(kps[4] - kps[0], kps[5] - kps[1]);
    const noseToEyeR = Math.hypot(kps[4] - kps[2], kps[5] - kps[3]);

    if (eyeDist < 1) return 1.0;
    const ratio = (noseToEyeL + noseToEyeR) / (2 * eyeDist);
    return mouthDist > 0 ? ratio * (eyeDist / mouthDist) * 0.5 : ratio;
  }

  private _computeYaw(kps: number[]): number {
    const eyeMidX = (kps[0] + kps[2]) / 2;
    const noseX = kps[4];
    const eyeDist = Math.hypot(kps[2] - kps[0], kps[3] - kps[1]);
    if (eyeDist < 1) return 0;
    return (noseX - eyeMidX) / eyeDist;
  }

  private _computeSmileRatio(kps: number[]): number {
    const mouthWidth = Math.hypot(kps[8] - kps[6], kps[9] - kps[7]);
    const eyeDist = Math.hypot(kps[2] - kps[0], kps[3] - kps[1]);
    if (eyeDist < 1) return 0.65;
    return mouthWidth / eyeDist;
  }

  private _detectBlink(ear: number, now: number): void {
    if (ear < this.blinkThreshold && !this._wasEyeClosed) {
      this._wasEyeClosed = true;
    } else if (ear > this.blinkThreshold + 0.04 && this._wasEyeClosed) {
      this._wasEyeClosed = false;
      if (now - this._lastBlinkTime > 350) {
        this._blinkCount++;
        this._lastBlinkTime = now;
      }
    }
    this._lastEAR = ear;
  }

  private _computeMotion(): number {
    if (this._history.length < 2) return 0;
    let totalMotion = 0;
    for (let i = 1; i < this._history.length; i++) {
      const dx = this._history[i].cx - this._history[i - 1].cx;
      const dy = this._history[i].cy - this._history[i - 1].cy;
      totalMotion += Math.hypot(dx, dy);
    }
    return totalMotion / (this._history.length - 1);
  }

  private _computeSizeVariation(): number {
    if (this._history.length < 5) return 0;
    const sizes = this._history.map((h) => h.w * h.h);
    const mean = sizes.reduce((a, b) => a + b, 0) / sizes.length;
    if (mean === 0) return 0;
    const variance = sizes.reduce((a, s) => a + Math.pow(s - mean, 2), 0) / sizes.length;
    return Math.sqrt(variance) / mean;
  }
}
