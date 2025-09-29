import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useReports } from '../context/ReportsContext';
// import Navbar from '../components/Navbar'; <-- REMOVED
import Footer from '../components/Footer';
import Card from '../components/Card'; 
import AlertCard from '../components/AlertCard'; 
import VerificationQueue from '../components/VerificationQueue'; // Assumed component exists in /components
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { MapPin, Bell, TrendingUp, BarChart3, Zap, ThumbsDown, ListChecks, Loader2, Map } from 'lucide-react';

// --- MOCK DB & Config Setup (Simplified for local components) ---
const APP_ID = 'local-dev-incois-id'; 

// Component to handle INCOIS Warning Submission (Right Panel Top)
const AdminWarningSubmit = ({ adminId, dbInstance }) => { 
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [isVerified, setIsVerified] = useState(true);
    const [status, setStatus] = useState(null);
    const warningsPath = `artifacts/${APP_ID}/public/data/incois_warnings`;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!dbInstance) { 
            setStatus({ text: "Database connection failed. Cannot post warning.", type: 'warning' });
            return;
        }

        setStatus({ text: 'Submitting...', type: 'information' });
        try {
            await addDoc(collection(dbInstance, warningsPath), {
                title: title.trim(),
                message: message.trim(),
                verified: isVerified,
                adminId: adminId,
                timestamp: serverTimestamp(),
            });
            setStatus({ text: 'Warning posted successfully! (Check Reports Page)', type: 'success' });
            setTitle('');
            setMessage('');
            setTimeout(() => setStatus(null), 4000);
        } catch (error) {
            console.error("Error posting warning:", error);
            setStatus({ text: 'Failed to post warning. Check console.', type: 'warning' });
        }
    };

    return (
        <Card className="flex-shrink-0 border-t-4 border-purple-500">
            <h3 className="text-xl font-bold text-purple-800 flex items-center mb-3">
                <Bell size={20} className="mr-2 text-purple-600"/> Post Official Warning
            </h3>
            {status && (
                 <AlertCard 
                    type={status.type} 
                    title={status.type === 'success' ? 'Success' : 'Action Required'}
                    description={status.text}
                    className="mb-4"
                 />
            )}
            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Warning Title (e.g., High Wave Alert for Odisha)"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                />
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows="4"
                    placeholder="Enter detailed message, directions, or necessary actions..."
                    className="w-full p-2 border border-gray-300 rounded-lg resize-none"
                    required
                ></textarea>
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                        <input
                            type="checkbox"
                            checked={isVerified}
                            onChange={(e) => setIsVerified(e.target.checked)}
                            className="mr-2 h-4 w-4 text-purple-600 border-gray-300 rounded"
                        />
                        Mark as **Verified** by Command Center
                    </label>
                    <button
                        type="submit"
                        className="py-2 px-4 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition"
                        disabled={!message.trim() || !title.trim()}
                    >
                        Post & Disseminate
                    </button>
                </div>
            </form>
        </Card>
    );
};

// Component for Social Media Context (Right Panel Bottom)
const SocialMediaContext = ({ socialData }) => {
    // Calculate simulated metrics
    const totalReports = socialData.length;
    const highUrgencyReports = socialData.filter(d => d.urgency === 'CRITICAL' || d.urgency === 'HIGH').length;
    const misinformationCount = socialData.filter(d => d.misinformation).length;

    const ThreatIndicator = ({ Icon, title, value, color }) => (
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center">
                <Icon size={20} className={`mr-2 ${color}`} />
                <span className="text-sm font-medium text-gray-700">{title}</span>
            </div>
            <span className={`text-sm font-bold ${color}`}>{value}</span>
        </div>
    );

    return (
        <Card className="flex-1 border-t-4 border-yellow-500 overflow-y-auto">
            <h3 className="text-xl font-bold text-yellow-800 flex items-center mb-4">
                <TrendingUp size={20} className="mr-2 text-yellow-600" />
                Social Media Analytics (A3)
            </h3>
            <div className="space-y-3">
                <ThreatIndicator 
                    Icon={BarChart3} 
                    title="Volume Spike" 
                    value={`${totalReports * 10}% Increase`}
                    color="text-red-600" 
                />
                <ThreatIndicator 
                    Icon={Zap} 
                    title="High Urgency Posts" 
                    value={`${highUrgencyReports} Detected`} 
                    color="text-orange-600" 
                />
                <ThreatIndicator 
                    Icon={ThumbsDown} 
                    title="Misinformation Flags" 
                    value={`${misinformationCount} Critical`} 
                    color="text-purple-600" 
                />
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                    <p className="text-xs font-semibold text-gray-700">Recent Social Activity:</p>
                    {socialData.map(item => (
                        <p key={item.id} className={`text-xs p-2 rounded ${item.misinformation ? 'bg-red-50' : 'bg-green-50'}`}>
                            [{item.source}] **{item.urgency}**: {item.message.substring(0, 50)}...
                        </p>
                    ))}
                </div>
            </div>
        </Card>
    );
};

// Component to display the Map (Middle Panel Top)
const MapComponent = ({ selectedReport }) => {
    // Fallback location is Mumbai/India focus
    const mapLocation = selectedReport?.location || { lat: 18.9750, lng: 72.8258 };
    const markerColor = selectedReport?.status === 'verified' ? 'green' : 'red';
    
    // Construct the URL to focus on the selected report with a marker
    const mapUrl = `https://maps.google.com/maps?q=${mapLocation.lat},${mapLocation.lng}&markers=color:${markerColor}%7C${mapLocation.lat},${mapLocation.lng}&z=10&output=embed`;

    return (
        <Card className="flex-shrink-0 min-h-[300px]">
            <h3 className="text-xl font-bold text-ocean-800 mb-4 flex items-center">
                <MapPin size={20} className="mr-2 text-ocean-600" />
                Live Hazard Map (A1) | Focus: {selectedReport ? selectedReport.location?.name?.substring(0, 20) || 'Coordinates' : 'India Coastline'}
            </h3>
            <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden relative">
                <iframe
                    src={mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Situational Map"
                />
            </div>
        </Card>
    );
};


// --- Main Admin Dashboard Component ---
const AdminDashboardPage = ({ setCurrentRole, userId }) => {
    // Get all necessary data and stable DB instance from context
    const { reports, getAllReports, getSocialMediaData, isAuthReady, db } = useReports();
    const socialData = getSocialMediaData();

    // State for filtering
    const [statusFilter, setStatusFilter] = useState('received'); // Default to show NEW/RECEIVED
    const [roleFilter, setRoleFilter] = useState('all');
    const [selectedReport, setSelectedReport] = useState(null);

    // Initial Loading Check - Renders a loader if Context isn't ready
    if (!isAuthReady) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <Loader2 className="animate-spin mr-3" size={32} />
                <h1 className="text-2xl font-semibold text-gray-700">Initializing Command Center...</h1>
            </div>
        );
    }

    const uniqueRoles = useMemo(() => {
        const roles = new Set(reports.map(r => r.reporterRole).filter(Boolean));
        return ['all', ...Array.from(roles).sort()];
    }, [reports]);

    // Filtering Logic
    const filteredReports = useMemo(() => {
        let list = getAllReports();

        // 1. Filter by Status 
        if (statusFilter !== 'all') {
            list = list.filter(report => report.status === statusFilter);
        }

        // 2. Filter by Role (Priority)
        if (roleFilter !== 'all') {
            list = list.filter(report => report.reporterRole === roleFilter);
        }
        
        // 3. Sort by time (newest first for urgency)
        list.sort((a, b) => (b.timestamp?.toMillis() || 0) - (a.timestamp?.toMillis() || 0));

        return list;
    }, [getAllReports, statusFilter, roleFilter]);

    // Effect to automatically set map focus and Verification Queue focus
    useEffect(() => {
        if (filteredReports.length > 0 && !selectedReport) {
            setSelectedReport(filteredReports[0]);
        }
        // If the selected report is filtered out, clear selection
        if (selectedReport && !filteredReports.find(r => r.id === selectedReport.id)) {
             setSelectedReport(null);
        }
    }, [filteredReports, selectedReport]);
    
    // Handler for map focus when clicking a report in the queue
    const handleReportSelect = useCallback((report) => {
        setSelectedReport(report);
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            
            <main className="flex-1 bg-gray-100">
                <div className="max-w-screen-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    
                    {/* Header: Title and Logout Button */}
                    <header className="flex justify-between items-center mb-6 pb-2 border-b">
                        <h1 className="text-3xl font-bold text-ocean-800 flex items-center">
                            <Map className="mr-3" size={28} /> Command Center Dashboard
                        </h1>
                        <button
                            onClick={() => { 
                                localStorage.removeItem('userRole'); 
                                localStorage.removeItem('mockId'); 
                                // Note: In a real app, this would use useNavigate
                                window.location.href = '/'; 
                            }}
                            className="py-2 px-4 bg-red-600 text-white rounded-xl shadow-md hover:bg-red-700 transition"
                        >
                            Logout
                        </button>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 h-[85vh]">
                        
                        {/* === COLUMN 1: FILTERS & HOTSPOTS === */}
                        <div className="flex flex-col space-y-6">
                            
                            {/* Filter Options (A1.2) */}
                            <Card className="flex-shrink-0">
                                <h3 className="text-xl font-bold text-ocean-800 mb-4">Filtering Options</h3>
                                
                                {/* Status Filter */}
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Status Filter (Initial Queue):</label>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                    >
                                        <option value="received">Received (NEW)</option>
                                        <option value="review">Under Review</option>
                                        <option value="verified">Verified</option>
                                        <option value="false">False Alarm</option>
                                        <option value="all">All Reports</option>
                                    </select>
                                </div>

                                {/* Role/Priority Filter */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Role Filter (Priority):</label>
                                    <select
                                        value={roleFilter}
                                        onChange={(e) => setRoleFilter(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                    >
                                        <option value="all">All Roles</option>
                                        {uniqueRoles.filter(r => r !== 'all').map(role => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                </div>
                            </Card>

                            {/* Active Hotspots (Simulated based on reports) */}
                            <Card className="flex-1 overflow-y-auto">
                                <h3 className="text-xl font-bold text-ocean-800 mb-4">Active Hotspots (Mock)</h3>
                                <div className="space-y-3">
                                    <p className="text-sm text-gray-500 italic">Hotspots are generated by report density and social media urgency.</p>
                                    {/* Mock Hotspot List - Clicking these would filter the queue */}
                                    <button className="w-full text-left p-3 bg-red-100 text-red-800 border-red-300 border rounded-lg hover:bg-red-200 text-sm font-semibold">
                                        🔴 Visakhapatnam Coast (5 NEW Reports)
                                    </button>
                                    <button className="w-full text-left p-3 bg-yellow-100 text-yellow-800 border-yellow-300 border rounded-lg hover:bg-yellow-200 text-sm font-semibold">
                                        🟡 Puri Beach Sector (3 Under Review)
                                    </button>
                                    <button className="w-full text-left p-3 bg-green-100 text-green-800 border-green-300 border rounded-lg hover:bg-green-200 text-sm font-semibold">
                                        🟢 Mumbai Port Area (1 Verified Report)
                                    </button>
                                </div>
                            </Card>
                        </div>

                        {/* === COLUMN 2: MAP & QUEUE === */}
                        <div className="md:col-span-2 xl:col-span-2 flex flex-col space-y-6">
                            {/* Live Situational Map (A1.1) */}
                            <MapComponent selectedReport={selectedReport} />

                            {/* Verification Queue (A2) */}
                            <Card className="flex-1 overflow-y-auto">
                                <h3 className="text-xl font-bold text-ocean-800 mb-4">
                                    <ListChecks className="inline mr-2" size={24} /> Verification Queue (Priority List)
                                </h3>
                                <VerificationQueue 
                                    reports={filteredReports}
                                    onReportSelect={handleReportSelect}
                                    selectedReportId={selectedReport?.id}
                                />
                            </Card>
                        </div>

                        {/* === COLUMN 3: POSTING & SOCIAL MEDIA === */}
                        <div className="flex flex-col space-y-6">
                            
                            {/* Official Warning Submission (A2 Action) */}
                            {/* Pass the DB instance down for the submission component to use */}
                            <AdminWarningSubmit adminId={userId} dbInstance={db} />

                            {/* Social Media Context (A3) */}
                            <SocialMediaContext socialData={socialData} />

                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AdminDashboardPage;