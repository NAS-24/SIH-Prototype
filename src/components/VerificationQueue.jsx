import React from 'react';
import { useReports } from '../context/ReportsContext';
import Card from './Card';
import StatusBadge from './StatusBadge';
import { CheckCircle, XCircle, FileText, Globe, User, Clock } from 'lucide-react'; // Added icons for detail view

const VerificationQueue = ({ reports, onReportSelect, selectedReportId }) => {
    // Destructure the function to update report status
    const { updateReportStatus } = useReports();

    // Helper to format status text
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

    // Handler for Verification actions
    const handleVerification = async (reportId, newStatus) => {
        await updateReportStatus(reportId, newStatus);
    }

    return (
        <div className="space-y-3">
            {reports.length === 0 ? (
                <Card hover={false}>
                    <div className="text-center py-8 text-gray-500">
                        <div className="text-4xl mb-3">🔍</div>
                        <p className="font-semibold">No Pending Reports</p>
                        <p className="text-sm">Adjust filters or wait for new submissions.</p>
                    </div>
                </Card>
            ) : (
                reports.map((report) => {
                    const isPending = report.status === 'received' || report.status === 'review';
                    const isSelected = report.id === selectedReportId;

                    return (
                        <Card 
                            key={report.id} 
                            onClick={() => onReportSelect(report)}
                            // Ensure the card styling is responsive to the selected state
                            className={`p-4 transition-all duration-200 cursor-pointer 
                                ${isSelected ? 'border-4 border-ocean-500 shadow-xl scale-[1.01]' : 'border border-gray-200 hover:bg-gray-50'}
                            `}
                        >
                            {/* --- HEADER VIEW (Always Visible) --- */}
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <h4 className="text-base font-semibold text-gray-900 break-words max-w-[80%]">
                                            {report.location.name || `${report.location.lat.toFixed(4)}, ${report.location.lng.toFixed(4)}`}
                                        </h4>
                                        <StatusBadge status={report.status}>
                                            {getStatusText(report.status)}
                                        </StatusBadge>
                                    </div>
                                    <p className="text-xs text-ocean-700 font-medium mb-1">
                                        Priority Role: **{report.reporterRole || 'Unknown'}**
                                    </p>
                                </div>
                            </div>
                            
                            {/* --- DETAILED VIEW (Expands on selection) --- */}
                            {isSelected ? (
                                <div className="mt-3 pt-3 border-t border-gray-200 space-y-3">
                                    <div className="text-sm text-gray-700 space-y-1">
                                        <p className="flex items-center"><FileText size={16} className="inline mr-2 text-gray-500" /> 
                                            <span className="font-semibold">Description:</span> {report.description || 'N/A'}
                                        </p>
                                        <p className="flex items-center"><Globe size={16} className="inline mr-2 text-gray-500" /> 
                                            <span className="font-semibold">Coords:</span> {report.location.lat.toFixed(6)}, {report.location.lng.toFixed(6)}
                                        </p>
                                        <p className="flex items-center"><Clock size={16} className="inline mr-2 text-gray-500" /> 
                                            <span className="font-semibold">Time:</span> {report.date}
                                        </p>
                                        <p className="flex items-center"><User size={16} className="inline mr-2 text-gray-500" /> 
                                            <span className="font-semibold">Reporter ID:</span> {report.persistentMockId.substring(0, 8)}...
                                        </p>
                                        
                                        {/* Mock Media File List */}
                                        {report.mediaFiles && report.mediaFiles.length > 0 && (
                                            <div className="mt-2 p-2 border border-dashed border-gray-300 rounded-lg">
                                                <p className="text-xs font-semibold text-gray-700">Media Files (Mock Metadata):</p>
                                                {report.mediaFiles.map((file, i) => (
                                                    <span key={i} className="block text-xs text-green-700">{file.name} ({Math.round(file.size / 1024)} KB)</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                // Compact view when not selected
                                <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                                    {report.description || 'No description provided.'}
                                </p>
                            )}

                            {/* Verification Actions (A2.1) - Always at the bottom */}
                            {isPending && (
                                <div className="flex space-x-2 pt-2 border-t border-gray-100">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent card click from changing map focus
                                            handleVerification(report.id, 'verified');
                                        }}
                                        className="btn-primary flex-1 text-xs py-2 px-3 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-green-500 hover:bg-green-600 text-white"
                                    >
                                        <CheckCircle size={14} className="inline mr-1"/> Verify
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent card click from changing map focus
                                            handleVerification(report.id, 'false');
                                        }}
                                        className="btn-danger flex-1 text-xs py-2 px-3 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-red-500 hover:bg-red-600 text-white"
                                    >
                                        <XCircle size={14} className="inline mr-1"/> False Alarm
                                    </button>
                                </div>
                            )}
                        </Card>
                    );
                })
            )}
        </div>
    );
};

export default VerificationQueue;