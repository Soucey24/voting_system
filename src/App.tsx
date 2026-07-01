import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

const LandingPage = lazy(() => import('./pages/LandingPage').then((m) => ({ default: m.LandingPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage').then((m) => ({ default: m.HowItWorksPage })));
const FAQPage = lazy(() => import('./pages/FAQPage').then((m) => ({ default: m.FAQPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then((m) => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })));
const VerifyEmailPage = lazy(() => import('./pages/VerifyEmailPage').then((m) => ({ default: m.VerifyEmailPage })));
const FaceEnrollmentPage = lazy(() => import('./pages/FaceEnrollmentPage').then((m) => ({ default: m.FaceEnrollmentPage })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard').then((m) => ({ default: m.StudentDashboard })));
const OfficerDashboard = lazy(() => import('./pages/OfficerDashboard').then((m) => ({ default: m.OfficerDashboard })));
const AuditorDashboard = lazy(() => import('./pages/AuditorDashboard').then((m) => ({ default: m.AuditorDashboard })));

const CreateElectionSlotPage = lazy(() => import('./pages/officer/CreateElectionSlotPage').then((m) => ({ default: m.CreateElectionSlotPage })));
const PositionManagementNewPage = lazy(() => import('./pages/officer/PositionManagementNewPage').then((m) => ({ default: m.PositionManagementNewPage })));
const CandidateApprovalNewPage = lazy(() => import('./pages/officer/CandidateApprovalNewPage').then((m) => ({ default: m.CandidateApprovalNewPage })));
const PaymentManagementPage = lazy(() => import('./pages/officer/PaymentManagementPage').then((m) => ({ default: m.PaymentManagementPage })));
const TurnoutMonitoringNewPage = lazy(() => import('./pages/officer/TurnoutMonitoringNewPage').then((m) => ({ default: m.TurnoutMonitoringNewPage })));
const ResultsPublishingNewPage = lazy(() => import('./pages/officer/ResultsPublishingNewPage').then((m) => ({ default: m.ResultsPublishingNewPage })));
const StudentDataUploadNewPage = lazy(() => import('./pages/officer/StudentDataUploadNewPage').then((m) => ({ default: m.StudentDataUploadNewPage })));
const ElectionManagementNewPage = lazy(() => import('./pages/officer/ElectionManagementNewPage').then((m) => ({ default: m.ElectionManagementNewPage })));
const ReportsNewPage = lazy(() => import('./pages/officer/ReportsNewPage').then((m) => ({ default: m.ReportsNewPage })));

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    const dashboardRoutes: Record<string, string> = {
      admin: '/admin/dashboard',
      election_officer: '/officer/dashboard',
      auditor: '/auditor/dashboard',
      student: '/student/dashboard',
    };
    return <Navigate to={dashboardRoutes[user.role] || '/login'} replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    const dashboardRoutes: Record<string, string> = {
      admin: '/admin/dashboard',
      election_officer: '/officer/dashboard',
      auditor: '/auditor/dashboard',
      student: '/student/dashboard',
    };
    return <Navigate to={dashboardRoutes[user.role] || '/login'} replace />;
  }

  return <>{children}</>;
}

function PublicPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16 lg:pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading experience...</p>
          </div>
        </div>
      }
    >
      <Routes>
      {/* Public Pages */}
      <Route path="/" element={<PublicPage><LandingPage /></PublicPage>} />
      <Route path="/about" element={<PublicPage><AboutPage /></PublicPage>} />
      <Route path="/how-it-works" element={<PublicPage><HowItWorksPage /></PublicPage>} />
      <Route path="/faq" element={<PublicPage><FAQPage /></PublicPage>} />
      <Route path="/contact" element={<PublicPage><ContactPage /></PublicPage>} />

      {/* Auth Pages */}
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/verify-email" element={<PublicRoute><VerifyEmailPage /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />

      {/* Face Enrollment */}
      <Route
        path="/face-enrollment"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <FaceEnrollmentPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard/*"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      {/* Election Officer Routes */}
      <Route
        path="/officer/dashboard"
        element={
          <ProtectedRoute allowedRoles={['election_officer']}>
            <OfficerDashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Feature 2: Create Election Slots */}
      <Route
        path="/officer/election/create"
        element={
          <ProtectedRoute allowedRoles={['election_officer']}>
            <CreateElectionSlotPage />
          </ProtectedRoute>
        }
      />

      {/* Feature 4: Position Management */}
      <Route
        path="/officer/election/:electionId/positions"
        element={
          <ProtectedRoute allowedRoles={['election_officer']}>
            <PositionManagementNewPage />
          </ProtectedRoute>
        }
      />

      {/* Feature 5: Candidate Approval */}
      <Route
        path="/officer/election/:electionId/candidates"
        element={
          <ProtectedRoute allowedRoles={['election_officer']}>
            <CandidateApprovalNewPage />
          </ProtectedRoute>
        }
      />

      {/* Feature 3: Payment Management */}
      <Route
        path="/officer/election/:electionId/payments"
        element={
          <ProtectedRoute allowedRoles={['election_officer']}>
            <PaymentManagementPage />
          </ProtectedRoute>
        }
      />

      {/* Feature 8: Turnout Monitoring */}
      <Route
        path="/officer/election/:electionId/turnout"
        element={
          <ProtectedRoute allowedRoles={['election_officer']}>
            <TurnoutMonitoringNewPage />
          </ProtectedRoute>
        }
      />

      {/* Feature 9: Publish Results */}
      <Route
        path="/officer/election/:electionId/results"
        element={
          <ProtectedRoute allowedRoles={['election_officer']}>
            <ResultsPublishingNewPage />
          </ProtectedRoute>
        }
      />

      {/* Feature 6: Student Data Management */}
      <Route
        path="/officer/election/:electionId/students"
        element={
          <ProtectedRoute allowedRoles={['election_officer']}>
            <StudentDataUploadNewPage />
          </ProtectedRoute>
        }
      />

      {/* Feature 7: Election Management (publish, pause, resume, close) */}
      <Route
        path="/officer/election/:electionId/manage"
        element={
          <ProtectedRoute allowedRoles={['election_officer']}>
            <ElectionManagementNewPage />
          </ProtectedRoute>
        }
      />

      {/* Feature 10: Reports */}
      <Route
        path="/officer/reports"
        element={
          <ProtectedRoute allowedRoles={['election_officer']}>
            <ReportsNewPage />
          </ProtectedRoute>
        }
      />

      {/* Auditor Routes */}
      <Route
        path="/auditor/dashboard"
        element={
          <ProtectedRoute allowedRoles={['auditor']}>
            <AuditorDashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
