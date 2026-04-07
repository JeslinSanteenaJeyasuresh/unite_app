import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type Language = "en" | "ta" | "hi";
export type Role = "admin" | "citizen" | null;

export interface MissingPerson {
  id: string;
  case_id: string;
  name: string;
  age: number;
  address: string;
  bloodGroup: string;
  identificationMark: string;
  imageUrl: string;
  reportedAt: string;
  status: "missing" | "cleared";
}

interface BackendCase {
  id: number;
  case_id: string;
  name: string;
  age: number;
  address: string;
  blood_group: string;
  identification_mark: string;
  image_path: string;
  reported_date: string;
  status: string;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  role: Role;
  setRole: (role: Role) => void;
  t: (key: string) => string;
  missingPersons: MissingPerson[];
  refreshCases: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar
    home: "Home",
    contact: "Contact",
    adminLogin: "Admin Login",
    citizenLogin: "Citizen Login",
    language: "Language",
    unite: "Unite",
    tagline: "Reuniting Families Through AI",
    // Home
    heroTitle: "AI-Powered Missing Persons Tracking & Reunification Platform",
    heroDesc: "Leveraging artificial intelligence to help families reunite during disasters and emergencies. Fast, accurate, and compassionate.",
    adminLoginBtn: "Admin Login",
    citizenLoginBtn: "Citizen Login",
    // Contact
    contactTitle: "Contact Us",
    contactDesc: "Available 24/7 for emergencies",
    emergencyPhone: "Emergency Helpline",
    email: "Email Support",
    landline: "Landline",
    // Auth
    name: "Full Name",
    age: "Age",
    occupation: "Occupation",
    company: "Company / Organization",
    address: "Address",
    emailField: "Email Address",
    mobile: "Mobile Number",
    sendOtp: "Send OTP",
    enterOtp: "Enter OTP",
    verifyOtp: "Verify OTP",
    otpSent: "OTP sent to your mobile number",
    otpSuccess: "Verification successful! Redirecting...",
    // Dashboard
    adminDashboard: "Admin Dashboard",
    citizenDashboard: "Citizen Dashboard",
    reportMissing: "Report Missing Person",
    reportFound: "Report Found Person",
    trackCase: "Track Case Status",
    logout: "Logout",
    welcome: "Welcome",
    // Report Missing
    uploadImage: "Upload Photo",
    bloodGroup: "Blood Group",
    identificationMark: "Identification Mark",
    submit: "Submit Report",
    submitSuccess: "Submitted Successfully!",
    // Report Found
    missingPersonsList: "Missing Persons List",
    moreDetails: "More Details",
    matchFound: "Match Found!",
    matchDesc: "Potential match identified by AI. Please contact authorities immediately.",
    // Track Case
    clearedCases: "Cleared Cases",
    pendingCases: "Pending Cases",
    newCases: "New Cases",
    caseStatistics: "Case Statistics",
    recentCases: "Recent Case Activity",
    // General
    close: "Close",
    back: "Back",
    backHome: "Back to Home",
    loading: "Loading...",
    noRecords: "No records found",
  },
  ta: {
    home: "முகப்பு",
    contact: "தொடர்பு",
    adminLogin: "நிர்வாக உள்நுழைவு",
    citizenLogin: "குடிமகன் உள்நுழைவு",
    language: "மொழி",
    unite: "Unite",
    tagline: "AI மூலம் குடும்பங்களை இணைக்கிறோம்",
    heroTitle: "AI-இயக்கப்படும் காணாமல் போனவர்களை கண்டுபிடிக்கும் தளம்",
    heroDesc: "பேரிடர் மற்றும் அவசரகால நேரங்களில் குடும்பங்களை மீண்டும் இணைக்க செயற்கை நுண்ணறிவை பயன்படுத்துகிறோம்.",
    adminLoginBtn: "நிர்வாக உள்நுழைவு",
    citizenLoginBtn: "குடிமகன் உள்நுழைவு",
    contactTitle: "தொடர்பு கொள்ளுங்கள்",
    contactDesc: "அவசரநிலைகளுக்கு 24/7 கிடைக்கும்",
    emergencyPhone: "அவசர உதவி எண்",
    email: "மின்னஞ்சல் ஆதரவு",
    landline: "நிலைத்த தொலைபேசி",
    name: "முழு பெயர்",
    age: "வயது",
    occupation: "தொழில்",
    company: "நிறுவனம்",
    address: "முகவரி",
    emailField: "மின்னஞ்சல் முகவரி",
    mobile: "கைபேசி எண்",
    sendOtp: "OTP அனுப்பு",
    enterOtp: "OTP உள்ளிடவும்",
    verifyOtp: "OTP சரிபார்",
    otpSent: "உங்கள் கைபேசிக்கு OTP அனுப்பப்பட்டது",
    otpSuccess: "சரிபார்ப்பு வெற்றிகரமானது! திருப்பி அனுப்புகிறோம்...",
    adminDashboard: "நிர்வாக டாஷ்போர்டு",
    citizenDashboard: "குடிமகன் டாஷ்போர்டு",
    reportMissing: "காணாமல் போனவரை தெரிவி",
    reportFound: "கண்டுபிடிக்கப்பட்டவரை தெரிவி",
    trackCase: "வழக்கு நிலையை கண்காணி",
    logout: "வெளியேறு",
    welcome: "வரவேற்கிறோம்",
    uploadImage: "புகைப்படம் பதிவேற்று",
    bloodGroup: "இரத்த வகை",
    identificationMark: "அடையாள குறி",
    submit: "தெரிவிக்கவும்",
    submitSuccess: "வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!",
    missingPersonsList: "காணாமல் போனவர்கள் பட்டியல்",
    moreDetails: "மேலும் விவரங்கள்",
    matchFound: "பொருத்தம் கண்டுபிடிக்கப்பட்டது!",
    matchDesc: "AI ஒரு சாத்தியமான பொருத்தத்தை கண்டறிந்தது. உடனடியாக அதிகாரிகளை தொடர்பு கொள்ளவும்.",
    clearedCases: "தீர்க்கப்பட்ட வழக்குகள்",
    pendingCases: "நிலுவையில் உள்ள வழக்குகள்",
    newCases: "புதிய வழக்குகள்",
    caseStatistics: "வழக்கு புள்ளிவிவரங்கள்",
    recentCases: "சமீபத்திய வழக்கு நடவடிக்கை",
    close: "மூடு",
    back: "திரும்பு",
    backHome: "முகப்புக்கு திரும்பு",
    loading: "ஏற்றுகிறது...",
    noRecords: "பதிவுகள் இல்லை",
  },
  hi: {
    home: "होम",
    contact: "संपर्क",
    adminLogin: "एडमिन लॉगिन",
    citizenLogin: "नागरिक लॉगिन",
    language: "भाषा",
    unite: "Unite",
    tagline: "AI के माध्यम से परिवारों को मिलाना",
    heroTitle: "AI-संचालित लापता व्यक्ति ट्रैकिंग और पुनर्मिलन प्लेटफ़ॉर्म",
    heroDesc: "आपदाओं और आपात स्थितियों में परिवारों को फिर से मिलाने के लिए कृत्रिम बुद्धिमत्ता का उपयोग करना।",
    adminLoginBtn: "एडमिन लॉगिन",
    citizenLoginBtn: "नागरिक लॉगिन",
    contactTitle: "हमसे संपर्क करें",
    contactDesc: "आपात स्थितियों के लिए 24/7 उपलब्ध",
    emergencyPhone: "आपातकालीन हेल्पलाइन",
    email: "ईमेल सहायता",
    landline: "लैंडलाइन",
    name: "पूरा नाम",
    age: "आयु",
    occupation: "व्यवसाय",
    company: "कंपनी / संगठन",
    address: "पता",
    emailField: "ईमेल पता",
    mobile: "मोबाइल नंबर",
    sendOtp: "OTP भेजें",
    enterOtp: "OTP दर्ज करें",
    verifyOtp: "OTP सत्यापित करें",
    otpSent: "आपके मोबाइल पर OTP भेजा गया",
    otpSuccess: "सत्यापन सफल! रीडायरेक्ट हो रहा है...",
    adminDashboard: "एडमिन डैशबोर्ड",
    citizenDashboard: "नागरिक डैशबोर्ड",
    reportMissing: "लापता व्यक्ति की रिपोर्ट",
    reportFound: "मिले व्यक्ति की रिपोर्ट",
    trackCase: "केस स्थिति ट्रैक करें",
    logout: "लॉगआउट",
    welcome: "स्वागत",
    uploadImage: "फोटो अपलोड करें",
    bloodGroup: "रक्त समूह",
    identificationMark: "पहचान चिह्न",
    submit: "रिपोर्ट सबमिट करें",
    submitSuccess: "सफलतापूर्वक सबमिट किया गया!",
    missingPersonsList: "लापता व्यक्तियों की सूची",
    moreDetails: "अधिक विवरण",
    matchFound: "मिलान मिला!",
    matchDesc: "AI ने संभावित मिलान की पहचान की। तुरंत अधिकारियों से संपर्क करें।",
    clearedCases: "हल किए गए मामले",
    pendingCases: "लंबित मामले",
    newCases: "नए मामले",
    caseStatistics: "मामले के आँकड़े",
    recentCases: "हालिया मामले की गतिविधि",
    close: "बंद करें",
    back: "वापस",
    backHome: "होम पर वापस जाएं",
    loading: "लोड हो रहा है...",
    noRecords: "कोई रिकॉर्ड नहीं मिला",
  },
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  const [role, setRoleState] = useState<Role>(() => {
    const saved = localStorage.getItem("unite_role");
    return (saved as Role) ?? null;
  });

  const handleSetRole = (newRole: Role) => {
    if (newRole === null) {
      localStorage.removeItem("unite_role");
    } else {
      localStorage.setItem("unite_role", newRole);
    }
    setRoleState(newRole);
  };

  const [missingPersons, setMissingPersons] = useState<MissingPerson[]>([]);

  const fetchCases = async () => {
    try {
      const response = await fetch("http://localhost:8000/dashboard/cases");

      if (!response.ok) {
        console.error("Failed to fetch cases");
        return;
      }

      const data: BackendCase[] = await response.json();

      const formatted: MissingPerson[] = data.map((item) => ({
        id: item.id.toString(),
        case_id: item.case_id,
        name: item.name,
        age: item.age,
        address: item.address,
        bloodGroup: item.blood_group,
        identificationMark: item.identification_mark,
        imageUrl: `http://localhost:8000/${item.image_path}`,
        reportedAt: item.reported_date,
        status: item.status === "cleared" ? "cleared" : "missing",
      }));

      setMissingPersons(formatted);
    } catch (err) {
      console.error("Error fetching cases:", err);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const t = (key: string): string => {
    return translations[language][key] || translations["en"][key] || key;
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        role,
        setRole: handleSetRole,
        t,
        missingPersons,
        refreshCases: fetchCases,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};