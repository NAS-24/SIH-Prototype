import { Link } from 'react-router-dom'

const Navbar = ({ showNav = true }) => {
  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-ocean-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mr-3 overflow-hidden bg-ocean-gradient shadow-lg group-hover:shadow-xl transition-all duration-300">
                <img
                  src="src/photos/shellLogo.jpg"
                  alt="BluShell Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl font-bold ocean-text">BluShell</span>
            </Link>
          </div>
          
          {showNav && (
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link 
                  to="/" 
                  className="nav-link"
                >
                  🏠 Home
                </Link>
                <Link 
                  to="/reports" 
                  className="nav-link"
                >
                  📊 My Reports
                </Link>
                <Link 
                  to="/report-hazard" 
                  className="nav-link"
                >
                  🚨 Report Hazard
                </Link>
                <div className="relative group">
                  <button
                    className="nav-link flex items-center"
                  >
                    🌐 Language
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute z-10 left-0 mt-2 w-32 bg-white/90 backdrop-blur-md border border-ocean-200 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto">
                    <ul>
                      <li>
                        <button className="block w-full text-left px-4 py-2 text-ocean-700 hover:bg-ocean-100 rounded-lg mx-1 my-1 transition-colors">🇺🇸 English</button>
                      </li>
                      <li>
                        <button className="block w-full text-left px-4 py-2 text-ocean-700 hover:bg-ocean-100 rounded-lg mx-1 my-1 transition-colors">🇮🇳 हिन्दी</button>
                      </li>
                      <li>
                        <button className="block w-full text-left px-4 py-2 text-ocean-700 hover:bg-ocean-100 rounded-lg mx-1 my-1 transition-colors">🇮🇳 मराठी</button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
