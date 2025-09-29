import { useNavigate } from 'react-router-dom'
// Removed unused auth imports: getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged
import Footer from '../components/Footer'
import Card from '../components/Card'

// Function to get a unique ID for the user, creating one if it doesn't exist
const getOrCreatePersistentId = () => {
  let mockId = localStorage.getItem('mockId');
  if (!mockId) {
    // Generate a new unique ID if none exists (simulating new user registration)
    mockId = `user_${crypto.randomUUID()}`;
    localStorage.setItem('mockId', mockId);
  }
  return mockId;
};

const LoginPage = () => {
  const navigate = useNavigate()

  const handleFieldContributorLogin = () => {
    // 1. Get/Create the persistent ID for tracking user reports across devices
    const persistentId = getOrCreatePersistentId();
    
    // 2. Store the role and the persistent ID in localStorage
    localStorage.setItem('userRole', 'Field Contributor');
    localStorage.setItem('selectedRole', 'Coastal Resident'); // Default sub-role for nav/flow clarity
    
    // 3. Navigate
    navigate('/contributor-role')
  }

  const handleAdministratorLogin = () => {
    // 1. Get/Create the persistent ID (Admins also need an ID for audit tracking)
    const persistentId = getOrCreatePersistentId();
    
    // 2. Store the role and the persistent ID
    localStorage.setItem('userRole', 'Administrator');
    localStorage.setItem('selectedRole', 'INCOIS Analyst'); // Default sub-role for Admins
    
    // 3. Navigate
    navigate('/admin-dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Page Title */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <div className="text-6xl mb-4 wave-animation">🌊</div>
              <h1 className="text-5xl font-bold ocean-text mb-4">
                INCOIS Hazard Platform
              </h1>
            </div>
            <p className="text-lg text-ocean-700 max-w-3xl mx-auto leading-relaxed">
              Developed in collaboration with the <span className="font-semibold text-ocean-800">Indian National Centre for Ocean Information Services (INCOIS)</span>, this platform provides a unified system for reporting and monitoring coastal hazards. It strengthens INCOIS's early warning services by integrating real-time citizen reports and supporting safer, more resilient coastal communities.
            </p>
          </div>

          {/* Role Selection Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-semibold text-ocean-800 text-center mb-8">
              🎯 Select your access role to proceed
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Field Contributor Card */}
              <Card onClick={handleFieldContributorLogin} className="text-center group hover:scale-105 transition-transform duration-300 cursor-pointer">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-ocean-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <div className="text-3xl">👥</div>
                  </div>
                  <h3 className="text-2xl font-bold text-ocean-800 mb-3">
                    Field Contributor
                  </h3>
                  <p className="text-ocean-600 mb-4 leading-relaxed">
                    Report incidents and contribute to coastal safety monitoring
                  </p>
                  <div className="text-sm text-ocean-500 mb-6 space-y-1">
                    <p className="flex items-center justify-center"><span className="mr-2">🏃‍♂️</span> General Volunteer</p>
                    <p className="flex items-center justify-center"><span className="mr-2">🏠</span> Coastal Resident</p>
                    <p className="flex items-center justify-center"><span className="mr-2">🛡️</span> Coastal Guard</p>
                  </div>
                </div>
                <button className="btn-primary w-full text-lg py-4">
                    Login as Field Contributor
                </button>
              </Card>

              {/* Administrator Card */}
              <Card onClick={handleAdministratorLogin} className="text-center group hover:scale-105 transition-transform duration-300 cursor-pointer">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-wave-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <div className="text-3xl">⚙️</div>
                  </div>
                  <h3 className="text-2xl font-bold text-ocean-800 mb-3">
                    Administrator
                  </h3>
                  <p className="text-ocean-600 mb-4 leading-relaxed">
                    Manage event status and resource updates
                  </p>
                  <div className="text-sm text-ocean-500 mb-6 space-y-1">
                    <p className="flex items-center justify-center"><span className="mr-2">📊</span> Event status management</p>
                    <p className="flex items-center justify-center"><span className="mr-2">🔄</span> Resource updates</p>
                  </div>
                </div>
                <button className="btn-primary w-full text-lg py-4">
                    Login as Administrator
                </button>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer variant="login" />
    </div>
  )
}

export default LoginPage
