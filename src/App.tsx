import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { AboutPage } from './pages/AboutPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { FAQPage } from './pages/FAQPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { FaceEnrollmentPage } from './pages/FaceEnrollmentPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { StudentDashboard } from './pages/StudentDashboard';
import { OfficerDashboard } from './pages/OfficerDashboard';
import { AuditorDashboard } from './pages/AuditorDashboard';

// Election Officer Pages - Comprehensive Modules
import { CreateElectionSlotPage } from './pages/officer/CreateElectionSlotPage';
import { PositionManagementNewPage } from './pages/officer/PositionManagementNewPage';
import { CandidateApprovalNewPage } from './pages/officer/CandidateApprovalNewPage';
import { PaymentManagementPage } from './pages/officer/PaymentManagementPage';
import { TurnoutMonitoringNewPage } from './pages/officer/TurnoutMonitoringNewPage';
import { ResultsPublishingNewPage } from './pages/officer/ResultsPublishingNewPage';
import { StudentDataUploadNewPage } from './pages/officer/StudentDataUploadNewPage';
import { ElectionManagementNewPage } from './pages/officer/ElectionManagementNewPage';
import { ReportsNewPage } from './pages/officer/ReportsNewPage';

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
