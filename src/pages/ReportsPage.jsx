import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReports } from '../context/ReportsContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Card from '../components/Card'
import StatusBadge from '../components/StatusBadge'
import AlertCard from '../components/AlertCard'

const ReportsPage = () => {
  const navigate = useNavigate()
  // FIX: Destructure persistentMockId instead of userId for cross-device tracking
  const { getMyReports, getAllReports, updateReportStatus, persistentMockId } = useReports() 
  const [activeTab, setActiveTab] = useState('my-reports')
  const [filter, setFilter] = useState('all')

  // --- CRITICAL ROLE CHECK ---
  const currentUserRole = localStorage.getItem('userRole');
  const isAdministrator = currentUserRole === 'Administrator';
  // ---------------------------

  // Get reports from context
  const myReports = getMyReports() // Filtered list for current user (uses persistentMockId filter in Context)
  const allReports = getAllReports() // Full list of all reports
  
  // Display the persistentMockId for debugging and identification
  const shortUserId = persistentMockId ? persistentMockId.substring(0, 8) : 'N/A';
  
  const incoisUpdates = [
    {
      type: 'advisory',
      title: 'Advisory: Moderate wind at Kutch region',
      description: 'Wind speeds expected to reach 25-30 km/h over the next 24 hours. Small craft advisory in effect.'
    },
    {
      type: 'warning',
      title: 'Warning: High wave Malabar coast region',
      description: 'Wave heights of 3-4 meters expected. Avoid coastal activities and fishing operations.'
    },
    {
      type: 'information',
      title: 'Information: Monsoon onset update by June 5th',
      description: 'IMD predicts monsoon onset in Kerala by June 5th, 2024. Prepare for seasonal weather changes.'
    }
  ]

  const getStatusText = (status) => {
    switch (status) {
      case 'received':
        return 'Received'
      case 'review':
        return 'Under Review'
      case 'verified':
        return 'Verified by INCOIS'
      case 'false':
        return 'False Alarm'
      default:
        return status
    }
  }

  // Tier 2: Handler for Verification Action (Re-implemented for compliance)
  const handleUpdateStatus = async (reportId, newStatus) => {
    if (!isAdministrator) {
        // This is a safety guardrail, though the button should be hidden.
        console.warn("Attempted status update denied: User is not an Administrator.");
        return;
    }
    // Optionally add a confirmation dialog here (using a custom modal)
    await updateReportStatus(reportId, newStatus);
  }

  const reportsToDisplay = activeTab === 'my-reports' 
    ? myReports 
    : allReports.filter(report => filter === 'all' || report.status === filter);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showNav={true} />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* User ID Display - Mandatory for collaborative environment */}
            <div className="text-right text-sm text-gray-500 mb-2">
                {/* Displaying full persistent Mock ID */}
                Your Reporter ID: <span className="font-mono text-ocean-700">{persistentMockId}</span>
            </div>
            
          {/* Page Title */}
          <div className="mb-8">
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div>
                <div className="text-4xl mb-3 wave-animation">📊</div>
                <h1 className="text-4xl font-bold ocean-text mb-3">
                  Reports & Status Tracker
                </h1>
                <p className="text-ocean-600 text-lg">
                  Monitor your reports and stay updated with the latest INCOIS information
                </p>
              </div>
              <button
                onClick={() => navigate('/report-hazard')}
                className="btn-primary text-lg px-8 py-4 whitespace-nowrap"
              >
                🚨 Report New Hazard
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Reports */}
            <div className="lg:col-span-2">
              {/* Tab Navigation */}
              <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('my-reports')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'my-reports'
                      ? 'bg-white text-ocean-500 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  My Reports ({myReports.length})
                </button>
                <button
                  onClick={() => setActiveTab('all-reports')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'all-reports'
                      ? 'bg-white text-ocean-500 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All Reports ({allReports.length})
                </button>
              </div>

              {/* All Reports Filter (Tier 2) */}
              {activeTab === 'all-reports' && (
                <div className="mb-4">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    >
                        <option value="all">All Status</option>
                        <option value="received">Received</option>
                        <option value="review">Under Review</option>
                        <option value="verified">Verified</option>
                        <option value="false">False Alarm</option>
                    </select>
                </div>
              )}

              {/* Reports List */}
              <div className="space-y-4">
                {reportsToDisplay.length === 0 ? (
                  <Card hover={false}>
                    <div className="text-center py-12">
                      <div className="text-6xl mb-6 float-animation">🌊</div>
                      <h3 className="text-2xl font-bold text-ocean-800 mb-3">No reports yet</h3>
                      <p className="text-ocean-600 mb-8 text-lg">Start by reporting a hazard to see it here</p>
                      {activeTab === 'my-reports' && (
                        <button
                          onClick={() => navigate('/report-hazard')}
                          className="btn-primary w-full max-w-sm text-lg py-4"
                        >
                          🚨 Report Your First Hazard
                        </button>
                      )}
                    </div>
                  </Card>
                ) : (
                  reportsToDisplay.map((report) => (
                    <Card key={report.id} hover={false}>
                        <div className="flex items-start justify-between flex-col sm:flex-row gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h3 className="font-semibold text-gray-900 truncate">
                                        {report.location.name || `${report.location.lat.toFixed(4)}, ${report.location.lng.toFixed(4)}`}
                                    </h3>
                                    <StatusBadge status={report.status}>
                                        {getStatusText(report.status)}
                                    </StatusBadge>
                                </div>
                                {/* Display Reporter Role */}
                                {report.reporterRole && (
                                    <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium mr-2">
                                        {report.reporterRole}
                                    </span>
                                )}
                                {/* Hazard Type Badge */}
                                <div className="mb-2">
                                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium mr-2">
                                        {report.hazardType === 'flooding' && '🌊 Flooding/High Water'}
                                        {report.hazardType === 'erosion' && '🏖️ Coastal Erosion'}
                                        {report.hazardType === 'pollution' && '☠️ Pollution/Spill'}
                                        {report.hazardType === 'others' && `⚠️ ${report.extraHazardType || 'Others'}`}
                                    </span>
                                </div>

                                <p className="text-gray-600 text-sm mb-2 truncate">{report.description}</p>
                                
                                {/* --- START: MEDIA DISPLAY FIX (A1, A2) --- */}
                                {report.mediaFiles && report.mediaFiles.length > 0 && (
                                    <div className="mt-2 p-2 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                                        <p className="text-xs font-semibold text-gray-700 mb-1 flex items-center">
                                            📸 Media Captured ({report.mediaFiles.length}):
                                        </p>
                                        <ul className="text-xs text-gray-600 space-y-0.5">
                                            {report.mediaFiles.map((file, index) => (
                                                <li key={index} className="truncate">
                                                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {/* --- END: MEDIA DISPLAY FIX --- */}

                                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                                    <span>{report.date}</span>
                                    {/* Display reporter ID only for All Reports tab */}
                                    {activeTab === 'all-reports' && report.persistentMockId && (
                                        <>
                                            <span>•</span>
                                            <span>Reporter Mock ID: {report.persistentMockId}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            
                            {/* Tier 2: Verification Controls (A2.1) - ONLY SHOW FOR ADMIN */}
                            {activeTab === 'all-reports' && isAdministrator && (
                                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 items-end">
                                    {(report.status === 'received' || report.status === 'review') && (
                                        <>
                                            <button 
                                                onClick={() => handleUpdateStatus(report.id, 'verified')}
                                                className="bg-wave-500 text-white text-xs px-3 py-1 rounded-lg hover:bg-wave-600 transition-colors shadow-md w-full sm:w-auto"
                                            >
                                                ✅ Verify
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(report.id, 'false')}
                                                className="bg-coral-500 text-white text-xs px-3 py-1 rounded-lg hover:bg-coral-600 transition-colors shadow-md w-full sm:w-auto"
                                            >
                                                ❌ False Alarm
                                            </button>
                                        </>
                                    )}
                                    {report.status === 'verified' && (
                                        <span className="text-xs text-wave-600 font-medium p-1 border border-wave-300 rounded">Verified</span>
                                    )}
                                    {report.status === 'false' && (
                                        <span className="text-xs text-coral-600 font-medium p-1 border border-coral-300 rounded">Closed</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </Card>
                  ))
                )}
              </div>
            </div>

            {/* Right Column - INCOIS Updates */}
            <div className="lg:col-span-1">
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Latest local INCOIS updates
                </h3>
                
                <div className="space-y-4">
                  {incoisUpdates.map((update, index) => (
                    <AlertCard
                      key={index}
                      type={update.type}
                      title={update.title}
                      description={update.description}
                    />
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t">
                  <a 
                    href="https://incois.gov.in/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ocean-500 hover:text-ocean-700 text-sm font-medium" 
                  >
                    View full INCOIS alerts →
                  </a>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ReportsPage
