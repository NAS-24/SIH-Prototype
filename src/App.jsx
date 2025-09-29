import { Routes, Route } from 'react-router-dom'
import { ReportsProvider, useReports } from './context/ReportsContext'
import LoginPage from './pages/LoginPage'
import ContributorRolePage from './pages/ContributorRolePage'
import ReportsPage from './pages/ReportsPage'
import ReportHazardPage from './pages/ReportHazardPage'
import AdminDashboardPage from './pages/AdminDashboardPage' 
import { Loader2, AlertTriangle } from 'lucide-react' // Import icons for status display

// Wrapper component that waits for the ReportsContext to be ready
function AppContent() {
  // Access state flags from the context
  const { isAuthReady, configError } = useReports();
  
  // 1. Configuration/Firebase Error State
  if (configError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-red-700 bg-red-100">
        <AlertTriangle size={32} className="mb-4" />
        <h2 className="text-2xl font-bold">Configuration Error</h2>
        <p className="text-center">Cannot connect to Firebase. Please check your console logs or Firebase configuration settings.</p>
      </div>
    );
  }

  // 2. Loading State (Waiting for Authentication/DB initialization)
  if (!isAuthReady) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl text-gray-700">
        <Loader2 className="animate-spin mr-3" size={24} /> Initializing Platform Services...
      </div>
    );
  }

  // 3. Application Ready State
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/contributor-role" element={<ContributorRolePage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/report-hazard" element={<ReportHazardPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    // ReportsProvider loads the context (which initializes Firebase)
    <ReportsProvider>
      {/* AppContent renders the router ONLY when Firebase is ready */}
      <AppContent />
    </ReportsProvider>
  )
}

export default App;