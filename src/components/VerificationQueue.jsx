import React from 'react';
import { useReports } from '../context/ReportsContext';
import Card from './Card';
import StatusBadge from './StatusBadge';
import { CheckCircle, XCircle } from 'lucide-react';

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

    // Reports are assumed to be filtered and sorted by AdminDashboardPage.jsx
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
                    // Check if the report is pending verification (Admin can act on it)
                    const isPending = report.status === 'received' || report.status === 'review';
                    const isSelected = report.id === selectedReportId;

                    return (
                        <Card 
                            key={report.id} 
                            onClick={() => onReportSelect(report)}
                            className={`p-4 transition-all duration-200 cursor-pointer 
                                ${isSelected ? 'border-4 border-ocean-500 shadow-xl scale-[1.01]' : 'border border-gray-200 hover:bg-gray-50'}
                            `}
                        >
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
                            
                            <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                                {report.description || 'No description provided.'}
                            </p>

                            {/* Verification Actions (A2.1) */}
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