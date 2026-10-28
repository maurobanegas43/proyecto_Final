import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'investor' | 'developer' | 'admin';
export type UserType = 'individual' | 'corporate';
export type KycStatus = 'pending' | 'verified' | 'requires_documentation' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  userType: UserType;
  taxId?: string; // DNI, CUIL or CUIT
  legalName?: string; // Full legal name or Company trade name
  companyType?: string; // SA, SRL, SAS, Fideicomiso
  legalRepresentative?: string;
  kycStatus: KycStatus;
  isKycVerified: boolean;
  pepDeclared: boolean;
  livenessVerified?: boolean;
  googleVerified?: boolean;
  termsAcceptedAt: string;
  privacyAcceptedAt: string;
}

interface RegisterInvestorPayload {
  fullName: string;
  email: string;
  phone: string;
  dni: string;
  cuil: string;
  birthDate: string;
  address: string;
  city: string;
  province: string;
  isPep: boolean;
  isObligatedSubject: boolean;
  fundsOrigin: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  googleIdToken?: string;
  livenessVerified?: boolean;
  livenessProofHash?: string;
  livenessSessionId?: string;
  livenessToken?: string;
}

interface RegisterCorporatePayload {
  companyName: string;
  tradeName: string;
  companyType: string;
  cuit: string;
  registrationNumber: string;
  legalAddress: string;
  repFullName: string;
  repRole: string;
  repDni: string;
  repCuil: string;
  email: string;
  phone: string;
  isPep: boolean;
  uboDeclared: boolean;
  termsAccepted: boolean;
  privacyAccepted: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, role?: UserRole, extra?: Partial<User>) => void;
  registerInvestor: (payload: RegisterInvestorPayload) => void;
  registerCorporate: (payload: RegisterCorporatePayload) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always start unauthenticated by default so fresh visits are public
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, role: UserRole = 'investor', extra?: Partial<User>) => {
    const newUser: User = {
      id: extra?.id || 'usr-' + Math.random().toString(36).substring(2, 7),
      name: extra?.name || email.split('@')[0].toUpperCase(),
      email,
      role,
      userType: role === 'developer' ? 'corporate' : 'individual',
      taxId: extra?.taxId,
      legalName: extra?.legalName,
      companyType: extra?.companyType,
      legalRepresentative: extra?.legalRepresentative,
      kycStatus: 'verified',
      isKycVerified: true,
      pepDeclared: false,
      termsAcceptedAt: new Date().toISOString(),
      privacyAcceptedAt: new Date().toISOString(),
      ...extra,
    };
    setUser(newUser);
  };

  const registerInvestor = (payload: RegisterInvestorPayload) => {
    const newUser: User = {
      id: 'inv-' + Math.random().toString(36).substring(2, 8),
      name: payload.fullName,
      email: payload.email,
      role: 'investor',
      userType: 'individual',
      taxId: payload.cuil || payload.dni,
      legalName: payload.fullName,
      kycStatus: 'verified', // Simulation: auto-verified for prototype
      isKycVerified: true,
      pepDeclared: payload.isPep,
      livenessVerified: payload.livenessVerified ?? true,
      googleVerified: !!payload.googleIdToken,
      termsAcceptedAt: new Date().toISOString(),
      privacyAcceptedAt: new Date().toISOString(),
    };
    setUser(newUser);
  };

  const registerCorporate = (payload: RegisterCorporatePayload) => {
    const newUser: User = {
      id: 'dev-' + Math.random().toString(36).substring(2, 8),
      name: payload.tradeName || payload.companyName,
      email: payload.email,
      role: 'developer',
      userType: 'corporate',
      taxId: payload.cuit,
      legalName: payload.companyName,
      companyType: payload.companyType,
      legalRepresentative: payload.repFullName,
      kycStatus: 'verified', // Simulation: auto-verified for prototype
      isKycVerified: true,
      pepDeclared: payload.isPep,
      termsAcceptedAt: new Date().toISOString(),
      privacyAcceptedAt: new Date().toISOString(),
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        registerInvestor,
        registerCorporate,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
