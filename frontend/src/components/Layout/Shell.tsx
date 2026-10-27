import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  Sun,
  Moon,
  LogOut,
  Wallet,
} from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const Shell: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-deep)', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column' }}>
      {/* Clean Top Navigation Bar */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'var(--nav-bg)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--surface-glass-border)',
          transition: 'background-color 200ms ease, border-color 200ms ease',
        }}
      >
        <div
          className="container-responsive"
          style={{
            height: 'var(--topbar-height)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Brand */}
          <Link to="/" style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '20px',
                letterSpacing: '0.04em',
                color: 'var(--text-primary)',
                lineHeight: 1,
              }}
            >
              KREA NOVA
            </span>
            <span
              style={{
                fontSize: '9px',
                color: 'var(--text-subtle)',
                letterSpacing: '0.12em',
                fontWeight: 700,
                marginTop: '2px',
              }}
            >
              INVESTMENTS
            </span>
          </Link>

          {/* Simple Navigation - Adapts to Authentication State */}
          <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <NavLink
              to="/app/projects"
              style={({ isActive }) => ({
                fontSize: 'var(--text-base)',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                borderBottom: isActive ? '2px solid var(--text-primary)' : '2px solid transparent',
                padding: '8px 0',
                transition: 'all 150ms ease',
              })}
            >
              Oportunidades
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink
                  to="/app/portfolio"
                  style={({ isActive }) => ({
                    fontSize: 'var(--text-base)',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                    borderBottom: isActive ? '2px solid var(--text-primary)' : '2px solid transparent',
                    padding: '8px 0',
                    transition: 'all 150ms ease',
                  })}
                >
                  Mi Portfolio
                </NavLink>

                <NavLink
                  to="/app/secondary-market"
                  style={({ isActive }) => ({
                    fontSize: 'var(--text-base)',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                    borderBottom: isActive ? '2px solid var(--text-primary)' : '2px solid transparent',
                    padding: '8px 0',
                    transition: 'all 150ms ease',
                  })}
                >
                  Mercado Secundario
                </NavLink>
              </>
            ) : (
              <>
                <Link
                  to="/#como-funciona"
                  style={{
                    fontSize: 'var(--text-base)',
                    fontWeight: 500,
                    color: 'var(--text-muted)',
                    padding: '8px 0',
                    transition: 'all 150ms ease',
                  }}
                >
                  Cómo Funciona
                </Link>

                <Link
                  to="/#seguridad"
                  style={{
                    fontSize: 'var(--text-base)',
                    fontWeight: 500,
                    color: 'var(--text-muted)',
                    padding: '8px 0',
                    transition: 'all 150ms ease',
                  }}
                >
                  Seguridad Jurídica
                </Link>
              </>
            )}
          </nav>

          {/* Right Controls: Only show balance & user if authenticated, else show Ingresar/Crear Cuenta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
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
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {isAuthenticated ? (
              <>
                {/* Real User Balance */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--surface-card)',
                    border: '1px solid var(--surface-glass-border)',
                    fontSize: '13px',
                  }}
                >
                  <Wallet size={14} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ color: 'var(--text-muted)' }}>Saldo:</span>
                  <strong className="num" style={{ color: 'var(--text-primary)' }}>$15.325 USD</strong>
                </div>

                {/* User Avatar + Logout */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--btn-primary-bg)',
                      color: 'var(--btn-primary-text)',
                      fontSize: '12px',
                      fontWeight: 700,
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    {user?.name ? user.name.slice(0, 2) : 'US'}
                  </div>

                  <button
                    onClick={logout}
                    title="Cerrar sesión"
                    style={{
                      color: 'var(--text-subtle)',
                      display: 'grid',
                      placeItems: 'center',
                      padding: '4px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Unauthenticated CTAs: Pure Login / Register */}
                <Link
                  to="/auth?mode=login"
                  className="btn-secondary"
                  style={{ height: '36px', padding: '0 16px', fontSize: 'var(--text-sm)' }}
                >
                  Ingresar
                </Link>
                <Link
                  to="/auth?mode=register"
                  className="btn-primary"
                  style={{ height: '36px', padding: '0 16px', fontSize: 'var(--text-sm)' }}
                >
                  Crear Cuenta
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container-responsive" style={{ paddingTop: '36px', paddingBottom: '64px', flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
};
