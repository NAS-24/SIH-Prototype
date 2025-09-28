import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReports } from '../context/ReportsContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Card from '../components/Card'
import StatusBadge from '../components/StatusBadge'
import AlertCard from '../components/AlertCard'

const ReportsPage = () => {
  const navigate = useNavigate()
  const { getMyReports, getAllReports } = useReports()
  const [activeTab, setActiveTab] = useState('my-reports')
  const [filter, setFilter] = useState('all')

  // Get reports from context
  const myReports = getMyReports()
  const allReports = getAllReports()
  
  console.log('ReportsPage - myReports:', myReports)
  console.log('ReportsPage - allReports:', allReports)

  // Force re-render when component mounts to ensure fresh data
  useEffect(() => {
    console.log('ReportsPage mounted, reports updated')
  }, [myReports, allReports])

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

  const filteredReports = filter === 'all' 
    ? allReports 
    : allReports.filter(report => report.status === filter)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showNav={true} />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Title */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
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
                className="btn-primary text-lg px-8 py-4"
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
                      ? 'bg-white text-incois-blue shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  My Reports
                </button>
                <button
                  onClick={() => setActiveTab('all-reports')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'all-reports'
                      ? 'bg-white text-incois-blue shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All Reports
                </button>
              </div>

              {/* My Reports Tab */}
              {activeTab === 'my-reports' && (
                <div className="space-y-4">
                  {myReports.length === 0 ? (
                    <Card hover={false}>
                      <div className="text-center py-12">
                        <div className="text-6xl mb-6 float-animation">🌊</div>
                        <h3 className="text-2xl font-bold text-ocean-800 mb-3">No reports yet</h3>
                        <p className="text-ocean-600 mb-8 text-lg">Start by reporting a hazard to see it here</p>
                        <div className="space-y-4">
                          <button
                            onClick={() => navigate('/report-hazard')}
                            className="btn-primary w-full text-lg py-4"
                          >
                            🚨 Report Your First Hazard
                          </button>
                          <button
                            onClick={() => navigate('/report-hazard')}
                            className="btn-secondary w-full text-lg py-4"
                          >
                            📍 Report from Current Location
                          </button>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    myReports.map((report) => (
                      <Card key={report.id} hover={false}>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-gray-900">
                                {report.location.name || `${report.location.lat.toFixed(4)}, ${report.location.lng.toFixed(4)}`}
                              </h3>
                              <StatusBadge status={report.status}>
                                {getStatusText(report.status)}
                              </StatusBadge>
                            </div>
                            <div className="mb-2">
                              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium mr-2">
                                {report.hazardType === 'flooding' && '🌊 Flooding/High Water'}
                                {report.hazardType === 'erosion' && '🏖️ Coastal Erosion'}
                                {report.hazardType === 'pollution' && '☠️ Pollution/Spill'}
                                {report.hazardType === 'others' && `⚠️ ${report.extraHazardType || 'Others'}`}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-2">{report.description}</p>
                            <p className="text-sm text-gray-500">{report.date}</p>
                            {report.mediaFiles && report.mediaFiles.length > 0 && (
                              <div className="mt-2">
                                <span className="text-xs text-gray-500">
                                  📎 {report.mediaFiles.length} file(s) attached
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              )}

              {/* All Reports Tab */}
              {activeTab === 'all-reports' && (
                <div>
                  {/* Filter */}
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

                  <div className="space-y-4">
                    {filteredReports.length === 0 ? (
                      <Card hover={false}>
                        <div className="text-center py-8">
                          <div className="text-gray-400 text-4xl mb-4">📊</div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">No reports found</h3>
                          <p className="text-gray-600">Try adjusting your filter or check back later</p>
                        </div>
                      </Card>
                    ) : (
                      filteredReports.map((report) => (
                        <Card key={report.id} hover={false}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-semibold text-gray-900">
                                  {report.location.name || `${report.location.lat.toFixed(4)}, ${report.location.lng.toFixed(4)}`}
                                </h3>
                                <StatusBadge status={report.status}>
                                  {getStatusText(report.status)}
                                </StatusBadge>
                              </div>
                              {report.hazardType && (
                                <div className="mb-2">
                                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium mr-2">
                                    {report.hazardType === 'flooding' && '🌊 Flooding/High Water'}
                                    {report.hazardType === 'erosion' && '🏖️ Coastal Erosion'}
                                    {report.hazardType === 'pollution' && '☠️ Pollution/Spill'}
                                    {report.hazardType === 'others' && `⚠️ ${report.extraHazardType || 'Others'}`}
                                  </span>
                                </div>
                              )}
                              <p className="text-gray-600 mb-2">{report.description}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>{report.date}</span>
                                {report.reporter && (
                                  <>
                                    <span>•</span>
                                    <span>Reported by: {report.reporter}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              )}
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
                    href="#" 
                    className="text-incois-blue hover:text-incois-light-blue text-sm font-medium"
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
