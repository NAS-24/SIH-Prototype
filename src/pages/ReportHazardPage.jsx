import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReports } from '../context/ReportsContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Card from '../components/Card'

const ReportHazardPage = () => {
  const navigate = useNavigate()
  const { addReport } = useReports()
  const [location, setLocation] = useState(null)
  const [selectedHazardType, setSelectedHazardType] = useState(null)
  const [description, setDescription] = useState('')
  const [mediaFiles, setMediaFiles] = useState([])
  const [isRecording, setIsRecording] = useState(false)
  const [showExtraTypes, setShowExtraTypes] = useState(false)
  const [extraHazardType, setExtraHazardType] = useState('')
  const [locationMode, setLocationMode] = useState('current') // 'current', 'search', 'manual'
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [manualLat, setManualLat] = useState('')
  const [manualLng, setManualLng] = useState('')

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error('Error getting location:', error)
          // Fallback to default location (Mumbai)
          setLocation({
            lat: 19.0760,
            lng: 72.8777
          })
        }
      )
    }
  }, [])

  const hazardTypes = [
    {
      id: 'flooding',
      name: 'Flooding/High Water',
      icon: '🌊',
      color: 'bg-ocean-100 text-ocean-800 hover:bg-ocean-200 border-ocean-300'
    },
    {
      id: 'erosion',
      name: 'Coastal Erosion',
      icon: '🏖️',
      color: 'bg-sand-100 text-sand-800 hover:bg-sand-200 border-sand-300'
    },
    {
      id: 'pollution',
      name: 'Pollution/Spill',
      icon: '☠️',
      color: 'bg-coral-100 text-coral-800 hover:bg-coral-200 border-coral-300'
    },
    {
      id: 'others',
      name: 'Others',
      icon: '⚠️',
      color: 'bg-wave-100 text-wave-800 hover:bg-wave-200 border-wave-300'
    }
  ]

  const extraHazardTypes = [
    'Storm Surge',
    'Tsunami Warning',
    'Oil Spill',
    'Marine Debris',
    'Beach Closure',
    'Navigation Hazard',
    'Weather Alert',
    'Not in list'
  ]

  const handleHazardTypeSelect = (type) => {
    setSelectedHazardType(type)
    if (type.id === 'others') {
      setShowExtraTypes(true)
    } else {
      setShowExtraTypes(false)
    }
  }

  const handleMediaUpload = (event) => {
    const files = Array.from(event.target.files)
    setMediaFiles(prev => [...prev, ...files])
  }

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input not supported in this browser')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    setIsRecording(true)
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setDescription(prev => prev + ' ' + transcript)
      setIsRecording(false)
    }

    recognition.onerror = () => {
      setIsRecording(false)
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    recognition.start()
  }

  const handleSubmit = () => {
    if (!selectedHazardType) {
      alert('Please select a hazard type')
      return
    }

    const reportLocation = getDisplayLocation()
    if (!reportLocation) {
      alert('Please select a location for the report')
      return
    }

    const reportData = {
      hazardType: selectedHazardType.id,
      description,
      location: reportLocation,
      mediaFiles,
      timestamp: new Date().toISOString(),
      extraHazardType: showExtraTypes ? extraHazardType : null
    }

    // Add the report to the context
    addReport(reportData)
    
    alert('Hazard report submitted successfully!')
    navigate('/reports')
  }

  const getMapUrl = () => {
    const displayLocation = selectedLocation || location
    if (!displayLocation) return ''
    return `https://maps.google.com/maps?q=${displayLocation.lat},${displayLocation.lng}&z=15&output=embed`
  }

  const handleLocationSearch = async () => {
    if (!searchQuery.trim()) return
    
    try {
      // Using a simple geocoding approach (in a real app, you'd use Google Places API or similar)
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`)
      const results = await response.json()
      
      setSearchResults(results.map(result => ({
        id: result.place_id,
        name: result.display_name,
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon)
      })))
    } catch (error) {
      console.error('Error searching locations:', error)
      alert('Error searching for locations. Please try again.')
    }
  }

  const handleLocationSelect = (location) => {
    setSelectedLocation(location)
    setSearchResults([])
    setSearchQuery(location.name)
  }

  const handleManualLocationSubmit = () => {
    const lat = parseFloat(manualLat)
    const lng = parseFloat(manualLng)
    
    if (isNaN(lat) || isNaN(lng)) {
      alert('Please enter valid coordinates')
      return
    }
    
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      alert('Please enter valid latitude (-90 to 90) and longitude (-180 to 180)')
      return
    }
    
    setSelectedLocation({ lat, lng, name: `${lat.toFixed(4)}, ${lng.toFixed(4)}` })
  }

  const getDisplayLocation = () => {
    return selectedLocation || location
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showNav={true} />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Title */}
          <div className="mb-8 text-center">
            <div className="text-5xl mb-4 wave-animation">🌊</div>
            <h1 className="text-4xl font-bold ocean-text mb-3">
              Report Hazard
            </h1>
            <p className="text-ocean-600 text-lg">
              Report coastal hazards and incidents to help protect our communities
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Location and Quick Report */}
            <div className="space-y-6">
              {/* Location Selection */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Report Location
                </h3>
                
                {/* Location Mode Selection */}
                <div className="mb-4">
                  <div className="flex space-x-2 mb-4">
                    <button
                      onClick={() => setLocationMode('current')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        locationMode === 'current'
                          ? 'bg-incois-blue text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      📍 Current Location
                    </button>
                    <button
                      onClick={() => setLocationMode('search')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        locationMode === 'search'
                          ? 'bg-incois-blue text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      🔍 Search Location
                    </button>
                    <button
                      onClick={() => setLocationMode('manual')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        locationMode === 'manual'
                          ? 'bg-incois-blue text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      📝 Manual Coordinates
                    </button>
                  </div>
                </div>

                {/* Current Location Mode */}
                {locationMode === 'current' && (
                  <div>
                    {location ? (
                      <div>
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">
                            Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                          </p>
                          <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                            <iframe
                              src={getMapUrl()}
                              width="100%"
                              height="100%"
                              style={{ border: 0 }}
                              allowFullScreen=""
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                              title="Current Location Map"
                            />
                          </div>
                        </div>
                        <button className="btn-primary w-full">
                          📍 Quick Report → Tap to capture & report
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-incois-blue mx-auto mb-4"></div>
                        <p className="text-gray-600">Getting your location...</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Search Location Mode */}
                {locationMode === 'search' && (
                  <div>
                    <div className="mb-4">
                      <div className="flex space-x-2 mb-3">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search for a location..."
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-incois-blue focus:border-transparent"
                          onKeyPress={(e) => e.key === 'Enter' && handleLocationSearch()}
                        />
                        <button
                          onClick={handleLocationSearch}
                          className="btn-primary px-4 py-2"
                        >
                          Search
                        </button>
                      </div>
                      
                      {searchResults.length > 0 && (
                        <div className="space-y-2 mb-4">
                          {searchResults.map((result) => (
                            <button
                              key={result.id}
                              onClick={() => handleLocationSelect(result)}
                              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <p className="text-sm font-medium text-gray-900">{result.name}</p>
                              <p className="text-xs text-gray-500">
                                {result.lat.toFixed(4)}, {result.lng.toFixed(4)}
                              </p>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {selectedLocation && (
                      <div>
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">
                            Selected: {selectedLocation.name}
                          </p>
                          <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                            <iframe
                              src={getMapUrl()}
                              width="100%"
                              height="100%"
                              style={{ border: 0 }}
                              allowFullScreen=""
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                              title="Selected Location Map"
                            />
                          </div>
                        </div>
                        <button className="btn-primary w-full">
                          📍 Report at Selected Location
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Manual Coordinates Mode */}
                {locationMode === 'manual' && (
                  <div>
                    <div className="mb-4">
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Latitude
                          </label>
                          <input
                            type="number"
                            value={manualLat}
                            onChange={(e) => setManualLat(e.target.value)}
                            placeholder="e.g., 19.0760"
                            step="0.000001"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-incois-blue focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Longitude
                          </label>
                          <input
                            type="number"
                            value={manualLng}
                            onChange={(e) => setManualLng(e.target.value)}
                            placeholder="e.g., 72.8777"
                            step="0.000001"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-incois-blue focus:border-transparent"
                          />
                        </div>
                      </div>
                      <button
                        onClick={handleManualLocationSubmit}
                        className="btn-secondary w-full mb-4"
                      >
                        Set Coordinates
                      </button>
                    </div>
                    
                    {selectedLocation && (
                      <div>
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">
                            Coordinates: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                          </p>
                          <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                            <iframe
                              src={getMapUrl()}
                              width="100%"
                              height="100%"
                              style={{ border: 0 }}
                              allowFullScreen=""
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                              title="Manual Location Map"
                            />
                          </div>
                        </div>
                        <button className="btn-primary w-full">
                          📍 Report at These Coordinates
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </Card>

              {/* Hazard Type Selection */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Hazard Type
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {hazardTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => handleHazardTypeSelect(type)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedHazardType?.id === type.id
                          ? 'border-incois-blue bg-incois-blue text-white'
                          : `border-gray-200 ${type.color}`
                      }`}
                    >
                      <div className="text-2xl mb-2">{type.icon}</div>
                      <div className="text-sm font-medium">{type.name}</div>
                    </button>
                  ))}
                </div>

                {/* Extra Hazard Types Dropdown */}
                {showExtraTypes && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select specific hazard type:
                    </label>
                    <select
                      value={extraHazardType}
                      onChange={(e) => setExtraHazardType(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="">Select hazard type...</option>
                      {extraHazardTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                )}
              </Card>
            </div>

            {/* Right Column - Optional Inputs */}
            <div className="space-y-6">
              {/* Description */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Description
                </h3>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the hazard in detail..."
                  className="w-full h-32 border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-incois-blue focus:border-transparent"
                />
                
                {/* Voice Input Button */}
                <div className="mt-3">
                  <button
                    onClick={handleVoiceInput}
                    disabled={isRecording}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isRecording
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>{isRecording ? '🔴' : '🎤'}</span>
                    <span>{isRecording ? 'Recording...' : 'Audio-to-text'}</span>
                  </button>
                </div>
              </Card>

              {/* Media Upload */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Media Upload
                </h3>
                <div className="space-y-4">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleMediaUpload}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                  
                  {mediaFiles.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Selected files:</p>
                      {mediaFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm text-gray-600">{file.name}</span>
                          <button
                            onClick={() => setMediaFiles(prev => prev.filter((_, i) => i !== index))}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>

              {/* Submit Button */}
              <Card>
                <div className="space-y-4">
                  <button
                    onClick={handleSubmit}
                    className="w-full btn-danger text-lg py-4"
                  >
                    🚨 Report Urgent Hazard
                  </button>
                  
                  <button
                    onClick={() => navigate('/reports')}
                    className="w-full btn-secondary"
                  >
                    ← Back to Recent Reports
                  </button>
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

export default ReportHazardPage
