import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Building2,
  Lock,
  Mail,
  User,
  Phone,
  Calendar,
  Eye,
  EyeOff,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  validateCuitCuil,
  validateDni,
  validateAdultAge,
  validatePassword,
  validateEmail,
} from './legalValidation';

export const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, registerInvestor, registerCorporate } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Mode: login or register
  const [isLogin, setIsLogin] = useState<boolean>(searchParams.get('mode') !== 'register');
  const [role, setRole] = useState<'investor' | 'developer'>('investor');

  // Step state for register wizard (1: Contact, 2: Legal Data, 3: Declarations)
  const [registerStep, setRegisterStep] = useState<number>(1);

  // Common credentials state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  // Investor specific fields
  const [fullName, setFullName] = useState('');
  const [dni, setDni] = useState('');
  const [cuil, setCuil] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('Buenos Aires');
  const [fundsOrigin, setFundsOrigin] = useState('Ahorros / Ingresos laborales');
  const [isPep, setIsPep] = useState<boolean>(false);
  const [isObligatedSubject, setIsObligatedSubject] = useState<boolean>(false);

  // Corporate specific fields
  const [companyName, setCompanyName] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [companyType, setCompanyType] = useState('Sociedad Anónima (S.A.)');
  const [cuit, setCuit] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [legalAddress, setLegalAddress] = useState('');
  const [repFullName, setRepFullName] = useState('');
  const [repRole, setRepRole] = useState('Presidente / Director General');
  const [repDni, setRepDni] = useState('');
  const [repCuil, setRepCuil] = useState('');
  const [uboDeclared, setUboDeclared] = useState(false);

  // Independent legal consents (mandatory by Ley 25.326 & legal.md sec. 7.6)
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [swornTruthAccepted, setSwornTruthAccepted] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);

  // Form error states
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (searchParams.get('mode') === 'register') {
      setIsLogin(false);
    } else if (searchParams.get('mode') === 'login') {
      setIsLogin(true);
    }
  }, [searchParams]);

  // Handle Login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid) {
      setFormErrors({ email: emailCheck.message || 'Email inválido' });
      return;
    }
    if (!password) {
      setFormErrors({ password: 'Debe ingresar su contraseña' });
      return;
    }

    login(email, role);
    navigate('/app');
  };

  // Quick demo login buttons for evaluation convenience
  const handleQuickDemoLogin = (demoRole: 'investor' | 'developer') => {
    const demoEmail = demoRole === 'investor' ? 'inversor@kreanova.capital' : 'desarrollador@kreanova.capital';
    login(demoEmail, demoRole);
    navigate('/app');
  };

  // Step 1 Validation (Contact & Access)
  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};

    if (role === 'investor') {
      if (!fullName.trim() || fullName.trim().split(' ').length < 2) {
        errors.fullName = 'Ingrese su nombre y apellido completos (mínimo 2 palabras).';
      }
    } else {
      if (!companyName.trim()) {
        errors.companyName = 'Ingrese la Razón Social completa de la empresa.';
      }
    }

    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid) {
      errors.email = emailCheck.message || 'Email inválido';
    }

    const pwdCheck = validatePassword(password);
    if (!pwdCheck.isValid) {
      errors.password = pwdCheck.message || 'Contraseña insegura';
    }

    if (!phone.trim() || phone.trim().length < 8) {
      errors.phone = 'Ingrese un número telefónico de contacto válido.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Step 2 Validation (Legal & Identification)
  const validateStep2 = (): boolean => {
    const errors: Record<string, string> = {};

    if (role === 'investor') {
      const dniCheck = validateDni(dni);
      if (!dniCheck.isValid) {
        errors.dni = dniCheck.message || 'DNI inválido';
      }

      const cuilCheck = validateCuitCuil(cuil);
      if (!cuilCheck.isValid) {
        errors.cuil = cuilCheck.message || 'CUIL inválido';
      }

      const ageCheck = validateAdultAge(birthDate);
      if (!ageCheck.isValid) {
        errors.birthDate = ageCheck.message || 'Debe ser mayor de 18 años';
      }

      if (!address.trim()) {
        errors.address = 'El domicilio real es obligatorio para el registro legal.';
      }
      if (!city.trim()) {
        errors.city = 'La localidad es requerida.';
      }
    } else {
      const cuitCheck = validateCuitCuil(cuit);
      if (!cuitCheck.isValid) {
        errors.cuit = cuitCheck.message || 'CUIT inválido';
      }

      if (!registrationNumber.trim()) {
        errors.registrationNumber = 'Ingrese el número de inscripción registral (IGJ/DPPJ).';
      }

      if (!legalAddress.trim()) {
        errors.legalAddress = 'Ingrese el domicilio legal y sede social.';
      }

      if (!repFullName.trim() || repFullName.trim().split(' ').length < 2) {
        errors.repFullName = 'Nombre y apellido completos del representante legal.';
      }

      const repDniCheck = validateDni(repDni);
      if (!repDniCheck.isValid) {
        errors.repDni = repDniCheck.message || 'DNI de representante inválido';
      }

      const repCuilCheck = validateCuitCuil(repCuil);
      if (!repCuilCheck.isValid) {
        errors.repCuil = repCuilCheck.message || 'CUIL de representante inválido';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Step 3 Validation & Registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!termsAccepted) {
      errors.termsAccepted = 'Debe aceptar los Términos y Condiciones.';
    }
    if (!privacyAccepted) {
      errors.privacyAccepted = 'Debe prestar consentimiento informado (Ley 25.326).';
    }
    if (!swornTruthAccepted) {
      errors.swornTruthAccepted = 'Debe declarar bajo juramento la veracidad de la información.';
    }

    if (role === 'developer' && !uboDeclared) {
      errors.uboDeclared = 'Debe confirmar la declaración de Beneficiarios Finales (Res. UIF 49/2024).';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (role === 'investor') {
      registerInvestor({
        fullName,
        email,
        phone,
        dni,
        cuil,
        birthDate,
        address,
        city,
        province,
        isPep,
        isObligatedSubject,
        fundsOrigin,
        termsAccepted,
        privacyAccepted,
      });
    } else {
      registerCorporate({
        companyName,
        tradeName: tradeName || companyName,
        companyType,
        cuit,
        registrationNumber,
        legalAddress,
        repFullName,
        repRole,
        repDni,
        repCuil,
        email,
        phone,
        isPep,
        uboDeclared,
        termsAccepted,
        privacyAccepted,
      });
    }

    navigate('/app');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--surface-bg)',
        color: 'var(--text-primary)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '32px 16px',
        position: 'relative',
        transition: 'background var(--transition-fast), color var(--transition-fast)',
      }}
    >
      {/* Top Bar with Home Link & Theme Switcher */}
      <div
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          right: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        <Link
          to="/"
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            textDecoration: 'none',
          }}
        >
          ← Volver a Krea Nova
        </Link>

        <button
          onClick={toggleTheme}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'var(--btn-secondary-bg)',
            border: '1px solid var(--btn-secondary-border)',
            color: 'var(--text-primary)',
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
          }}
          title={theme === 'dark' ? 'Cambiar a modo Blanco' : 'Cambiar a modo Negro'}
          aria-label="Cambiar tema"
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>

      {/* Brand Header - Pure Bold Typographic Logo (No Square Icon) */}
      {/* Brand Header with Majestic Tree of Life Logo */}
      <Link
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          textDecoration: 'none',
          marginBottom: '26px',
          marginTop: '40px',
        }}
      >
        <img
          src="/logo-sm.png"
          alt="Krea Nova"
          style={{
            width: '46px',
            height: '46px',
            objectFit: 'contain',
            filter: 'drop-shadow(0 2px 10px var(--brand-gold-glow))',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: '24px',
              fontWeight: 900,
              letterSpacing: '0.03em',
              color: 'var(--text-primary)',
              lineHeight: 1,
            }}
          >
            KREA NOVA
          </span>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 800,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--brand-gold)',
              marginTop: '4px',
            }}
          >
            REAL ESTATE INVESTMENTS
          </span>
        </div>
      </Link>

      {/* Main Auth Container Card */}
      <div
        style={{
          maxWidth: isLogin ? '440px' : '640px',
          width: '100%',
          padding: 'clamp(24px, 4vw, 36px)',
          borderRadius: '24px',
          background: 'var(--surface-card)',
          border: '1px solid var(--surface-glass-border)',
          boxShadow: 'var(--shadow-elevation)',
          transition: 'all var(--transition-fast)',
        }}
      >
        {/* Toggle Login / Register */}
        <div
          style={{
            display: 'flex',
            background: 'var(--color-surface-raised)',
            padding: '4px',
            borderRadius: '999px',
            marginBottom: '26px',
            border: '1px solid var(--surface-glass-border)',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setFormErrors({});
            }}
            style={{
              flex: 1,
              padding: '9px 0',
              borderRadius: '999px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              color: isLogin ? 'var(--btn-primary-text)' : 'var(--text-muted)',
              background: isLogin ? 'var(--btn-primary-bg)' : 'transparent',
              transition: 'all var(--transition-fast)',
            }}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setFormErrors({});
            }}
            style={{
              flex: 1,
              padding: '9px 0',
              borderRadius: '999px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              color: !isLogin ? 'var(--btn-primary-text)' : 'var(--text-muted)',
              background: !isLogin ? 'var(--btn-primary-bg)' : 'transparent',
              transition: 'all var(--transition-fast)',
            }}
          >
            Crear Cuenta
          </button>
        </div>

        {/* ---------------- LOGIN VIEW ---------------- */}
        {isLogin ? (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '6px', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                Ingresá a tu cuenta
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.5, margin: 0 }}>
                Accedé a tu panel para ver tus inversiones y seguir tus rendimientos en dólares.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Correo electrónico
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    required
                    placeholder="nombre@ejemplo.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                    }}
                    style={{
                      width: '100%',
                      height: '46px',
                      paddingLeft: '42px',
                      paddingRight: '14px',
                      borderRadius: '12px',
                      background: 'var(--color-surface-raised)',
                      border: `1px solid ${formErrors.email ? '#ef4444' : 'var(--surface-glass-border)'}`,
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color var(--transition-fast)',
                    }}
                  />
                  <Mail size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                </div>
                {formErrors.email && (
                  <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>
                    {formErrors.email}
                  </span>
                )}
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Contraseña
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 500,
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Tu contraseña"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (formErrors.password) setFormErrors({ ...formErrors, password: '' });
                    }}
                    style={{
                      width: '100%',
                      height: '46px',
                      paddingLeft: '42px',
                      paddingRight: '42px',
                      borderRadius: '12px',
                      background: 'var(--color-surface-raised)',
                      border: `1px solid ${formErrors.password ? '#ef4444' : 'var(--surface-glass-border)'}`,
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color var(--transition-fast)',
                    }}
                  />
                  <Lock size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '13px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-muted)',
                    }}
                    title={showPassword ? 'Ocultar' : 'Mostrar'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formErrors.password && (
                  <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>
                    {formErrors.password}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{
                  width: '100%',
                  height: '46px',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: 700,
                  marginTop: '6px',
                  gap: '8px',
                }}
              >
                <span>Iniciar Sesión</span>
                <ArrowRight size={16} />
              </button>
            </form>

            {/* Seamless Call to Action for Registration */}
            <div style={{ textAlign: 'center', marginTop: '18px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                ¿Todavía no tenés cuenta?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(false);
                    setFormErrors({});
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Registrate gratis
                </button>
              </span>
            </div>

            {/* Subtle Divider for Demo Profiles */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                margin: '22px 0 16px',
                gap: '12px',
              }}
            >
              <div style={{ flex: 1, height: '1px', background: 'var(--surface-glass-border)' }} />
              <span style={{ fontSize: '11px', color: 'var(--text-subtle)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                o probá con una cuenta demo
              </span>
              <div style={{ flex: 1, height: '1px', background: 'var(--surface-glass-border)' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('investor')}
                style={{
                  height: '38px',
                  padding: '0 12px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: 'var(--color-surface-raised)',
                  border: '1px solid var(--surface-glass-border)',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'background var(--transition-fast)',
                }}
              >
                <span>👤 Inversor</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('developer')}
                style={{
                  height: '38px',
                  padding: '0 12px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: 'var(--color-surface-raised)',
                  border: '1px solid var(--surface-glass-border)',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'background var(--transition-fast)',
                }}
              >
                <span>🏢 Desarrolladora</span>
              </button>
            </div>

            {/* Modal de Recuperación */}
            {forgotPasswordOpen && (
              <div
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(0,0,0,0.65)',
                  backdropFilter: 'blur(4px)',
                  display: 'grid',
                  placeItems: 'center',
                  zIndex: 100,
                  padding: '16px',
                }}
              >
                <div
                  style={{
                    maxWidth: '420px',
                    width: '100%',
                    background: 'var(--surface-card)',
                    borderRadius: '20px',
                    padding: '28px',
                    border: '1px solid var(--surface-glass-border)',
                    boxShadow: 'var(--shadow-elevation)',
                  }}
                >
                  <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>
                    Recuperá tu contraseña
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                    Ingresá tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña en minutos.
                  </p>
                  <input
                    type="email"
                    placeholder="nombre@ejemplo.com"
                    defaultValue={email}
                    style={{
                      width: '100%',
                      height: '44px',
                      padding: '0 14px',
                      borderRadius: '10px',
                      background: 'var(--color-surface-raised)',
                      border: '1px solid var(--surface-glass-border)',
                      color: 'var(--text-primary)',
                      marginBottom: '16px',
                      boxSizing: 'border-box',
                    }}
                  />
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => setForgotPasswordOpen(false)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: '1px solid var(--surface-glass-border)',
                        background: 'transparent',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        fontSize: '13px',
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        alert('Te enviamos un enlace a tu correo para restablecer tu contraseña.');
                        setForgotPasswordOpen(false);
                      }}
                      className="btn-primary"
                      style={{ padding: '8px 18px', borderRadius: '8px', fontSize: '13px' }}
                    >
                      Enviar enlace
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ---------------- REGISTER VIEW (DUAL PROFILES) ---------------- */
          <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '6px', color: 'var(--text-primary)' }}>
                Registro y Alta Regulatoria
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.5 }}>
                Conforme a la normativa argentina de prevención LA/FT/FP (Res. UIF 49/2024) y protección de datos personales (Ley 25.326).
              </p>
            </div>

            {/* Profile Selector: Persona Humana vs Persona Jurídica */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
                Seleccioná el Tipo de Cuenta
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setRole('investor');
                    setRegisterStep(1);
                    setFormErrors({});
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '6px',
                    padding: '14px 16px',
                    borderRadius: '16px',
                    border: `2px solid ${role === 'investor' ? 'var(--text-primary)' : 'var(--surface-glass-border)'}`,
                    background: role === 'investor' ? 'var(--color-surface-raised)' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                    <UserCheck size={18} style={{ color: role === 'investor' ? 'var(--text-primary)' : 'var(--text-muted)' }} />
                    <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Inversor</strong>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    Persona Humana. Invertí en desarrollos premium desde $500 USD.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole('developer');
                    setRegisterStep(1);
                    setFormErrors({});
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '6px',
                    padding: '14px 16px',
                    borderRadius: '16px',
                    border: `2px solid ${role === 'developer' ? 'var(--text-primary)' : 'var(--surface-glass-border)'}`,
                    background: role === 'developer' ? 'var(--color-surface-raised)' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                    <Building2 size={18} style={{ color: role === 'developer' ? 'var(--text-primary)' : 'var(--text-muted)' }} />
                    <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Constructora</strong>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    Persona Jurídica. Presentá proyectos para captar financiamiento.
                  </span>
                </button>
              </div>
            </div>

            {/* Stepper Indicator */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '28px',
                padding: '12px 18px',
                borderRadius: '14px',
                background: 'var(--color-surface-raised)',
                border: '1px solid var(--surface-glass-border)',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: registerStep >= 1 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: registerStep >= 1 ? 'var(--btn-primary-bg)' : 'var(--surface-card)', color: registerStep >= 1 ? 'var(--btn-primary-text)' : 'var(--text-muted)', display: 'grid', placeItems: 'center', fontSize: '11px' }}>
                  1
                </span>
                <span>Contacto</span>
              </div>
              <div style={{ height: '1px', flex: 1, margin: '0 10px', background: 'var(--surface-glass-border)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: registerStep >= 2 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: registerStep >= 2 ? 'var(--btn-primary-bg)' : 'var(--surface-card)', color: registerStep >= 2 ? 'var(--btn-primary-text)' : 'var(--text-muted)', display: 'grid', placeItems: 'center', fontSize: '11px' }}>
                  2
                </span>
                <span>Datos Legales</span>
              </div>
              <div style={{ height: '1px', flex: 1, margin: '0 10px', background: 'var(--surface-glass-border)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: registerStep >= 3 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: registerStep >= 3 ? 'var(--btn-primary-bg)' : 'var(--surface-card)', color: registerStep >= 3 ? 'var(--btn-primary-text)' : 'var(--text-muted)', display: 'grid', placeItems: 'center', fontSize: '11px' }}>
                  3
                </span>
                <span>Declaraciones</span>
              </div>
            </div>

            <form onSubmit={handleRegisterSubmit}>
              {/* STEP 1: Credenciales y Contacto */}
              {registerStep === 1 && (
                <div style={{ display: 'grid', gap: '16px' }}>
                  {role === 'investor' ? (
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                        Nombre y Apellido Completos (según DNI) *
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          required
                          placeholder="Ej: Martín Alejandro Benítez"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          style={{
                            width: '100%',
                            height: '44px',
                            paddingLeft: '40px',
                            paddingRight: '14px',
                            borderRadius: '10px',
                            background: 'var(--color-surface-raised)',
                            border: `1px solid ${formErrors.fullName ? '#ef4444' : 'var(--surface-glass-border)'}`,
                            color: 'var(--text-primary)',
                            fontSize: '14px',
                            outline: 'none',
                            boxSizing: 'border-box',
                          }}
                        />
                        <User size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                      </div>
                      {formErrors.fullName && <span style={{ fontSize: '11px', color: '#ef4444' }}>{formErrors.fullName}</span>}
                    </div>
                  ) : (
                    <>
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                          Razón Social de la Desarrolladora / Constructora *
                        </label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type="text"
                            required
                            placeholder="Ej: Alpes Desarrollos Urbanos S.A."
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            style={{
                              width: '100%',
                              height: '44px',
                              paddingLeft: '40px',
                              paddingRight: '14px',
                              borderRadius: '10px',
                              background: 'var(--color-surface-raised)',
                              border: `1px solid ${formErrors.companyName ? '#ef4444' : 'var(--surface-glass-border)'}`,
                              color: 'var(--text-primary)',
                              fontSize: '14px',
                              outline: 'none',
                              boxSizing: 'border-box',
                            }}
                          />
                          <Building2 size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                        </div>
                        {formErrors.companyName && <span style={{ fontSize: '11px', color: '#ef4444' }}>{formErrors.companyName}</span>}
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                          Nombre Comercial / Marca de Fantasía (opcional)
                        </label>
                        <input
                          type="text"
                          placeholder="Ej: Grupo Alpes Urban"
                          value={tradeName}
                          onChange={(e) => setTradeName(e.target.value)}
                          style={{
                            width: '100%',
                            height: '44px',
                            padding: '0 14px',
                            borderRadius: '10px',
                            background: 'var(--color-surface-raised)',
                            border: '1px solid var(--surface-glass-border)',
                            color: 'var(--text-primary)',
                            fontSize: '14px',
                            outline: 'none',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                      Correo Electrónico Oficial *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="email"
                        required
                        placeholder="contacto@dominio.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                          width: '100%',
                          height: '44px',
                          paddingLeft: '40px',
                          paddingRight: '14px',
                          borderRadius: '10px',
                          background: 'var(--color-surface-raised)',
                          border: `1px solid ${formErrors.email ? '#ef4444' : 'var(--surface-glass-border)'}`,
                          color: 'var(--text-primary)',
                          fontSize: '14px',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                      <Mail size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                    </div>
                    {formErrors.email && <span style={{ fontSize: '11px', color: '#ef4444' }}>{formErrors.email}</span>}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                      Teléfono Celular con Código de Área *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="tel"
                        required
                        placeholder="+54 9 11 5555-0199"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{
                          width: '100%',
                          height: '44px',
                          paddingLeft: '40px',
                          paddingRight: '14px',
                          borderRadius: '10px',
                          background: 'var(--color-surface-raised)',
                          border: `1px solid ${formErrors.phone ? '#ef4444' : 'var(--surface-glass-border)'}`,
                          color: 'var(--text-primary)',
                          fontSize: '14px',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                      <Phone size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                    </div>
                    {formErrors.phone && <span style={{ fontSize: '11px', color: '#ef4444' }}>{formErrors.phone}</span>}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                      Contraseña de Acceso Seguro *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Mínimo 8 caracteres, mayúscula, minúscula y número"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                          width: '100%',
                          height: '44px',
                          paddingLeft: '40px',
                          paddingRight: '40px',
                          borderRadius: '10px',
                          background: 'var(--color-surface-raised)',
                          border: `1px solid ${formErrors.password ? '#ef4444' : 'var(--surface-glass-border)'}`,
                          color: 'var(--text-primary)',
                          fontSize: '14px',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                      <Lock size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', right: '12px', top: '12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {formErrors.password && <span style={{ fontSize: '11px', color: '#ef4444' }}>{formErrors.password}</span>}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep1()) setRegisterStep(2);
                    }}
                    className="btn-primary"
                    style={{ height: '46px', marginTop: '12px', borderRadius: '10px', gap: '8px' }}
                  >
                    <span>Continuar a Datos Legales</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {/* STEP 2: Datos Legales e Identificación (Diferenciados) */}
              {registerStep === 2 && (
                <div style={{ display: 'grid', gap: '16px' }}>
                  {role === 'investor' ? (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                            DNI Argentino *
                          </label>
                          <input
                            type="text"
                            placeholder="Ej: 38452109"
                            value={dni}
                            maxLength={8}
                            onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                            style={{
                              width: '100%',
                              height: '42px',
                              padding: '0 12px',
                              borderRadius: '10px',
                              background: 'var(--color-surface-raised)',
                              border: `1px solid ${formErrors.dni ? '#ef4444' : 'var(--surface-glass-border)'}`,
                              color: 'var(--text-primary)',
                              fontSize: '14px',
                              boxSizing: 'border-box',
                            }}
                          />
                          {formErrors.dni && <span style={{ fontSize: '11px', color: '#ef4444' }}>{formErrors.dni}</span>}
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                            CUIL (11 dígitos) *
                          </label>
                          <input
                            type="text"
                            placeholder="20-38452109-4"
                            value={cuil}
                            maxLength={13}
                            onChange={(e) => setCuil(e.target.value)}
                            style={{
                              width: '100%',
                              height: '42px',
                              padding: '0 12px',
                              borderRadius: '10px',
                              background: 'var(--color-surface-raised)',
                              border: `1px solid ${formErrors.cuil ? '#ef4444' : 'var(--surface-glass-border)'}`,
                              color: 'var(--text-primary)',
                              fontSize: '14px',
                              boxSizing: 'border-box',
                            }}
                          />
                          {formErrors.cuil && <span style={{ fontSize: '11px', color: '#ef4444' }}>{formErrors.cuil}</span>}
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                          Fecha de Nacimiento (Mayor de 18 años requerida por Ley) *
                        </label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            style={{
                              width: '100%',
                              height: '42px',
                              paddingLeft: '38px',
                              paddingRight: '12px',
                              borderRadius: '10px',
                              background: 'var(--color-surface-raised)',
                              border: `1px solid ${formErrors.birthDate ? '#ef4444' : 'var(--surface-glass-border)'}`,
                              color: 'var(--text-primary)',
                              fontSize: '14px',
                              boxSizing: 'border-box',
                            }}
                          />
                          <Calendar size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
                        </div>
                        {formErrors.birthDate && <span style={{ fontSize: '11px', color: '#ef4444' }}>{formErrors.birthDate}</span>}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: '10px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                            Domicilio Real *
                          </label>
                          <input
                            type="text"
                            placeholder="Ej: Av. Libertador 4450"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            style={{
                              width: '100%',
                              height: '42px',
                              padding: '0 12px',
                              borderRadius: '10px',
                              background: 'var(--color-surface-raised)',
                              border: `1px solid ${formErrors.address ? '#ef4444' : 'var(--surface-glass-border)'}`,
                              color: 'var(--text-primary)',
                              fontSize: '13px',
                              boxSizing: 'border-box',
                            }}
                          />
                          {formErrors.address && <span style={{ fontSize: '11px', color: '#ef4444' }}>{formErrors.address}</span>}
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                            Ciudad *
                          </label>
                          <input
                            type="text"
                            placeholder="Ej: CABA"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            style={{
                              width: '100%',
                              height: '42px',
                              padding: '0 12px',
                              borderRadius: '10px',
                              background: 'var(--color-surface-raised)',
                              border: `1px solid ${formErrors.city ? '#ef4444' : 'var(--surface-glass-border)'}`,
                              color: 'var(--text-primary)',
                              fontSize: '13px',
                              boxSizing: 'border-box',
                            }}
                          />
                          {formErrors.city && <span style={{ fontSize: '11px', color: '#ef4444' }}>{formErrors.city}</span>}
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                            Provincia *
                          </label>
                          <select
                            value={province}
                            onChange={(e) => setProvince(e.target.value)}
                            style={{
                              width: '100%',
                              height: '42px',
                              padding: '0 8px',
                              borderRadius: '10px',
                              background: 'var(--color-surface-raised)',
                              border: '1px solid var(--surface-glass-border)',
                              color: 'var(--text-primary)',
                              fontSize: '13px',
                              boxSizing: 'border-box',
                            }}
                          >
                            <option value="CABA">CABA</option>
                            <option value="Buenos Aires">Buenos Aires</option>
                            <option value="Córdoba">Córdoba</option>
                            <option value="Santa Fe">Santa Fe</option>
                            <option value="Mendoza">Mendoza</option>
                            <option value="Otra">Otra</option>
                          </select>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Desarrolladora / Constructora Legal Fields */
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                            Tipo Societario (Ley 19.550) *
                          </label>
                          <select
                            value={companyType}
                            onChange={(e) => setCompanyType(e.target.value)}
                            style={{
                              width: '100%',
                              height: '42px',
                              padding: '0 10px',
                              borderRadius: '10px',
                              background: 'var(--color-surface-raised)',
                              border: '1px solid var(--surface-glass-border)',
                              color: 'var(--text-primary)',
                              fontSize: '13px',
                              boxSizing: 'border-box',
                            }}
                          >
                            <option value="Sociedad Anónima (S.A.)">Sociedad Anónima (S.A.)</option>
                            <option value="Sociedad por Acciones Simplificada (S.A.S.)">Sociedad por Acciones Simplificada (S.A.S.)</option>
                            <option value="Sociedad de Responsabilidad Limitada (S.R.L.)">Sociedad de Responsabilidad Limitada (S.R.L.)</option>
                            <option value="Fideicomiso Inmobiliario Ordinario">Fideicomiso Inmobiliario Ordinario</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                            CUIT Societario (11 dígitos) *
                          </label>
                          <input
                            type="text"
                            placeholder="30-71458923-8"
                            value={cuit}
                            onChange={(e) => setCuit(e.target.value)}
                            style={{
                              width: '100%',
                              height: '42px',
                              padding: '0 12px',
                              borderRadius: '10px',
                              background: 'var(--color-surface-raised)',
                              border: `1px solid ${formErrors.cuit ? '#ef4444' : 'var(--surface-glass-border)'}`,
                              color: 'var(--text-primary)',
                              fontSize: '14px',
                              boxSizing: 'border-box',
                            }}
                          />
                          {formErrors.cuit && <span style={{ fontSize: '11px', color: '#ef4444' }}>{formErrors.cuit}</span>}
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                            Inscripción Registral (IGJ/DPPJ) *
                          </label>
                          <input
                            type="text"
                            placeholder="Ej: Correlativo N° 1894234"
                            value={registrationNumber}
                            onChange={(e) => setRegistrationNumber(e.target.value)}
                            style={{
                              width: '100%',
                              height: '42px',
                              padding: '0 12px',
                              borderRadius: '10px',
                              background: 'var(--color-surface-raised)',
                              border: `1px solid ${formErrors.registrationNumber ? '#ef4444' : 'var(--surface-glass-border)'}`,
                              color: 'var(--text-primary)',
                              fontSize: '13px',
                              boxSizing: 'border-box',
                            }}
                          />
                          {formErrors.registrationNumber && <span style={{ fontSize: '11px', color: '#ef4444' }}>{formErrors.registrationNumber}</span>}
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                            Domicilio Legal y Sede *
                          </label>
                          <input
                            type="text"
                            placeholder="Ej: Av. Corrientes 1234, CABA"
                            value={legalAddress}
                            onChange={(e) => setLegalAddress(e.target.value)}
                            style={{
                              width: '100%',
                              height: '42px',
                              padding: '0 12px',
                              borderRadius: '10px',
                              background: 'var(--color-surface-raised)',
                              border: `1px solid ${formErrors.legalAddress ? '#ef4444' : 'var(--surface-glass-border)'}`,
                              color: 'var(--text-primary)',
                              fontSize: '13px',
                              boxSizing: 'border-box',
                            }}
                          />
                          {formErrors.legalAddress && <span style={{ fontSize: '11px', color: '#ef4444' }}>{formErrors.legalAddress}</span>}
                        </div>
                      </div>

                      {/* Representante Legal Section */}
                      <div
                        style={{
                          padding: '14px',
                          borderRadius: '12px',
                          background: 'var(--color-surface-raised)',
                          border: '1px solid var(--surface-glass-border)',
                          marginTop: '4px',
                        }}
                      >
                        <span style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
                          Representante Legal con Poder Suficiente
                        </span>

                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '10px', marginBottom: '10px' }}>
                          <input
                            type="text"
                            placeholder="Nombre del Representante"
                            value={repFullName}
                            onChange={(e) => setRepFullName(e.target.value)}
                            style={{
                              height: '38px',
                              padding: '0 10px',
                              borderRadius: '8px',
                              background: 'var(--surface-card)',
                              border: `1px solid ${formErrors.repFullName ? '#ef4444' : 'var(--surface-glass-border)'}`,
                              color: 'var(--text-primary)',
                              fontSize: '13px',
                            }}
                          />
                          <input
                            type="text"
                            placeholder="Cargo (ej: Presidente)"
                            value={repRole}
                            onChange={(e) => setRepRole(e.target.value)}
                            style={{
                              height: '38px',
                              padding: '0 10px',
                              borderRadius: '8px',
                              background: 'var(--surface-card)',
                              border: '1px solid var(--surface-glass-border)',
                              color: 'var(--text-primary)',
                              fontSize: '13px',
                            }}
                          />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <input
                            type="text"
                            placeholder="DNI del Representante"
                            value={repDni}
                            maxLength={8}
                            onChange={(e) => setRepDni(e.target.value.replace(/\D/g, ''))}
                            style={{
                              height: '38px',
                              padding: '0 10px',
                              borderRadius: '8px',
                              background: 'var(--surface-card)',
                              border: `1px solid ${formErrors.repDni ? '#ef4444' : 'var(--surface-glass-border)'}`,
                              color: 'var(--text-primary)',
                              fontSize: '13px',
                            }}
                          />
                          <input
                            type="text"
                            placeholder="CUIL del Representante"
                            value={repCuil}
                            onChange={(e) => setRepCuil(e.target.value)}
                            style={{
                              height: '38px',
                              padding: '0 10px',
                              borderRadius: '8px',
                              background: 'var(--surface-card)',
                              border: `1px solid ${formErrors.repCuil ? '#ef4444' : 'var(--surface-glass-border)'}`,
                              color: 'var(--text-primary)',
                              fontSize: '13px',
                            }}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setRegisterStep(1)}
                      style={{
                        flex: 1,
                        height: '46px',
                        borderRadius: '10px',
                        background: 'transparent',
                        border: '1px solid var(--surface-glass-border)',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 600,
                      }}
                    >
                      Atrás
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (validateStep2()) setRegisterStep(3);
                      }}
                      className="btn-primary"
                      style={{ flex: 2, height: '46px', borderRadius: '10px', gap: '8px' }}
                    >
                      <span>Declaraciones Regulatorias</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Declaraciones Juradas y Consentimientos (Obligatorios legal.md) */}
              {registerStep === 3 && (
                <div style={{ display: 'grid', gap: '18px' }}>
                  {/* Origen de fondos & PEP */}
                  <div
                    style={{
                      padding: '16px',
                      borderRadius: '14px',
                      background: 'var(--color-surface-raised)',
                      border: '1px solid var(--surface-glass-border)',
                    }}
                  >
                    <span style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                      Prevención de Lavado de Activos (Res. UIF 49/2024)
                    </span>

                    {role === 'investor' && (
                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                          Origen Lícito de los Fondos Declarado *
                        </label>
                        <select
                          value={fundsOrigin}
                          onChange={(e) => setFundsOrigin(e.target.value)}
                          style={{
                            width: '100%',
                            height: '38px',
                            padding: '0 10px',
                            borderRadius: '8px',
                            background: 'var(--surface-card)',
                            border: '1px solid var(--surface-glass-border)',
                            color: 'var(--text-primary)',
                            fontSize: '13px',
                          }}
                        >
                          <option value="Ahorros / Ingresos laborales">Ahorros personales / Ingresos laborales</option>
                          <option value="Venta de Inmueble previo">Venta previa de inmueble</option>
                          <option value="Actividad Comercial / Honorarios">Actividad comercial / Facturación independiente</option>
                          <option value="Rentas de Inversiones">Rentas de inversiones anteriores</option>
                          <option value="Herencia / Donación">Herencia o donación familiar</option>
                        </select>
                      </div>
                    )}

                    {/* PEP Selector */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid var(--surface-glass-border)' }}>
                      <div>
                        <strong style={{ fontSize: '13px', display: 'block', color: 'var(--text-primary)' }}>
                          ¿Es Persona Expuesta Políticamente (PEP)?
                        </strong>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          Conforme a nómina de cargos públicos de la Unidad de Información Financiera.
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => setIsPep(false)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '8px',
                            border: !isPep ? '2px solid var(--text-primary)' : '1px solid var(--surface-glass-border)',
                            background: !isPep ? 'var(--btn-primary-bg)' : 'transparent',
                            color: !isPep ? 'var(--btn-primary-text)' : 'var(--text-muted)',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          NO
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsPep(true)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '8px',
                            border: isPep ? '2px solid #d97706' : '1px solid var(--surface-glass-border)',
                            background: isPep ? '#d97706' : 'transparent',
                            color: isPep ? '#ffffff' : 'var(--text-muted)',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          SÍ
                        </button>
                      </div>
                    </div>

                    {/* Sujeto Obligado UIF (Inversor) */}
                    {role === 'investor' && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid var(--surface-glass-border)' }}>
                        <div>
                          <strong style={{ fontSize: '13px', display: 'block', color: 'var(--text-primary)' }}>
                            ¿Es Sujeto Obligado ante la UIF?
                          </strong>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            Escribano, contador, despachante, remesador o afín (Ley 25.246).
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => setIsObligatedSubject(false)}
                            style={{
                              padding: '6px 14px',
                              borderRadius: '8px',
                              border: !isObligatedSubject ? '2px solid var(--text-primary)' : '1px solid var(--surface-glass-border)',
                              background: !isObligatedSubject ? 'var(--btn-primary-bg)' : 'transparent',
                              color: !isObligatedSubject ? 'var(--btn-primary-text)' : 'var(--text-muted)',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            NO
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsObligatedSubject(true)}
                            style={{
                              padding: '6px 14px',
                              borderRadius: '8px',
                              border: isObligatedSubject ? '2px solid #d97706' : '1px solid var(--surface-glass-border)',
                              background: isObligatedSubject ? '#d97706' : 'transparent',
                              color: isObligatedSubject ? '#ffffff' : 'var(--text-muted)',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            SÍ
                          </button>
                        </div>
                      </div>
                    )}

                    {role === 'developer' && (
                      <div style={{ paddingTop: '10px', borderTop: '1px solid var(--surface-glass-border)' }}>
                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', fontSize: '12px' }}>
                          <input
                            type="checkbox"
                            checked={uboDeclared}
                            onChange={(e) => setUboDeclared(e.target.checked)}
                            style={{ marginTop: '2px', accentColor: 'var(--text-primary)' }}
                          />
                          <span style={{ color: 'var(--text-primary)', lineHeight: 1.4 }}>
                            Declaro contar con la constancia de Beneficiarios Finales (UBO con +10% de cuotas o acciones) lista para adjuntar en la auditoría de cada proyecto (Res. UIF 49/2024).
                          </span>
                        </label>
                        {formErrors.uboDeclared && <span style={{ fontSize: '11px', color: '#ef4444', display: 'block', marginTop: '4px' }}>{formErrors.uboDeclared}</span>}
                      </div>
                    )}
                  </div>

                  {/* Independent Consent Checkboxes per legal.md Section 7.6 */}
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '12px' }}>
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        style={{ marginTop: '3px', accentColor: 'var(--text-primary)' }}
                      />
                      <span style={{ color: 'var(--text-primary)', lineHeight: 1.45 }}>
                        He leído y acepto los <strong style={{ textDecoration: 'underline' }}>Términos y Condiciones Generales</strong> de Krea Nova (v1.0 - 2026). *
                      </span>
                    </label>
                    {formErrors.termsAccepted && <span style={{ fontSize: '11px', color: '#ef4444' }}>{formErrors.termsAccepted}</span>}

                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '12px' }}>
                      <input
                        type="checkbox"
                        checked={privacyAccepted}
                        onChange={(e) => setPrivacyAccepted(e.target.checked)}
                        style={{ marginTop: '3px', accentColor: 'var(--text-primary)' }}
                      />
                      <span style={{ color: 'var(--text-primary)', lineHeight: 1.45 }}>
                        Presto <strong style={{ textDecoration: 'underline' }}>consentimiento expreso e informado</strong> para el tratamiento de mis datos personales en los términos de la <strong>Ley 25.326</strong>. *
                      </span>
                    </label>
                    {formErrors.privacyAccepted && <span style={{ fontSize: '11px', color: '#ef4444' }}>{formErrors.privacyAccepted}</span>}

                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '12px' }}>
                      <input
                        type="checkbox"
                        checked={swornTruthAccepted}
                        onChange={(e) => setSwornTruthAccepted(e.target.checked)}
                        style={{ marginTop: '3px', accentColor: 'var(--text-primary)' }}
                      />
                      <span style={{ color: 'var(--text-primary)', lineHeight: 1.45 }}>
                        Declaro bajo juramento que los datos suministrados son exactos, verídicos y se mantendrán actualizados. *
                      </span>
                    </label>
                    {formErrors.swornTruthAccepted && <span style={{ fontSize: '11px', color: '#ef4444' }}>{formErrors.swornTruthAccepted}</span>}

                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '12px' }}>
                      <input
                        type="checkbox"
                        checked={marketingOptIn}
                        onChange={(e) => setMarketingOptIn(e.target.checked)}
                        style={{ marginTop: '3px', accentColor: 'var(--text-primary)' }}
                      />
                      <span style={{ color: 'var(--text-muted)', lineHeight: 1.45 }}>
                        Deseo recibir informes periódicos del mercado inmobiliario y nuevos lanzamientos (opcional).
                      </span>
                    </label>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setRegisterStep(2)}
                      style={{
                        flex: 1,
                        height: '46px',
                        borderRadius: '10px',
                        background: 'transparent',
                        border: '1px solid var(--surface-glass-border)',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 600,
                      }}
                    >
                      Atrás
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                      style={{ flex: 2, height: '46px', borderRadius: '10px', gap: '8px' }}
                    >
                      <span>Finalizar Registro y Validar</span>
                      <ShieldCheck size={16} />
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}

        {/* Reassuring Security Badge */}
        <div
          style={{
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid var(--surface-glass-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            color: 'var(--text-subtle)',
            fontSize: '12px',
          }}
        >
          <ShieldCheck size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <span>Tus datos y operaciones están completamente protegidos</span>
        </div>
      </div>

      {/* Subtle Academic Prototype Badge */}
      <div
        style={{
          marginTop: '18px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '11px',
          color: 'var(--text-subtle)',
          opacity: 0.85,
        }}
      >
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#d97706' }} />
        <span>Modo Académico Demostrativo · Operaciones y saldos simulados</span>
      </div>
    </div>
  );
};
