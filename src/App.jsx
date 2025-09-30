import { Routes, Route, useNavigate } from 'react-router-dom' 
import { ReportsProvider, useReports } from './context/ReportsContext'
import LoginPage from './pages/LoginPage'
import ContributorRolePage from './pages/ContributorRolePage'
import ReportsPage from './pages/ReportsPage'
import ReportHazardPage from './pages/ReportHazardPage'
import AdminDashboardPage from './pages/AdminDashboardPage' 
import { Loader2, AlertTriangle } from 'lucide-react' 
import { useEffect } from 'react' 

// Wrapper component that waits for the ReportsContext to be ready
function AppContent() {
    const navigate = useNavigate(); 
    // Access state flags from the context
    const { isAuthReady, configError } = useReports();
    
    // --- PERSISTENT LOGIN CHECK ---
    useEffect(() => {
        if (isAuthReady) {
            const savedRole = localStorage.getItem('userRole');
            const savedMockId = localStorage.getItem('mockId');
            const currentPage = window.location.pathname;
            
            // CRITICAL CHANGE: Only auto-redirect if the user is currently on the root page
            // AND the user is NOT already on the page they should be at.

            // 1. If the user has saved credentials and is trying to hit the root ('/'), redirect them to their last dashboard.
            if (savedMockId && savedRole && currentPage === '/') {
                
                if (savedRole === 'Administrator') {
                    // Admins go straight to the dashboard
                    navigate('/admin-dashboard', { replace: true });
                } else if (savedRole === 'Field Contributor') {
                    const selectedRole = localStorage.getItem('selectedRole');
                    if (selectedRole) {
                        // If they have a sub-role (Coastal Guard, Resident), go to reports
                        navigate('/reports', { replace: true });
                    } else {
                        // If primary role is saved but sub-role isn't, go to selection screen
                        navigate('/contributor-role', { replace: true });
                    }
                }
            } else if (!savedMockId && currentPage !== '/') {
                 // 2. If the user somehow lands on an inner page without an ID, kick them to login
                 navigate('/', { replace: true });
            }
        }
    }, [isAuthReady, navigate]);
    // ----------------------------

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
        <div className="bg-gray-50"> 
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
