import { Routes, Route } from 'react-router-dom'
import { ReportsProvider } from './context/ReportsContext'
import LoginPage from './pages/LoginPage'
import ContributorRolePage from './pages/ContributorRolePage'
import ReportsPage from './pages/ReportsPage'
import ReportHazardPage from './pages/ReportHazardPage'

function App() {
  return (
    <ReportsProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/contributor-role" element={<ContributorRolePage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/report-hazard" element={<ReportHazardPage />} />
        </Routes>
      </div>
    </ReportsProvider>
  )
}

export default App
