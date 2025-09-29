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

      const unsubscribeSnapshot = onSnapshot(reportsQuery, (snapshot) => {
        const fetchedReports = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        // Sort in memory by timestamp descending (newest first)
        fetchedReports.sort((a, b) => {
            const timeA = a.timestamp?.toMillis() || 0;
            const timeB = b.timestamp?.toMillis() || 0;
            return timeB - timeA;
        });

        setReports(fetchedReports);
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

  // --- NEW: Expose Social Media Mock Data ---
  const getSocialMediaData = useCallback(() => {
      // In a real app, this function would query an NLP output table.
      // Here, we return the static mock data.
      return MOCK_SOCIAL_MEDIA_DATA;
  }, []);
  // ------------------------------------------

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
    getSocialMediaData, // EXPOSED
  }

  return (
    <ReportsContext.Provider value={value}>
      {children}
    </ReportsContext.Provider>
  )
}
