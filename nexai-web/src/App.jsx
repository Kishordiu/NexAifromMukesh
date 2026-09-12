import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SyncProvider } from './contexts/SyncContext';

import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';
import ProtectedRoute from './components/navigation/ProtectedRoute';
import HuskyLogin from './components/auth/HuskyLogin';
import MotherDashboard from './features/dashboard/pages/MotherDashboard';
import VaultSettings from './features/vault/pages/VaultSettings';
import VitalsScan from './features/vitals/pages/VitalsScan';
import LabOCR from './features/lab-ocr/pages/LabOCR';
import AnemiaScan from './features/anemia/pages/AnemiaScan';
import ScleraScan from './features/sclera/pages/ScleraScan';
import VoiceTriage from './features/triage/pages/VoiceTriage';
import EmergencyFlow from './features/emergency/pages/EmergencyFlow';
import ReportsList from './features/reports/pages/ReportsList';
import ReportDetail from './features/reports/pages/ReportDetail';
import ClinicianDashboard from './features/clinician/pages/ClinicianDashboard';
import PatientDetail from './features/clinician/pages/PatientDetail';

import RoleGuard from './components/navigation/RoleGuard';
import AdminDashboard from './features/admin/pages/AdminDashboard';
import DomainsAdmin from './features/admin/pages/DomainsAdmin';
import DomainEditor from './features/admin/pages/DomainEditor';
import OrganisersAdmin from './features/admin/pages/OrganisersAdmin';
import OrganiserEditor from './features/admin/pages/OrganiserEditor';

const LoadingFallback = () => (
 <div className="flex h-screen items-center justify-center">
 <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
 </div>
);

function AppRoutes() {
 const { isAuthenticated } = useAuth();
 
 return (
 <Suspense fallback={<LoadingFallback />}>
 <Routes>
 {/* Public Auth Routes */}
 <Route element={<AuthLayout />}>
 <Route path="/login" element={<HuskyLogin />} />
 </Route>

 {/* Protected App Routes */}
 <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
 <Route path="/" element={<Navigate to="/home" replace />} />
 <Route path="/home" element={<MotherDashboard />} />
 <Route path="/scan" element={<VitalsScan />} />
 <Route path="/scan/anemia" element={<AnemiaScan />} />
 <Route path="/scan/sclera" element={<ScleraScan />} />
 <Route path="/triage" element={<VoiceTriage />} />
 <Route path="/ocr" element={<LabOCR />} />
 <Route path="/reports" element={<ReportsList />} />
 <Route path="/reports/:id" element={<ReportDetail />} />
 <Route path="/settings" element={<VaultSettings />} />
 <Route path="/emergency" element={<EmergencyFlow />} />
 <Route path="/clinician" element={<ClinicianDashboard />} />
 <Route path="/clinician/patient/:id" element={<PatientDetail />} />
 </Route>
 </Routes>
 </Suspense>
 );
}

export default function App() {
 return (
 <BrowserRouter>
 <ThemeProvider>
 <AuthProvider>
 <SyncProvider>
 <AppRoutes />
 </SyncProvider>
 </AuthProvider>
 </ThemeProvider>
 </BrowserRouter>
 );
}
