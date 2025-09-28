import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Card from '../components/Card'

const ContributorRolePage = () => {
  const navigate = useNavigate()

  const handleRoleSelection = (role) => {
    // Store selected role in localStorage or context
    localStorage.setItem('selectedRole', role)
    navigate('/reports')
  }

  const roles = [
    {
      name: 'Coastal Guard',
      priority: 9,
      trust: 'High trust',
      description: 'Official coastal security personnel with highest priority access',
      icon: '🛡️',
      color: 'bg-coral-gradient text-white'
    },
    {
      name: 'Disaster Manager',
      priority: 8,
      trust: 'High trust',
      description: 'Emergency management professionals with elevated priority',
      icon: '🚨',
      color: 'bg-sand-gradient text-white'
    },
    {
      name: 'General Volunteer',
      priority: 5,
      trust: 'High trust',
      description: 'Community volunteers contributing to coastal safety',
      icon: '👥',
      color: 'bg-ocean-gradient text-white'
    },
    {
      name: 'Coastal Resident',
      priority: 3,
      trust: 'High trust',
      description: 'Local residents with direct coastal area knowledge',
      icon: '🏠',
      color: 'bg-wave-gradient text-white'
    }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showNav={true} />
      
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Page Title */}
          <div className="text-center mb-12">
            <div className="text-5xl mb-4 wave-animation">👥</div>
            <h1 className="text-5xl font-bold ocean-text mb-4">
              Field Contributor Access
            </h1>
            <p className="text-lg text-ocean-600 max-w-3xl mx-auto leading-relaxed">
              Please select your primary role. This determines the weight & priority of your reports.
              Your role selection helps us prioritize and validate reports based on your expertise and location.
            </p>
          </div>

          {/* Role Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            {roles.map((role, index) => (
              <Card 
                key={index}
                onClick={() => handleRoleSelection(role.name)}
                className="relative"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">{role.icon}</span>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {role.name}
                      </h3>
                      <p className="text-sm text-gray-600">{role.trust}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${role.color}`}>
                    Priority {role.priority}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6">
                  {role.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Report weight: {role.priority}/10
                  </div>
                  <button className="btn-primary">
                    Select Role
                  </button>
                </div>
              </Card>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-12 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              About Role Priorities
            </h3>
            <p className="text-gray-600">
              Higher priority roles receive faster processing and greater weight in our verification system. 
              All roles are trusted contributors, but priority levels help us allocate resources effectively 
              during critical situations.
            </p>
          </div>
        </div>
      </main>

      <Footer variant="support" />
    </div>
  )
}

export default ContributorRolePage
