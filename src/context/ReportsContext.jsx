import { createContext, useContext, useState, useEffect } from 'react'

const ReportsContext = createContext()

export const useReports = () => {
  const context = useContext(ReportsContext)
  if (!context) {
    throw new Error('useReports must be used within a ReportsProvider')
  }
  return context
}

export const ReportsProvider = ({ children }) => {
  const [reports, setReports] = useState([])

  // Load reports from localStorage on component mount
  useEffect(() => {
    const savedReports = localStorage.getItem('hazardReports')
    if (savedReports) {
      setReports(JSON.parse(savedReports))
    }
  }, [])

  // Save reports to localStorage whenever reports change
  useEffect(() => {
    localStorage.setItem('hazardReports', JSON.stringify(reports))
  }, [reports])

  const addReport = (reportData) => {
    const newReport = {
      id: Date.now(), // Simple ID generation
      date: new Date().toLocaleString(),
      location: reportData.location, // Keep the full location object
      status: 'received',
      description: reportData.description,
      hazardType: reportData.hazardType,
      extraHazardType: reportData.extraHazardType,
      mediaFiles: reportData.mediaFiles,
      timestamp: reportData.timestamp
    }
    
    console.log('Adding new report:', newReport)
    setReports(prev => {
      const updated = [newReport, ...prev]
      console.log('Updated reports:', updated)
      return updated
    })
    return newReport
  }

  const updateReportStatus = (reportId, newStatus) => {
    setReports(prev => 
      prev.map(report => 
        report.id === reportId 
          ? { ...report, status: newStatus }
          : report
      )
    )
  }

  const getMyReports = () => {
    return reports
  }

  const getAllReports = () => {
    // In a real app, this would fetch from a backend
    // For now, return the same reports
    return reports
  }

  const value = {
    reports,
    addReport,
    updateReportStatus,
    getMyReports,
    getAllReports
  }

  return (
    <ReportsContext.Provider value={value}>
      {children}
    </ReportsContext.Provider>
  )
}
