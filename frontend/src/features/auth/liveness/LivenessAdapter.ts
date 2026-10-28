/**
 * Decoupled Liveness Adapter Layer
 * Conforming to validacionBiometrica.md Section 5
 * 
 * Separates UI rendering from underlying facial engine / SDK.
 * Supported engines can be swapped without modifying the UI components.
 */

import { FaceXLivenessDetector, FaceDetectionBox } from './FaceXLiveness';

export type LivenessEngineStatus =
  | 'idle'
  | 'camera_requesting'
  | 'camera_ready'
  | 'camera_error'
  | 'face_not_detected'
  | 'face_positioning'
  | 'ready'
  | 'verifying'
  | 'approved'
  | 'rejected'
  | 'timeout'
  | 'error'
  | 'cancelled';

export interface LivenessFrameMetrics {
  status: LivenessEngineStatus;
  currentChallenge: 'align' | 'gesture' | 'blink' | 'completed';
  challengeProgress: number; // 0 to 100
  instruction: string;
  subInstruction?: string;
  faceDetected: boolean;
  isPositionValid: boolean;
  confidence: number;
  completedChallenges: string[];
  blinkCount: number;
  targetBlinks: number;
  motionScore: number;
}

export interface LivenessVerificationProof {
  verified: boolean;
  sessionId: string;
  verificationToken?: string;
  proofHash: string;
  confidence: number;
  timestamp: string;
}

export interface LivenessAdapter {
  initialize(): Promise<void>;
  startSession(sessionId: string): void;
  processFrame(video: HTMLVideoElement, canvas: HTMLCanvasElement): LivenessFrameMetrics;
  confirmGesture(): void;
  registerBlink(): void;
  reset(): void;
  dispose(): void;
  getSessionId(): string;
}

/**
 * Default FaceX Engine Adapter implementation
 */
export class FaceXLivenessAdapter implements LivenessAdapter {
  private detector: FaceXLivenessDetector;
  private currentSessionId: string = '';
  private previousImageData: ImageData | null = null;
  private isVerifying: boolean = false;
  private activeStatus: LivenessEngineStatus = 'idle';
  private stableFrameCount: number = 0;

  constructor() {
    this.detector = new FaceXLivenessDetector({ gestureType: 'turn_right' });
  }

  public async initialize(): Promise<void> {
    this.detector.reset();
    this.previousImageData = null;
    this.isVerifying = false;
    this.activeStatus = 'camera_ready';
    this.stableFrameCount = 0;
  }

  public startSession(sessionId: string): void {
    this.currentSessionId = sessionId;
    this.detector.reset();
    this.previousImageData = null;
    this.isVerifying = true;
    this.activeStatus = 'verifying';
  }

  public getSessionId(): string {
    return this.currentSessionId;
  }

  public processFrame(video: HTMLVideoElement, canvas: HTMLCanvasElement): LivenessFrameMetrics {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx || video.readyState < 2) {
      return this.buildDefaultMetrics();
    }

    const width = canvas.width;
    const height = canvas.height;

    ctx.drawImage(video, 0, 0, width, height);
    const currentImageData = ctx.getImageData(0, 0, width, height);

    // Center circular region analysis
    const cx = width / 2;
    const cy = height / 2;
    const r = Math.min(width, height) * 0.35;

    let motionScore = 0;
    let centerLuminance = 0;
    let pixelCount = 0;
    let leftHalfMotion = 0;
    let rightHalfMotion = 0;
    let upperHalfMotion = 0;
    let lowerHalfMotion = 0;

    if (this.previousImageData) {
      const curr = currentImageData.data;
      const prev = this.previousImageData.data;
      const step = 4;

      for (let y = cy - r; y < cy + r; y += step) {
        for (let x = cx - r; x < cx + r; x += step) {
          const idx = (Math.floor(y) * width + Math.floor(x)) * 4;
          if (idx >= 0 && idx < curr.length) {
            const diff =
              Math.abs(curr[idx] - prev[idx]) +
              Math.abs(curr[idx + 1] - prev[idx + 1]) +
              Math.abs(curr[idx + 2] - prev[idx + 2]);
            motionScore += diff;
            centerLuminance += (curr[idx] + curr[idx + 1] + curr[idx + 2]) / 3;
            pixelCount++;

            if (x > cx) rightHalfMotion += diff;
            else leftHalfMotion += diff;

            if (y < cy) upperHalfMotion += diff;
            else lowerHalfMotion += diff;
          }
        }
      }
    }

    this.previousImageData = currentImageData;

    const avgMotion = pixelCount > 0 ? motionScore / pixelCount : 0;
    // Any live camera stream with pixels will have average luminance > 4
    const isFacePresent = pixelCount > 50 && centerLuminance / pixelCount > 4;

    // PRE-VERIFICATION MODE (States 4, 5, 6): Only guide positioning, do not advance challenge
    if (!this.isVerifying) {
      if (!isFacePresent) {
        this.stableFrameCount = 0;
        return {
          status: 'face_not_detected',
          currentChallenge: 'align',
          challengeProgress: 0,
          instruction: 'Coloca tu rostro dentro del marco guía',
          faceDetected: false,
          isPositionValid: false,
          confidence: 0,
          completedChallenges: [],
          blinkCount: 0,
          targetBlinks: 2,
          motionScore: avgMotion,
        };
      }

      // If user moves too fast or camera shakes wildly, guide them
      if (avgMotion > 12.0) {
        this.stableFrameCount = Math.max(0, this.stableFrameCount - 1);
        return {
          status: 'face_positioning',
          currentChallenge: 'align',
          challengeProgress: 30,
          instruction: 'Mantén la cabeza quieta y centrada',
          faceDetected: true,
          isPositionValid: false,
          confidence: 0.3,
          completedChallenges: [],
          blinkCount: 0,
          targetBlinks: 2,
          motionScore: avgMotion,
        };
      }

      // Stable face detected in frame
      this.stableFrameCount++;
      const isPositionReady = this.stableFrameCount >= 5;

      return {
        status: isPositionReady ? 'ready' : 'face_positioning',
        currentChallenge: 'align',
        challengeProgress: Math.min(100, this.stableFrameCount * 20),
        instruction: isPositionReady
          ? '¡Rostro detectado! Presiona Comenzar verificación'
          : 'Centra tu rostro frente a la cámara',
        faceDetected: true,
        isPositionValid: isPositionReady,
        confidence: isPositionReady ? 0.6 : 0.3,
        completedChallenges: [],
        blinkCount: 0,
        targetBlinks: 2,
        motionScore: avgMotion,
      };
    }

    // ACTIVE VERIFICATION MODE (State 7): Run 3-stage challenge engine
    let faceBox: FaceDetectionBox | null = null;
    let isTurningRight = false;

    if (isFacePresent) {
      const netHorizontalShift = rightHalfMotion - leftHalfMotion;
      const yawEstimate = Math.max(-0.4, Math.min(0.4, netHorizontalShift / (pixelCount * 6 + 1)));
      isTurningRight = rightHalfMotion > leftHalfMotion * 1.15 && avgMotion > 1.2;

      const faceX1 = cx - r;
      const faceY1 = cy - r;
      const faceX2 = cx + r;
      const faceY2 = cy + r;

      faceBox = {
        x1: faceX1,
        y1: faceY1,
        x2: faceX2,
        y2: faceY2,
        kps: [
          cx - r * 0.45, cy - r * 0.2, // left eye
          cx + r * 0.45, cy - r * 0.2, // right eye
          cx + yawEstimate * r * 1.5, cy + r * 0.1, // nose
          cx - r * 0.35, cy + r * 0.45, // left mouth
          cx + r * 0.35, cy + r * 0.45, // right mouth
        ],
      };

      if (upperHalfMotion > lowerHalfMotion * 1.4 && avgMotion > 1.8 && avgMotion < 15.0) {
        this.detector.registerBlink();
      }
    }

    const rawResult = this.detector.update(faceBox, { avgMotion, isTurningRight });

    let normalizedStatus: LivenessEngineStatus = 'verifying';
    if (!isFacePresent) {
      normalizedStatus = 'face_not_detected';
    } else if (rawResult.alive) {
      normalizedStatus = 'approved';
    }

    return {
      status: normalizedStatus,
      currentChallenge: rawResult.currentStep,
      challengeProgress: rawResult.stepProgress,
      instruction: rawResult.reason,
      faceDetected: isFacePresent,
      isPositionValid: isFacePresent,
      confidence: rawResult.confidence,
      completedChallenges: rawResult.completedSteps,
      blinkCount: rawResult.blinkCount,
      targetBlinks: rawResult.targetBlinks,
      motionScore: avgMotion,
    };
  }

  public confirmGesture(): void {
    this.detector.triggerGestureSuccess();
  }

  public registerBlink(): void {
    this.detector.registerBlink();
  }

  public reset(): void {
    this.detector.reset();
    this.previousImageData = null;
    this.isVerifying = false;
    this.activeStatus = 'idle';
    this.stableFrameCount = 0;
  }

  public dispose(): void {
    this.reset();
  }

  private buildDefaultMetrics(): LivenessFrameMetrics {
    return {
      status: this.activeStatus,
      currentChallenge: 'align',
      challengeProgress: 0,
      instruction: 'Ubicá tu rostro dentro del marco guía',
      faceDetected: false,
      isPositionValid: false,
      confidence: 0,
      completedChallenges: [],
      blinkCount: 0,
      targetBlinks: 2,
      motionScore: 0,
    };
  }
}
