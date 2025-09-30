import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc,
  query,
  serverTimestamp 
} from 'firebase/firestore';

// --- Import Mock Configuration (ASSUMES you created src/firebase.mock.js) ---
import { MOCK_FIREBASE_CONFIG, MOCK_APP_ID } from '../firebase.mock.js';
// --------------------------------------------------------------------------

// --- Global Firebase Configuration Access (MANDATORY) ---
const appId = typeof __app_id !== 'undefined' ? __app_id : MOCK_APP_ID;
const firebaseConfig = typeof __firebase_config !== 'undefined' 
  ? JSON.parse(__firebase_config) 
  : MOCK_FIREBASE_CONFIG;
  
const REPORTS_COLLECTION_PATH = `artifacts/${appId}/public/data/hazardReports`;

// --- MOCK SOCIAL MEDIA DATA (CRITICAL FOR A3 DASHBOARD) ---
const MOCK_SOCIAL_MEDIA_DATA = [
    {
        id: 1,
        source: 'X/Twitter',
        urgency: 'HIGH',
        sentiment: 0.85, // 85% panic/urgency
        message: 'Massive wave observed near Visakhapatnam port! Flooding has started. #Vizag #Cyclone',
        location: { lat: 17.69, lng: 83.21 },
        type: 'Flooding/Swell',
        misinformation: false,
    },
    {
        id: 2,
        source: 'Google Alert/News',
        urgency: 'LOW',
        sentiment: 0.20,
        message: 'Weather advisory update: Heavy rain expected next week. Normal high tide.',
        location: { lat: 18.97, lng: 72.82 },
        type: 'Weather/Tide',
        misinformation: false,
    },
    {
        id: 3,
        source: 'Public Post',
        urgency: 'CRITICAL',
        sentiment: 0.95,
        message: 'EMERGENCY! Heard on WhatsApp that a Tsunami is coming! Evacuate immediately! #TsunamiRumor',
        location: { lat: 10.82, lng: 79.84 },
        type: 'Rumor',
        misinformation: true, // Flagged for counter-messaging
    },
];
// -----------------------------------------------------------

// --- MOCK REPORT DATA (Guaranteed Hotspot Data) ---
const MOCK_REPORTS = [
    // CRITICAL HOTSPOT 1: Visakhapatnam (Matching "Visakhapatnam Port") - 5 Reports
    {
        id: 'r1', persistentMockId: 'coastal_guard_1', reporterRole: 'Coastal Guard', status: 'received', 
        hazardType: 'flooding', description: 'Immediate heavy sea ingression, 1m water on road.', 
        location: { lat: 17.71, lng: 83.27, name: 'Visakhapatnam Port' }, mediaFiles: [], date: '9/28/2025'
    },
    {
        id: 'r2', persistentMockId: 'resident_4', reporterRole: 'Coastal Resident', status: 'received', 
        hazardType: 'erosion', description: 'Large section of beach wall collapsed.', 
        location: { lat: 17.70, lng: 83.25, name: 'Visakhapatnam Port' }, mediaFiles: [], date: '9/28/2025'
    },
    {
        id: 'r3', persistentMockId: 'resident_5', reporterRole: 'Coastal Resident', status: 'review', 
        hazardType: 'others', extraHazardType: 'Tsunami Warning', description: 'Unusual rapid receding tide near harbor.', 
        location: { lat: 17.72, lng: 83.28, name: 'Visakhapatnam Port' }, mediaFiles: [], date: '9/28/2025'
    },
    {
        id: 'r4', persistentMockId: 'guard_2', reporterRole: 'Coastal Guard', status: 'verified', 
        hazardType: 'flooding', description: 'Verified 1.5m high waves impacting shoreline.', 
        location: { lat: 17.70, lng: 83.26, name: 'Visakhapatnam Port' }, mediaFiles: [], date: '9/27/2025'
    },
    {
        id: 'r5', persistentMockId: 'volunteer_1', reporterRole: 'General Volunteer', status: 'false', 
        hazardType: 'pollution', description: 'Minor debris sighted.', 
        location: { lat: 17.73, lng: 83.24, name: 'Visakhapatnam Port' }, mediaFiles: [], date: '9/26/2025'
    },

    // HIGH HOTSPOT 2: Puri (Matching "Puri Beach") - 3 Reports
    {
        id: 'r6', persistentMockId: 'guard_3', reporterRole: 'Coastal Guard', status: 'received', 
        hazardType: 'erosion', description: 'Heavy dunes washing away. Access compromised.', 
        location: { lat: 19.80, lng: 85.83, name: 'Puri Beach' }, mediaFiles: [], date: '9/28/2025'
    },
    {
        id: 'r7', persistentMockId: 'resident_6', reporterRole: 'Coastal Resident', status: 'review', 
        hazardType: 'flooding', description: 'Water approaching main road.', 
        location: { lat: 19.81, lng: 85.84, name: 'Puri Beach' }, mediaFiles: [], date: '9/28/2025'
    },
    {
        id: 'r8', persistentMockId: 'volunteer_2', reporterRole: 'General Volunteer', status: 'received', 
        hazardType: 'others', extraHazardType: 'Beach Closure', description: 'Local police closing access.', 
        location: { lat: 19.79, lng: 85.82, name: 'Puri Beach' }, mediaFiles: [], date: '9/27/2025'
    },

    // MODERATE HOTSPOT 3: Mumbai (Matching "Mumbai Port") - 1 Report
    {
        id: 'r9', persistentMockId: 'admin_test_1', reporterRole: 'Administrator', status: 'received', 
        hazardType: 'pollution', description: 'Confirmed minor oil slick near dock 3.', 
        location: { lat: 18.96, lng: 72.85, name: 'Mumbai Port' }, mediaFiles: [], date: '9/28/2025'
    },
    
    // Other General Reports
    {
        id: 'r10', persistentMockId: 'resident_1', reporterRole: 'Coastal Resident', status: 'verified', 
        hazardType: 'flooding', description: 'Verified report from yesterday.', 
        location: { lat: 12.92, lng: 74.85, name: 'Mangalore' }, mediaFiles: [], date: '9/26/2025'
    },
    {
        id: 'r11', persistentMockId: 'resident_1', reporterRole: 'Coastal Resident', status: 'received', 
        hazardType: 'erosion', description: 'New report by the same resident.', 
        location: { lat: 12.93, lng: 74.86, name: 'Mangalore' }, mediaFiles: [], date: '9/29/2025'
    },
    {
        id: 'r12', persistentMockId: 'guest_user', reporterRole: 'Guest', status: 'review', 
        hazardType: 'others', extraHazardType: 'Navigation Hazard', description: 'Floating debris sighted near channel.', 
        location: { lat: 15.29, lng: 73.85, name: 'Goa Coast' }, mediaFiles: [], date: '9/29/2025'
    },
    {
        id: 'r13', persistentMockId: 'guard_4', reporterRole: 'Coastal Guard', status: 'verified', 
        hazardType: 'pollution', description: 'Confirmed pollution cleared.', 
        location: { lat: 16.51, lng: 82.02, name: 'Kakinada' }, mediaFiles: [], date: '9/25/2025'
    },
    {
        id: 'r14', persistentMockId: 'resident_1', reporterRole: 'Coastal Resident', status: 'false', 
        hazardType: 'flooding', description: 'Heavy rain, but not coastal flooding.', 
        location: { lat: 12.98, lng: 80.24, name: 'Chennai Suburb' }, mediaFiles: [], date: '9/28/2025'
    },
    {
        id: 'r15', persistentMockId: 'resident_7', reporterRole: 'Coastal Resident', status: 'received', 
        hazardType: 'flooding', description: 'Water level rising quickly.', 
        location: { lat: 13.06, lng: 80.27, name: 'Chennai Central' }, mediaFiles: [], date: '9/29/2025'
    },
];

const ReportsContext = createContext()

export const useReports = () => {
  const context = useContext(ReportsContext)
  if (!context) {
    throw new Error('useReports must be used within a ReportsProvider')
  }
  return context
}

export const ReportsProvider = ({ children }) => {
  const [reports, setReports] = useState(MOCK_REPORTS) // Initialize with MOCK DATA
  const [db, setDb] = useState(null);
  const [userId] = useState(crypto.randomUUID()); 
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [configError, setConfigError] = useState(false);

  // MOCK ID for persistent user identity across sessions/devices
  const persistentMockId = localStorage.getItem('mockId') || 'guest_user';

  // 1. Initialize Firebase and Mock Authentication
  useEffect(() => {
    if (Object.keys(firebaseConfig).length === 0 || !firebaseConfig.projectId) {
      console.error("Firebase config is missing or invalid. Cannot initialize Firebase.");
      setConfigError(true);
      setIsAuthReady(true);
      return;
    }

    try {
      const app = initializeApp(firebaseConfig);
      const firestore = getFirestore(app);
      
      setDb(firestore);
      setIsAuthReady(true);
      
    } catch (e) {
      console.error("Firebase initialization failed:", e);
      setConfigError(true);
      setIsAuthReady(true);
    }
  }, []);

  // 2. Real-time data subscription using onSnapshot (Tier 1 & 2 viewing)
  useEffect(() => {
    if (db && isAuthReady && !configError) {
      const reportsQuery = query(collection(db, REPORTS_COLLECTION_PATH));

      // Note: For MVP, we combine mock data with live data. 
      const unsubscribeSnapshot = onSnapshot(reportsQuery, (snapshot) => {
        const liveReports = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        // Combine live reports with mock data (filtering out mock data if the ID already exists in live data)
        const combinedReports = [...MOCK_REPORTS, ...liveReports.filter(live => 
            !MOCK_REPORTS.some(mock => mock.id === live.id)
        )];
        
        combinedReports.sort((a, b) => {
            const timeA = a.timestamp?.toMillis() || 0;
            const timeB = b.timestamp?.toMillis() || 0;
            return timeB - timeA;
        });

        setReports(combinedReports);
      }, (error) => {
        console.error("Firestore snapshot error:", error);
      });

      return () => unsubscribeSnapshot();
    }
  }, [db, isAuthReady, configError]); 

  // 3. Firestore CRUD operations

  const addReport = useCallback(async (reportData) => {
    if (!db) {
      console.error("Submission Failed: Database (db) is not initialized.");
      return null;
    }
    
    // We rely on the persistentMockId for user tracking
    const newReport = {
      userId: userId, // Internal/Firebase random ID
      persistentMockId: persistentMockId, // CRITICAL: Consistent ID for user history
      date: new Date().toLocaleString(), 
      location: reportData.location, 
      status: 'received',
      description: reportData.description,
      hazardType: reportData.hazardType,
      extraHazardType: reportData.extraHazardType,
      mediaFiles: reportData.mediaFiles || [],
      reporterRole: reportData.reporterRole,
      timestamp: serverTimestamp() 
    };
    
    try {
      const docRef = await addDoc(collection(db, REPORTS_COLLECTION_PATH), newReport);
      console.log("Report successfully added with ID:", docRef.id);
      return { id: docRef.id, ...newReport };
    } catch (e) {
      console.error("Error adding document: ", e);
      return null;
    }
  }, [db, userId, persistentMockId]);

  const updateReportStatus = useCallback(async (reportId, newStatus) => {
    if (!db) {
      console.error("Database not initialized for update.");
      return;
    }
    
    try {
      const reportDocRef = doc(db, REPORTS_COLLECTION_PATH, reportId);
      await updateDoc(reportDocRef, {
        status: newStatus
      });
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  }, [db]);

  const getMyReports = useCallback(() => {
    return reports.filter(report => report.persistentMockId === persistentMockId);
  }, [reports, persistentMockId]);

  const getAllReports = useCallback(() => {
    return reports;
  }, [reports]);

  const getSocialMediaData = useCallback(() => {
      return MOCK_SOCIAL_MEDIA_DATA;
  }, []);

  const value = {
    reports,
    userId,
    isAuthReady,
    configError,
    addReport,
    updateReportStatus,
    getMyReports,
    getAllReports,
    persistentMockId,
    getSocialMediaData, 
    db // Expose DB instance for use in AdminWarningSubmit
  }

  return (
    <ReportsContext.Provider value={value}>
      {children}
    </ReportsContext.Provider>
  )
}
