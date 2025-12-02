"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import CitySearch from "@/components/ui/CitySearch";

type SupportedLang = "hi" | "mr" | "en";

const TAB_PLANET = "planet";
const TAB_ASCENDANT = "ascendant";
const TAB_ASHTAKVARGA = "ashtakvarga";
const TAB_PLANET_REPORT = "planet-report";
const TAB_PERSONAL = "personal-characteristics";
const TAB_AI_PREDICTION = "ai-prediction";
const TAB_BHINNASHTAK = "bhinnashtakvarga";
const TAB_ASPECTS = "planetary-aspects";
const TAB_PLANETS_HOUSES = "planets-houses";
const TAB_ALL_CHARTS = "all-charts";
const TAB_SADESATI = "current-sadesati";
const TAB_KP = "kp-details";

const PLANET_NAMES = ["Sun","Moon","Mercury","Venus","Mars","Jupiter","Saturn","Rahu","Ketu"] as const;
type PlanetName = typeof PLANET_NAMES[number];
const PLANET_LABELS: Record<SupportedLang, Record<PlanetName, string>> = {
  hi: {
    Sun: "सूर्य",
    Moon: "चंद्रमा",
    Mercury: "बुध",
    Venus: "शुक्र",
    Mars: "मंगल",
    Jupiter: "बृहस्पति",
    Saturn: "शनि",
    Rahu: "राहु",
    Ketu: "केतु",
  },
  mr: {
    Sun: "सूर्य",
    Moon: "चंद्र",
    Mercury: "बुध",
    Venus: "शुक्र",
    Mars: "मंगळ",
    Jupiter: "गुरु",
    Saturn: "शनि",
    Rahu: "राहु",
    Ketu: "केतू",
  },
  en: {
    Sun: "Sun",
    Moon: "Moon",
    Mercury: "Mercury",
    Venus: "Venus",
    Mars: "Mars",
    Jupiter: "Jupiter",
    Saturn: "Saturn",
    Rahu: "Rahu",
    Ketu: "Ketu",
  },
};

// Language dictionary for labels (extend as needed)
const translations = {
  hi: {
    planetTab: "ग्रह तालिका",
    ascendantTab: "लग्न रिपोर्ट",
    d1Chart: "D1 चार्ट",
    planetTable: "कुंडली ग्रह तालिका",
    divisionalTable: "Divisional Chart: D1 ग्रह तालिका",
    lagna: "लग्न",
    house: "भाव",
    zodiac: "राशि",
    nakshatra: "नक्षत्र",
    angle: "अंश",
    set: "स्थिति",
    lord: "लॉर्ड",
    avastha: "अवस्था",
    retro: "पुनरावर्ती",
    general: "सामान्य ",
    personalised: "व्यक्तिगत ",
    spiritualityAdvice: "आध्यात्मिक सुझाव",
    positive: "सकारात्मक",
    negative: "नकारात्मक",
    luckyGem: "लकी रत्न",
    dayForFasting: "उपवास का दिन",
    gayatriMantra: "गायत्री मंत्र",
    mainQuality: "मुख्य गुणवत्ता",
    lagneshStatus: "लग्न स्वामी स्थिति",
    strength: "मजबूती",
    rashiChar: "राशि विशेषता",
    verbalLocation: "वर्बल स्थान",
    reportBtn: "रिपोर्ट प्राप्त करें",
    loading: "लोड हो रहा है...",
    d1ChartLoading: "D1 चार्ट लोड हो रहा है...",
    chartLoadErr: "चार्ट लोड नहीं हो पाया",
    birthDate: "जन्म तिथि",
    birthTime: "जन्म समय",
    birthPlace: "जन्म स्थान",
    lang: "भाषा",
    lang_hi: "हिंदी",
    lang_mr: "मराठी",
    lang_en: "English",
    ashtakvargaTab: "अष्टकवर्ग",
    bhinnashtakTab: "भिन्नाष्टकवर्ग",
    aspectsTab: "ग्रह दृष्टियाँ",
    planetsHousesTab: "भावों में ग्रह",
    allChartsTab: "सभी चार्ट",
    planetName: "ग्रह",
    globalDegree: "ग्लोबल अंश", // (unused here, kept for future)
    houseSignification: "भाव अर्थ",
    sadesatiTab: "वर्तमान साढ़ेसाती",
    sadesatiHeading: "वर्तमान साढ़ेसाती स्थिति",
    sadesatiDate: "विचारित तिथि",
    sadesatiType: "शनि अवधि प्रकार",
    sadesatiAge: "आयु",
    sadesatiRemedies: "उपाय",
    kpTab: "KP ग्रह व भाव",
    kpPlanetsHeading: "KP ग्रह विवरण",
    kpHousesHeading: "KP भाव विवरण",
    avTotal: "कुल",
    planetReportTab: "ग्रह रिपोर्ट",
    planetSelectLabel: "ग्रह चुनें",
    planetReportHeading: "ग्रह विश्लेषण",
    planetConsidered: "विचारित ग्रह",
    planetLocation: "ग्रह स्थिति",
    planetNativeLocation: "मूल भाव",
    planetZodiac: "ग्रह राशि",
    zodiacLord: "राशि स्वामी",
    zodiacLordLocation: "राशि स्वामी की राशि",
    zodiacLordHouse: "राशि स्वामी भाव",
    zodiacLordStrength: "राशि स्वामी बल",
    planetStrength: "ग्रह बल",
    planetZodiacPrediction: "राशि भविष्यवाणी",
    planetVerbalLocation: "वर्बल स्थान",
    planetQualitiesLong: "विस्तृत गुण",
    planetQualitiesShort: "संक्षिप्त गुण",
    planetAffliction: "दोष",
    planetPositiveTraits: "सकारात्मक विशेषताएँ",
    planetNegativeTraits: "नकारात्मक विशेषताएँ",
    planetDefinition: "ग्रह परिभाषा",
    planetGayatriMantra: "गायत्री मंत्र",
    planetNoData: "ग्रह रिपोर्ट प्राप्त नहीं हुई",
    personalTab: "व्यक्तिगत विशेषताएँ",
    personalHouse: "भाव",
    personalZodiac: "राशि",
    personalZodiacLord: "राशि स्वामी",
    personalZodiacLordLoc: "राशि स्वामी की राशि",
    personalHouseLocation: "स्वामी भाव",
    personalStrength: "स्वामी बल",
    personalPrediction: "विशेष भविष्यवाणी",
    aiTab: "AI 12 माह भविष्यवाणी",
    aiSelectMonth: "माह चुनें",
    aiSpecifications: "विशेष विवरण",
    aiStartDate: "आरंभ तिथि",
    aiEndDate: "समाप्ति तिथि",
    aiDasha: "दशा",
    aiOutcome: "परिणाम",
    aiProbability: "संभावना",
    aiHouseScores: "भाव स्कोर",
    aiCategoryRelationship: "रिश्ते",
    aiCategoryEducation: "शिक्षा",
    aiCategoryCareer: "करियर",
    aiCategoryFinance: "वित्त",
    aiCategoryHouse: "घर एवं वाहन",
    aiCategoryHealth: "स्वास्थ्य",
    aiCategoryFamily: "परिवार",
  },
  mr: {
    planetTab: "ग्रह तक्ता",
    ascendantTab: "लग्न रिपोर्ट",
    d1Chart: "D1 चार्ट",
    planetTable: "कुंडली ग्रह तक्ता",
    divisionalTable: "Divisional Chart: D1 ग्रह तक्ता",
    lagna: "लग्न",
    house: "भाव",
    zodiac: "राशि",
    nakshatra: "नक्षत्र",
    angle: "अंश",
    set: "स्थिती",
    lord: "स्वामी",
    avastha: "अवस्था",
    retro: "रिट्रो",
    general: "सामान्य",
    personalised: "वैयक्तिक",
    spiritualityAdvice: "आध्यात्मिक सल्ला",
    positive: "सकारात्मक",
    negative: "नकारात्मक",
    luckyGem: "भाग्यवान रत्न",
    dayForFasting: "उपवासाचा दिवस",
    gayatriMantra: "गायत्री मंत्र",
    mainQuality: "मुख्य गुणवत्ता",
    lagneshStatus: "लग्न स्वामी स्थिती",
    strength: "बळ",
    rashiChar: "राशी गुण",
    verbalLocation: "शाब्दिक स्थान",
    reportBtn: "रिपोर्ट मिळवा",
    loading: "लोड होत आहे...",
    d1ChartLoading: "D1 चार्ट लोड होत आहे...",
    chartLoadErr: "चार्ट लोड करू शकलो नाही",
    birthDate: "जन्म दिनांक",
    birthTime: "जन्म वेळ",
    birthPlace: "जन्म स्थान",
    lang: "भाषा",
    lang_hi: "हिंदी",
    lang_mr: "मराठी",
    lang_en: "English",
    ashtakvargaTab: "अष्टकवर्ग",
    bhinnashtakTab: "भिन्नाष्टकवर्ग",
    aspectsTab: "ग्रह दृष्ट्या",
    planetsHousesTab: "भावांतील ग्रह",
    allChartsTab: "सर्व चार्ट",
    planetName: "ग्रह",
    globalDegree: "ग्लोबल अंश", // (unused here, kept for future)
    houseSignification: "भाव महत्त्व",
    sadesatiTab: "वर्तमान साडेसाती",
    sadesatiHeading: "वर्तमान साडेसाती स्थिती",
    sadesatiDate: "विचारित तारीख",
    sadesatiType: "शनी काल प्रकार",
    sadesatiAge: "वय",
    sadesatiRemedies: "उपाय",
    kpTab: "KP ग्रह व भाव",
    kpPlanetsHeading: "KP ग्रह माहिती",
    kpHousesHeading: "KP भाव माहिती",
    avTotal: "एकूण",
    planetReportTab: "ग्रह अहवाल",
    planetSelectLabel: "ग्रह निवडा",
    planetReportHeading: "ग्रह विश्लेषण",
    planetConsidered: "विचारित ग्रह",
    planetLocation: "ग्रह स्थान",
    planetNativeLocation: "जन्म भाव",
    planetZodiac: "ग्रह राशि",
    zodiacLord: "राशी स्वामी",
    zodiacLordLocation: "राशी स्वामीची राशि",
    zodiacLordHouse: "राशी स्वामी भाव",
    zodiacLordStrength: "राशी स्वामी बल",
    planetStrength: "ग्रह बल",
    planetZodiacPrediction: "राशी भविष्य",
    planetVerbalLocation: "व्हर्बल स्थान",
    planetQualitiesLong: "सविस्तर गुण",
    planetQualitiesShort: "संक्षिप्त गुण",
    planetAffliction: "दोष",
    planetPositiveTraits: "सकारात्मक विशेषता",
    planetNegativeTraits: "नकारात्मक विशेषता",
    planetDefinition: "ग्रह परिभाषा",
    planetGayatriMantra: "गायत्री मंत्र",
    planetNoData: "ग्रह अहवाल उपलब्ध नाही",
    personalTab: "वैयक्तिक वैशिष्ट्ये",
    personalHouse: "भाव",
    personalZodiac: "राशी",
    personalZodiacLord: "राशी स्वामी",
    personalZodiacLordLoc: "राशी स्वामी राशि",
    personalHouseLocation: "स्वामी भाव",
    personalStrength: "स्वामी बल",
    personalPrediction: "विशेष भविष्यवाणी",
    aiTab: "AI 12 महिन्यांचा अंदाज",
    aiSelectMonth: "महिना निवडा",
    aiSpecifications: "विशेष माहिती",
    aiStartDate: "सुरुवात तिथि",
    aiEndDate: "समाप्त तिथि",
    aiDasha: "दशा",
    aiOutcome: "परिणाम",
    aiProbability: "संभाव्यता",
    aiHouseScores: "भाव गुण",
    aiCategoryRelationship: "नातेसंबंध",
    aiCategoryEducation: "शिक्षण",
    aiCategoryCareer: "करियर",
    aiCategoryFinance: "वित्त",
    aiCategoryHouse: "घर आणि वाहन",
    aiCategoryHealth: "आरोग्य",
    aiCategoryFamily: "कुटुंब",
  },
  en: {
    planetTab: "Planet Table",
    ascendantTab: "Ascendant Report",
    d1Chart: "D1 Chart",
    planetTable: "Horoscope Planet Table",
    divisionalTable: "Divisional Chart: D1 Table",
    lagna: "Ascendant",
    house: "House",
    zodiac: "Zodiac",
    nakshatra: "Nakshatra",
    angle: "Degree",
    set: "Set",
    lord: "Lord",
    avastha: "Avastha",
    retro: "Retro",
    general: "General",
    personalised: "Personalised",
    spiritualityAdvice: "Spirituality Advice",
    positive: "Positive",
    negative: "Negative",
    luckyGem: "Lucky Gem",
    dayForFasting: "Day for Fasting",
    gayatriMantra: "Gayatri Mantra",
    mainQuality: "Main Quality",
    lagneshStatus: "Ascendant Lord Status",
    strength: "Strength",
    rashiChar: "Zodiac Char",
    verbalLocation: "Verbal Location",
    reportBtn: "Get Report",
    loading: "Loading...",
    d1ChartLoading: "Loading D1 Chart...",
    chartLoadErr: "Failed to load chart",
    birthDate: "Birth Date",
    birthTime: "Birth Time",
    birthPlace: "Birth City",
    lang: "Language",
    lang_hi: "Hindi",
    lang_mr: "Marathi",
    lang_en: "English",
    ashtakvargaTab: "Ashtakvarga",
    bhinnashtakTab: "Bhinnashtakvarga",
    aspectsTab: "Planetary Aspects",
    planetsHousesTab: "Planets in Houses",
    allChartsTab: "All Charts",
    planetName: "Planet",
    globalDegree: "Global Degree", // (unused here, kept for future)
    houseSignification: "Signification",
    sadesatiTab: "Current Sade Sati",
    sadesatiHeading: "Current Sade Sati Status",
    sadesatiDate: "Date considered",
    sadesatiType: "Saturn period type",
    sadesatiAge: "Age",
    sadesatiRemedies: "Remedies",
    kpTab: "KP Planets & Houses",
    kpPlanetsHeading: "KP Planets",
    kpHousesHeading: "KP Houses",
    avTotal: "Total",
    planetReportTab: "Planet Report",
    planetSelectLabel: "Choose Planet",
    planetReportHeading: "Planet Analysis",
    planetConsidered: "Planet",
    planetLocation: "Planet House",
    planetNativeLocation: "Natural House",
    planetZodiac: "Planet Zodiac",
    zodiacLord: "Zodiac Lord",
    zodiacLordLocation: "Zodiac Lord Location",
    zodiacLordHouse: "Zodiac Lord House",
    zodiacLordStrength: "Zodiac Lord Strength",
    planetStrength: "Planet Strength",
    planetZodiacPrediction: "Zodiac Prediction",
    planetVerbalLocation: "Verbal Location",
    planetQualitiesLong: "Detailed Qualities",
    planetQualitiesShort: "Quick Qualities",
    planetAffliction: "Affliction",
    planetPositiveTraits: "Positive Traits",
    planetNegativeTraits: "Negative Traits",
    planetDefinition: "Planet Definition",
    planetGayatriMantra: "Gayatri Mantra",
    planetNoData: "No planet report available",
    personalTab: "Personal Characteristics",
    personalHouse: "House",
    personalZodiac: "Zodiac",
    personalZodiacLord: "Zodiac Lord",
    personalZodiacLordLoc: "Zodiac Lord Location",
    personalHouseLocation: "Lord House",
    personalStrength: "Lord Strength",
    personalPrediction: "Prediction",
    aiTab: "AI 12-Month Prediction",
    aiSelectMonth: "Select Month",
    aiSpecifications: "Specifications",
    aiStartDate: "Start Date",
    aiEndDate: "End Date",
    aiDasha: "Dasha",
    aiOutcome: "Outcome",
    aiProbability: "Probability",
    aiHouseScores: "House Scores",
    aiCategoryRelationship: "Relationship",
    aiCategoryEducation: "Education",
    aiCategoryCareer: "Career",
    aiCategoryFinance: "Finance",
    aiCategoryHouse: "House & Vehicle",
    aiCategoryHealth: "Health",
    aiCategoryFamily: "Family",
  }
} as const satisfies Record<SupportedLang, Record<string, string>>;

const AI_CATEGORY_KEYS: Record<string, keyof (typeof translations)["en"]> = {
  relationship: "aiCategoryRelationship",
  education: "aiCategoryEducation",
  career: "aiCategoryCareer",
  finance: "aiCategoryFinance",
  house_and_vehicle: "aiCategoryHouse",
  health: "aiCategoryHealth",
  family: "aiCategoryFamily",
};

type FormState = {
  dob: string;
  tob: string;
  lat: string;
  lon: string;
  lang: SupportedLang;
};

export default function HoroscopeDetailsPage() {
  const [form, setForm] = useState<FormState>({
    dob: "",
    tob: "",
    lat: "28.0337088",
    lon: "79.1205419",
    lang: "hi",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState(TAB_PLANET);
  const [planetResult, setPlanetResult] = useState<any>(null);
  const [ascendantResult, setAscendantResult] = useState<any>(null);
  const [divisionResult, setDivisionResult] = useState<any>(null);
  const [chartSvg, setChartSvg] = useState<string | null>(null);
  const [chartLoading, setChartLoading] = useState(false);
  const [ashtakvarga, setAshtakvarga] = useState<any>(null);
  const [avPlanet, setAvPlanet] = useState<PlanetName>("Sun");
  const [avSvg, setAvSvg] = useState<string | null>(null);
  const [avSvgLoading, setAvSvgLoading] = useState(false);
  const [bhinnData, setBhinnData] = useState<any | null>(null);
  const [bhinnPlanet, setBhinnPlanet] = useState<PlanetName>("Sun");
  const [bhinnLoading, setBhinnLoading] = useState(false);
  const [bhinnError, setBhinnError] = useState("");
  const [aspectsData, setAspectsData] = useState<any | null>(null);
  const [aspectsLoading, setAspectsLoading] = useState(false);
  const [aspectsError, setAspectsError] = useState("");
  const [planetsHouses, setPlanetsHouses] = useState<any | null>(null);
  const [planetsHousesLoading, setPlanetsHousesLoading] = useState(false);
  const [planetsHousesError, setPlanetsHousesError] = useState("");
  const [chartDivs] = useState<string[]>([
    "D1",
    "D3",
    "D3-s",
    "D7",
    "D9",
    "D10",
    "D10-R",
    "D12",
    "D16",
    "D20",
    "D24",
    "D24-R",
    "D30",
  ]);
  const [chartsMap, setChartsMap] = useState<Record<string, string | null>>({});
  const [chartsLoading, setChartsLoading] = useState(false);
  const [planetReportData, setPlanetReportData] = useState<any[] | null>(null);
  const [planetReportLoading, setPlanetReportLoading] = useState(false);
  const [planetReportError, setPlanetReportError] = useState("");
  const [reportPlanet, setReportPlanet] = useState<PlanetName>("Sun");
  const [personalChars, setPersonalChars] = useState<any[] | null>(null);
  const [personalLoading, setPersonalLoading] = useState(false);
  const [personalError, setPersonalError] = useState("");
  const [aiPredictions, setAiPredictions] = useState<any[] | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiSelectedIndex, setAiSelectedIndex] = useState("0");
  const [sadeData, setSadeData] = useState<any | null>(null);
  const [sadeLoading, setSadeLoading] = useState(false);
  const [sadeError, setSadeError] = useState("");
  const [kpPlanets, setKpPlanets] = useState<any | null>(null);
  const [kpHouses, setKpHouses] = useState<any[] | null>(null);
  const [kpLoading, setKpLoading] = useState(false);
  const [kpError, setKpError] = useState("");

  const t = translations[form.lang] || translations.en;

  function handleChange(key: string, value: string) {
    if (key === "lang") {
      setForm((f) => ({ ...f, lang: value as SupportedLang }));
    } else {
      setForm((f) => ({ ...f, [key]: value }));
    }
  }
  function handleCity(city: any) {
    handleChange("lat", city.lat);
    handleChange("lon", city.lon);
  }
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Form submitted, form data:", form);
    
    // Validate required fields
    if (!form.dob || !form.tob || !form.lat || !form.lon) {
      setError("कृपया सभी फ़ील्ड भरें / Please fill all fields");
      return;
    }
    
    setLoading(true); 
    setError(""); 
    setPlanetResult(null); 
    setAscendantResult(null); 
    setDivisionResult(null); 
    setChartSvg(null);
    
    try {
      const body = {
        dob: form.dob,
        tob: form.tob,
        lat: form.lat,
        lon: form.lon,
        tz: 5.5,
        lang: form.lang,
        house_type: "whole-sign",
        zodiac_type: "sidereal"
      };
      
      console.log("Making API request to /api/horoscope/planet-details with body:", body);
      const apiUrl = window.location.origin + "/api/horoscope/planet-details";
      console.log("Full fetch URL:", apiUrl);
      
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      
      console.log("Response received. Status:", res.status);
      console.log("Response URL:", res.url);
      console.log("Response headers:", Object.fromEntries(res.headers.entries()));
      
      // Check if response is actually JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Non-JSON response received:", text.substring(0, 200));
        throw new Error("API returned invalid response format. Expected JSON but got: " + (contentType || "unknown"));
      }
      
      let json;
      try {
        json = await res.json();
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        throw new Error("API response is not valid JSON");
      }
      if (!json || json.status !== 200) {
        console.error("API returned error status:", json);
        
        // Handle specific error cases
        if (json.status === 402 || (json.response && json.response.toLowerCase().includes('out of api calls'))) {
          const errorMsg = form.lang === 'hi' 
            ? 'API कॉल समाप्त हो गए हैं। कृपया सदस्यता नवीकरण करें।'
            : form.lang === 'mr'
            ? 'API कॉल संपले आहेत. कृपया सदस्यता नूतनीकरण करा.'
            : 'API calls exhausted. Please renew subscription.';
          throw new Error(errorMsg);
        }
        
        // Handle other API errors
        const errorMsg = json.response || json.error || json.message || "API error";
        throw new Error(errorMsg);
      }
      console.log("API success, setting planet result");
      setPlanetResult(json.response);
      fetchDivisional();
    } catch (e: any) {
      console.error("Error in onSubmit:", e);
      setError(e?.message||t.chartLoadErr);
    } finally {
      setLoading(false);
    }
  }
  async function fetchDivisional() {
    const body = {
      dob: form.dob,
      tob: form.tob,
      lat: form.lat,
      lon: form.lon,
      tz: 5.5,
      lang: form.lang
    };
    fetch("/api/horoscope/divisional-charts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
      .then(r => r.json())
      .then(j => { if (j?.status === 200) setDivisionResult(j.response); });
  }
  useEffect(() => {
    if (planetResult) fetchChartImage();
  }, [planetResult, form.lang]);
  async function fetchChartImage() {
    setChartSvg(null); setChartLoading(true);
    try {
      const params = {
        dob: form.dob,
        tob: form.tob,
        lat: form.lat,
        lon: form.lon,
        tz: 5.5,
        lang: form.lang,
        div: "D1",
        api_key: "2892b990-0f07-5fea-809b-10e2886844c7",
        style: "north",
        color: "000000"
      };
      const res = await fetch("/api/horoscope/chart-image", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(params) });
      const json = await res.json();
      let svg = json?.svg || json?.response || "";
      svg = svg.replace(/\s(width|height)="[^"]*"/g, "");
      if (!/viewBox=/.test(svg)) svg = svg.replace('<svg', '<svg viewBox="0 0 500 500"');
      if (!/preserveAspectRatio=/.test(svg)) svg = svg.replace('<svg', '<svg preserveAspectRatio="xMidYMid meet"');
      setChartSvg(svg);
    } catch { setChartSvg(`<div class='text-red-600 p-4'>${t.chartLoadErr}</div>`); }
    finally { setChartLoading(false); }
  }
  async function triggerAscendant() {
    setAscendantResult(null);
    try {
      const params = { dob: form.dob, tob: form.tob, lat: form.lat, lon: form.lon, tz: 5.5, lang: form.lang };
      const res = await fetch("/api/horoscope/ascendant-report", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(params) });
      const json = await res.json();
      if (!json || json.status !== 200) throw new Error(json?.error||json?.message||"API error");
      setAscendantResult(json.response);
    } catch (e) { setAscendantResult([]); }
  }
  async function fetchAshtakvarga() {
    try {
      const params = { dob: form.dob, tob: form.tob, lat: form.lat, lon: form.lon, tz: 5.5, lang: form.lang };
      const res = await fetch("/api/horoscope/ashtakvarga", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(params) });
      const json = await res.json();
      if (json?.status === 200) setAshtakvarga(json.response);
      else setAshtakvarga(null);
    } catch { setAshtakvarga(null); }
  }
  async function fetchAshtakvargaChart() {
    setAvSvg(null); setAvSvgLoading(true);
    try {
      const params = { dob: form.dob, tob: form.tob, lat: form.lat, lon: form.lon, tz: 5.5, lang: form.lang, planet: avPlanet };
      const res = await fetch("/api/horoscope/ashtakvarga-chart-image", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(params) });
      const json = await res.json();
      let svg = json?.svg || json?.response || "";
      svg = svg.replace(/\s(width|height)="[^"]*"/g, "");
      if (!/viewBox=/.test(svg)) svg = svg.replace('<svg', '<svg viewBox="0 0 500 500"');
      if (!/preserveAspectRatio=/.test(svg)) svg = svg.replace('<svg', '<svg preserveAspectRatio="xMidYMid meet"');
      setAvSvg(svg);
    } catch {
      setAvSvg(null);
    } finally {
      setAvSvgLoading(false);
    }
  }
  async function fetchBhinnashtak(currentPlanet = bhinnPlanet) {
    if (!form.dob || !form.tob || !form.lat || !form.lon) return;
    setBhinnLoading(true);
    setBhinnError("");
    try {
      const params = {
        dob: form.dob,
        tob: form.tob,
        lat: form.lat,
        lon: form.lon,
        tz: 5.5,
        lang: form.lang,
        planet: currentPlanet,
      };
      const res = await fetch("/api/horoscope/bhinnashtakvarga", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const json = await res.json();
      if (!json || json.status !== 200) {
        throw new Error(json?.response || json?.error || json?.message || "API error");
      }
      setBhinnData(json.response || {});
    } catch (error: any) {
      setBhinnError(error?.message || t.chartLoadErr);
      setBhinnData(null);
    } finally {
      setBhinnLoading(false);
    }
  }
  async function fetchAspects() {
    if (!form.dob || !form.tob || !form.lat || !form.lon) return;
    setAspectsLoading(true);
    setAspectsError("");
    try {
      const params = {
        dob: form.dob,
        tob: form.tob,
        lat: form.lat,
        lon: form.lon,
        tz: 5.5,
        lang: form.lang,
        aspect_response_type: "houses",
      };
      const res = await fetch("/api/horoscope/planetary-aspects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const json = await res.json();
      if (!json || json.status !== 200) {
        throw new Error(json?.response || json?.error || json?.message || "API error");
      }
      setAspectsData(json.response || {});
    } catch (error: any) {
      setAspectsError(error?.message || t.chartLoadErr);
      setAspectsData(null);
    } finally {
      setAspectsLoading(false);
    }
  }
  async function fetchPlanetsInHouses() {
    if (!form.dob || !form.tob || !form.lat || !form.lon) return;
    setPlanetsHousesLoading(true);
    setPlanetsHousesError("");
    try {
      const params = {
        dob: form.dob,
        tob: form.tob,
        lat: form.lat,
        lon: form.lon,
        tz: 5.5,
        lang: form.lang,
      };
      const res = await fetch("/api/horoscope/planets-in-houses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const json = await res.json();
      if (!json || json.status !== 200) {
        throw new Error(json?.response || json?.error || json?.message || "API error");
      }
      setPlanetsHouses(json.response || {});
    } catch (error: any) {
      setPlanetsHousesError(error?.message || t.chartLoadErr);
      setPlanetsHouses(null);
    } finally {
      setPlanetsHousesLoading(false);
    }
  }
  async function fetchAllCharts() {
    if (!form.dob || !form.tob || !form.lat || !form.lon) return;
    setChartsLoading(true);
    const newMap: Record<string, string | null> = {};
    try {
      for (const div of chartDivs) {
        try {
          const params = {
            dob: form.dob,
            tob: form.tob,
            lat: form.lat,
            lon: form.lon,
            tz: 5.5,
            lang: form.lang,
            div,
          };
          const res = await fetch("/api/horoscope/chart-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(params),
          });
          const json = await res.json();
          let svg = json?.svg || json?.response || "";
          if (typeof svg === "string" && svg) {
            svg = svg.replace(/\s(width|height)="[^"]*"/g, "");
            if (!/viewBox=/.test(svg)) svg = svg.replace("<svg", '<svg viewBox="0 0 500 500"');
            newMap[div] = svg;
          } else {
            newMap[div] = null;
          }
        } catch {
          newMap[div] = null;
        }
      }
      setChartsMap(newMap);
    } finally {
      setChartsLoading(false);
    }
  }
  async function fetchCurrentSadeSati() {
    if (!form.dob || !form.tob || !form.lat || !form.lon) return;
    setSadeLoading(true);
    setSadeError("");
    try {
      const params = {
        dob: form.dob,
        tob: form.tob,
        lat: form.lat,
        lon: form.lon,
        tz: 5.5,
        lang: form.lang,
      };
      const res = await fetch("/api/horoscope/current-sade-sati", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const json = await res.json();
      if (!json || json.status !== 200) {
        throw new Error(json?.response || json?.error || json?.message || "API error");
      }
      setSadeData(json.response || null);
    } catch (error: any) {
      setSadeError(error?.message || t.chartLoadErr);
      setSadeData(null);
    } finally {
      setSadeLoading(false);
    }
  }
  async function fetchKpDetails() {
    if (!form.dob || !form.tob || !form.lat || !form.lon) return;
    setKpLoading(true);
    setKpError("");
    try {
      const params = {
        dob: form.dob,
        tob: form.tob,
        lat: form.lat,
        lon: form.lon,
        tz: 5.5,
        lang: form.lang,
      };
      const [planetsRes, housesRes] = await Promise.all([
        fetch("/api/horoscope/kp-planets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        }),
        fetch("/api/horoscope/kp-houses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        }),
      ]);
      const planetsJson = await planetsRes.json();
      const housesJson = await housesRes.json();
      if (!planetsRes.ok || planetsJson.status !== 200) {
        throw new Error(
          planetsJson?.response || planetsJson?.error || planetsJson?.message || "KP planets API error"
        );
      }
      if (!housesRes.ok || housesJson.status !== 200) {
        throw new Error(
          housesJson?.response || housesJson?.error || housesJson?.message || "KP houses API error"
        );
      }
      setKpPlanets(planetsJson.response || null);
      setKpHouses(housesJson.response || null);
    } catch (error: any) {
      setKpError(error?.message || t.chartLoadErr);
      setKpPlanets(null);
      setKpHouses(null);
    } finally {
      setKpLoading(false);
    }
  }
  async function fetchPersonalCharacteristics() {
    if (!form.dob || !form.tob || !form.lat || !form.lon) return;
    setPersonalLoading(true);
    setPersonalError("");
    try {
      const params = {
        dob: form.dob,
        tob: form.tob,
        lat: form.lat,
        lon: form.lon,
        tz: 5.5,
        lang: form.lang,
      };
      const res = await fetch("/api/horoscope/personal-characteristics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const json = await res.json();
      if (!json || json.status !== 200) {
        throw new Error(json?.response || json?.error || json?.message || "API error");
      }
      setPersonalChars(json.response || []);
    } catch (error: any) {
      setPersonalError(error?.message || t.chartLoadErr);
      setPersonalChars(null);
    } finally {
      setPersonalLoading(false);
    }
  }

  function todayDDMMYYYY() {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  async function fetchAiPrediction() {
    if (!form.dob || !form.tob || !form.lat || !form.lon) return;
    setAiLoading(true);
    setAiError("");
    try {
      const params = {
        dob: form.dob,
        tob: form.tob,
        lat: form.lat,
        lon: form.lon,
        tz: 5.5,
        lang: form.lang,
        start_date: todayDDMMYYYY(),
      };
      const res = await fetch("/api/horoscope/ai-12-month-prediction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const json = await res.json();
      if (!json || json.status !== 200) {
        throw new Error(json?.response || json?.error || json?.message || "API error");
      }
      setAiPredictions(json.response || []);
      setAiSelectedIndex("0");
    } catch (error: any) {
      setAiError(error?.message || t.chartLoadErr);
      setAiPredictions(null);
    } finally {
      setAiLoading(false);
    }
  }
  async function fetchPlanetReport(currentPlanet = reportPlanet) {
    if (!form.dob || !form.tob || !form.lat || !form.lon) return;
    setPlanetReportLoading(true);
    setPlanetReportError("");
    try {
      const params = {
        dob: form.dob,
        tob: form.tob,
        lat: form.lat,
        lon: form.lon,
        tz: 5.5,
        lang: form.lang,
        planet: currentPlanet,
      };
      const res = await fetch("/api/horoscope/planet-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const json = await res.json();
      if (!json || json.status !== 200) {
        throw new Error(json?.response || json?.error || json?.message || "API error");
      }
      setPlanetReportData(json.response || []);
    } catch (error: any) {
      setPlanetReportError(error?.message || t.chartLoadErr);
      setPlanetReportData(null);
    } finally {
      setPlanetReportLoading(false);
    }
  }
  function handleTabChange(newTab: string) {
    setTab(newTab);
    if(newTab===TAB_ASCENDANT && form.dob && form.tob && form.lat && form.lon) {
      triggerAscendant();
    }
    if(newTab===TAB_ASHTAKVARGA && form.dob && form.tob && form.lat && form.lon) {
      fetchAshtakvarga();
    }
    if(newTab===TAB_PLANET_REPORT && form.dob && form.tob && form.lat && form.lon) {
      fetchPlanetReport();
    }
    if(newTab===TAB_PERSONAL && form.dob && form.tob && form.lat && form.lon) {
      fetchPersonalCharacteristics();
    }
    if(newTab===TAB_AI_PREDICTION && form.dob && form.tob && form.lat && form.lon) {
      fetchAiPrediction();
    }
    if(newTab===TAB_BHINNASHTAK && form.dob && form.tob && form.lat && form.lon) {
      fetchBhinnashtak();
    }
    if(newTab===TAB_ASPECTS && form.dob && form.tob && form.lat && form.lon) {
      fetchAspects();
    }
    if(newTab===TAB_PLANETS_HOUSES && form.dob && form.tob && form.lat && form.lon) {
      fetchPlanetsInHouses();
    }
    if(newTab===TAB_ALL_CHARTS && form.dob && form.tob && form.lat && form.lon) {
      fetchAllCharts();
    }
    if(newTab===TAB_SADESATI && form.dob && form.tob && form.lat && form.lon) {
      fetchCurrentSadeSati();
    }
    if(newTab===TAB_KP && form.dob && form.tob && form.lat && form.lon) {
      fetchKpDetails();
    }
  }

  // Re-fetch while on Ashtakvarga tab if inputs/language change
  useEffect(() => {
    if (tab === TAB_ASHTAKVARGA && form.dob && form.tob && form.lat && form.lon) {
      fetchAshtakvarga();
    }
  }, [form.lang, tab, form.dob, form.tob, form.lat, form.lon]);

  // Trigger Ashtakvarga chart fetch when Ashtakvarga tab is active and inputs/planet/lang change
  useEffect(() => {
    if (tab === TAB_ASHTAKVARGA && form.dob && form.tob && form.lat && form.lon) {
      fetchAshtakvargaChart();
    }
  }, [tab, avPlanet, form.lang, form.dob, form.tob, form.lat, form.lon]);
  useEffect(() => {
    if (tab === TAB_BHINNASHTAK && form.dob && form.tob && form.lat && form.lon) {
      fetchBhinnashtak(bhinnPlanet);
    }
  }, [tab, bhinnPlanet, form.lang, form.dob, form.tob, form.lat, form.lon]);
  useEffect(() => {
    if (tab === TAB_ASPECTS && form.dob && form.tob && form.lat && form.lon) {
      fetchAspects();
    }
  }, [tab, form.lang, form.dob, form.tob, form.lat, form.lon]);
  useEffect(() => {
    if (tab === TAB_PLANETS_HOUSES && form.dob && form.tob && form.lat && form.lon) {
      fetchPlanetsInHouses();
    }
  }, [tab, form.lang, form.dob, form.tob, form.lat, form.lon]);
  useEffect(() => {
    if (tab === TAB_ALL_CHARTS && form.dob && form.tob && form.lat && form.lon) {
      fetchAllCharts();
    }
  }, [tab, form.lang, form.dob, form.tob, form.lat, form.lon, chartDivs]);
  useEffect(() => {
    if (tab === TAB_SADESATI && form.dob && form.tob && form.lat && form.lon) {
      fetchCurrentSadeSati();
    }
  }, [tab, form.lang, form.dob, form.tob, form.lat, form.lon]);
  useEffect(() => {
    if (tab === TAB_KP && form.dob && form.tob && form.lat && form.lon) {
      fetchKpDetails();
    }
  }, [tab, form.lang, form.dob, form.tob, form.lat, form.lon]);
  useEffect(() => {
    if (tab === TAB_PLANET_REPORT && form.dob && form.tob && form.lat && form.lon) {
      fetchPlanetReport(reportPlanet);
    }
  }, [tab, reportPlanet, form.lang, form.dob, form.tob, form.lat, form.lon]);
  useEffect(() => {
    if (tab === TAB_PERSONAL && form.dob && form.tob && form.lat && form.lon) {
      fetchPersonalCharacteristics();
    }
  }, [tab, form.lang, form.dob, form.tob, form.lat, form.lon]);
  useEffect(() => {
    if (tab === TAB_AI_PREDICTION && form.dob && form.tob && form.lat && form.lon) {
      fetchAiPrediction();
    }
  }, [tab, form.lang, form.dob, form.tob, form.lat, form.lon]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-yellow-50 py-8">
      <div className="w-full md:w-3/4 bg-white rounded-xl shadow-xl p-8 text-orange-900">
        <h1 className="text-2xl font-bold text-orange-900 mb-4">🔭 सम्पूर्ण कुंडली रिपोर्ट</h1>
        <form className="space-y-4 grid grid-cols-2 gap-6 mb-6" onSubmit={onSubmit}>
          <div className="col-span-2 md:col-span-1 space-y-3">
            <Label htmlFor="dob">{t.birthDate}</Label>
            <Input id="dob" type="date" value={form.dob} onChange={e=>handleChange("dob",e.target.value)} required/>
            <Label htmlFor="tob">{t.birthTime}</Label>
            <Input id="tob" type="time" value={form.tob} onChange={e=>handleChange("tob",e.target.value)} required/>
            <Label>{t.birthPlace}</Label>
            <CitySearch placeholder={t.birthPlace} onSelect={handleCity} />
          </div>
          <div className="col-span-2 md:col-span-1 space-y-3">
            <Label htmlFor="lang">{t.lang}</Label>
            <Select value={form.lang} onValueChange={v=>handleChange("lang",v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="hi">{t.lang_hi}</SelectItem>
                <SelectItem value="mr">{t.lang_mr}</SelectItem>
                <SelectItem value="en">{t.lang_en}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2 text-center mt-2">
            <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg rounded transition-colors" disabled={loading}>
              {loading ? t.loading : t.reportBtn}
            </button>
          </div>
        </form>
        <div className="flex gap-2 justify-start mb-4 overflow-x-auto pb-2">
          <button onClick={()=>handleTabChange(TAB_PLANET)} className={`px-4 py-2 rounded-md font-bold text-orange-900 border ${tab===TAB_PLANET?'bg-orange-100 border-orange-400':'border-transparent hover:bg-orange-50'}`}>{t.planetTab}</button>
          <button onClick={()=>handleTabChange(TAB_ASCENDANT)} className={`px-4 py-2 rounded-md font-bold text-orange-900 border ${tab===TAB_ASCENDANT?'bg-orange-100 border-orange-400':'border-transparent hover:bg-orange-50'}`}>{t.ascendantTab}</button>
          <button onClick={()=>handleTabChange(TAB_ASHTAKVARGA)} className={`px-4 py-2 rounded-md font-bold text-orange-900 border ${tab===TAB_ASHTAKVARGA?'bg-orange-100 border-orange-400':'border-transparent hover:bg-orange-50'}`}>{t.ashtakvargaTab}</button>
          <button onClick={()=>handleTabChange(TAB_BHINNASHTAK)} className={`px-4 py-2 rounded-md font-bold text-orange-900 border ${tab===TAB_BHINNASHTAK?'bg-orange-100 border-orange-400':'border-transparent hover:bg-orange-50'}`}>{t.bhinnashtakTab}</button>
          <button onClick={()=>handleTabChange(TAB_PLANETS_HOUSES)} className={`px-4 py-2 rounded-md font-bold text-orange-900 border ${tab===TAB_PLANETS_HOUSES?'bg-orange-100 border-orange-400':'border-transparent hover:bg-orange-50'}`}>{t.planetsHousesTab}</button>
          <button onClick={()=>handleTabChange(TAB_PLANET_REPORT)} className={`px-4 py-2 rounded-md font-bold text-orange-900 border ${tab===TAB_PLANET_REPORT?'bg-orange-100 border-orange-400':'border-transparent hover:bg-orange-50'}`}>{t.planetReportTab}</button>
          <button onClick={()=>handleTabChange(TAB_PERSONAL)} className={`px-4 py-2 rounded-md font-bold text-orange-900 border ${tab===TAB_PERSONAL?'bg-orange-100 border-orange-400':'border-transparent hover:bg-orange-50'}`}>{t.personalTab}</button>
          <button onClick={()=>handleTabChange(TAB_AI_PREDICTION)} className={`px-4 py-2 rounded-md font-bold text-orange-900 border ${tab===TAB_AI_PREDICTION?'bg-orange-100 border-orange-400':'border-transparent hover:bg-orange-50'}`}>{t.aiTab}</button>
          <button onClick={()=>handleTabChange(TAB_ASPECTS)} className={`px-4 py-2 rounded-md font-bold text-orange-900 border ${tab===TAB_ASPECTS?'bg-orange-100 border-orange-400':'border-transparent hover:bg-orange-50'}`}>{t.aspectsTab}</button>
          <button onClick={()=>handleTabChange(TAB_ALL_CHARTS)} className={`px-4 py-2 rounded-md font-bold text-orange-900 border ${tab===TAB_ALL_CHARTS?'bg-orange-100 border-orange-400':'border-transparent hover:bg-orange-50'}`}>{t.allChartsTab}</button>
          <button onClick={()=>handleTabChange(TAB_SADESATI)} className={`px-4 py-2 rounded-md font-bold text-orange-900 border ${tab===TAB_SADESATI?'bg-orange-100 border-orange-400':'border-transparent hover:bg-orange-50'}`}>{t.sadesatiTab}</button>
          <button onClick={()=>handleTabChange(TAB_KP)} className={`px-4 py-2 rounded-md font-bold text-orange-900 border ${tab===TAB_KP?'bg-orange-100 border-orange-400':'border-transparent hover:bg-orange-50'}`}>{t.kpTab}</button>
        </div>
        {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
        {tab === TAB_PLANET && planetResult && (
          <>
            {/* D1 Chart SVG at top always in ग्रह तालिका */}
            <div className="flex flex-col items-center justify-center my-4">
              {chartLoading && <div className="text-orange-700 p-4">{t.d1ChartLoading}</div>}
              {chartSvg && (
                <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl overflow-x-auto">
                  <div
                    className="w-full"
                    style={{ minHeight: 320 }}
                    dangerouslySetInnerHTML={{ __html: chartSvg }}
                  ></div>
                </div>
              )}
            </div>
            {/* Planet Table */}
            <div className="overflow-x-auto mt-2 mb-6">
              <h2 className="text-xl font-bold text-orange-700 mb-2">{t.planetTable}</h2>
              <table className="w-full border rounded shadow bg-white">
                <thead className="bg-orange-100">
                  <tr>
                    <th className="px-3 py-2">{t.lagna}</th>
                    <th className="px-3 py-2">{t.zodiac}</th>
                    <th className="px-3 py-2">{t.house}</th>
                    <th className="px-3 py-2">{t.nakshatra}</th>
                    <th className="px-3 py-2">{t.angle}</th>
                    <th className="px-3 py-2">{t.set}</th>
                    <th className="px-3 py-2">{t.lord}</th>
                    <th className="px-3 py-2">{t.avastha}</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(planetResult)
                    .filter(([k]) => !isNaN(Number(k)))
                    .map(([k, p]: any) => (
                    <tr key={k} className="border-t">
                      <td className="px-3 py-1 font-bold">{p.full_name||p.name}</td>
                      <td className="px-3 py-1">{p.zodiac}</td>
                      <td className="px-3 py-1">{p.house}</td>
                      <td className="px-3 py-1">{p.nakshatra}</td>
                      <td className="px-3 py-1">{typeof p.local_degree==='number'? p.local_degree.toFixed(2):p.local_degree}°</td>
                      <td className="px-3 py-1">{p.is_planet_set ? t.set : "-"}</td>
                      <td className="px-3 py-1">{p.lord_status||"-"}</td>
                      <td className="px-3 py-1">{p.basic_avastha||"-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Only under planet table/tab */}
            {divisionResult && (
              <div className="overflow-x-auto mt-8">
                <h2 className="text-xl font-bold text-orange-700 mb-2">{t.divisionalTable}</h2>
                <table className="w-full border rounded shadow bg-white">
                  <thead className="bg-orange-50">
                    <tr>
                      <th className="px-3 py-2">{t.lagna}</th>
                      <th className="px-3 py-2">{t.zodiac}</th>
                      <th className="px-3 py-2">{t.house}</th>
                      <th className="px-3 py-2">{t.retro}</th>
                      <th className="px-3 py-2">{t.angle}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(divisionResult)
                      .filter(([k]) => !isNaN(Number(k)))
                      .map(([k, p]: any) => (
                      <tr key={k} className="border-t">
                        <td className="px-3 py-1 font-bold">{p.full_name||p.name}</td>
                        <td className="px-3 py-1">{p.zodiac}</td>
                        <td className="px-3 py-1">{p.house}</td>
                        <td className="px-3 py-1 text-center">{p.retro ? t.retro : ""}</td>
                        <td className="px-3 py-1">{typeof p.local_degree ==='number'?p.local_degree.toFixed(2):p.local_degree}°</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
        {/* Ascendant Report Section with NO divisional table under it */}
        {tab===TAB_ASCENDANT && (
          <div className="overflow-x-auto mt-2 mb-6">
            <h2 className="text-xl font-bold text-orange-700 mb-2">{t.ascendantTab}</h2>
            {!ascendantResult && <div className="italic text-gray-400 py-8 text-center">{t.loading}</div>}
            {ascendantResult && ascendantResult.length>0 && (
              <div className="bg-orange-50 border border-orange-200 p-4 rounded">
                <div className="font-bold mb-2">{t.lagna}: <span className="text-orange-800">{ascendantResult[0].ascendant}</span> (<span>{ascendantResult[0].ascendant_lord}</span>)</div>
                <div className="text-sm mb-2"><strong>{t.lagneshStatus}:</strong> {ascendantResult[0].ascendant_lord_location}, {t.house}: {ascendantResult[0].ascendant_lord_house_location}</div>
                <div className="mb-2"><strong>{t.mainQuality}:</strong> <span className="text-orange-800">{ascendantResult[0].flagship_qualities}</span></div>
                <div className="mb-2"><strong>{t.general}:</strong> {ascendantResult[0].general_prediction}</div>
                <div className="mb-2"><strong>{t.personalised}:</strong> {ascendantResult[0].personalised_prediction}</div>
                <div className="mb-2"><strong>{t.spiritualityAdvice}:</strong> {ascendantResult[0].spirituality_advice}</div>
                <div className="mb-2"><strong>{t.positive}:</strong> {ascendantResult[0].good_qualities}</div>
                <div className="mb-2"><strong>{t.negative}:</strong> {ascendantResult[0].bad_qualities}</div>
                <div className="mb-2"><strong>{t.luckyGem}:</strong> {ascendantResult[0].lucky_gem||"-"} &nbsp; <strong>{t.dayForFasting}:</strong> {ascendantResult[0].day_for_fasting||"-"}</div>
                <div className="mb-2"><strong>{t.gayatriMantra}:</strong> <span className="break-all">{ascendantResult[0].gayatri_mantra}</span></div>
                <div className="mb-2"><strong>{t.strength}:</strong> {ascendantResult[0].ascendant_lord_strength}</div>
                <div className="mb-2"><strong>{t.verbalLocation}:</strong> {ascendantResult[0].verbal_location}</div>
                <div className="mb-2"><strong>{t.rashiChar}:</strong> {ascendantResult[0].zodiac_characteristics}</div>
              </div>
            )}
          </div>
        )}
        {tab===TAB_ASHTAKVARGA && (
          <div className="overflow-x-auto mt-2 mb-6">
            <h2 className="text-xl font-bold text-orange-700 mb-2">{t.ashtakvargaTab}</h2>
            <div className="flex items-center gap-3 mb-3">
              <Label>{t.planetSelectLabel}</Label>
              <Select value={avPlanet} onValueChange={(v) => setAvPlanet(v as PlanetName)}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PLANET_NAMES.map((value) => (
                    <SelectItem key={value} value={value}>
                      {PLANET_LABELS[form.lang]?.[value] || PLANET_LABELS.en[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col items-center justify-center my-4">
              {avSvgLoading && <div className="text-orange-700 p-4">{t.d1ChartLoading}</div>}
              {avSvg && (
                <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl overflow-x-auto">
                  <div className="w-full" style={{ minHeight: 320 }} dangerouslySetInnerHTML={{ __html: avSvg }}></div>
                </div>
              )}
            </div>
            {!ashtakvarga && <div className="italic text-gray-400 py-8 text-center">{t.loading}</div>}
            {ashtakvarga && (
              <div className="bg-white border rounded shadow p-2">
                <table className="w-full border rounded shadow bg-white">
                  <thead className="bg-orange-50">
                    <tr>
                      <th className="px-3 py-2"></th>
                      {[...Array(12)].map((_,i)=>(<th key={i} className="px-2 py-1">{i+1}</th>))}
                    </tr>
                  </thead>
                  <tbody>
                    {ashtakvarga.ashtakvarga_order?.map((name: string, idx: number)=> (
                      <tr key={idx} className="border-t">
                        <td className="px-3 py-1 font-bold whitespace-nowrap">{name}</td>
                        {ashtakvarga.ashtakvarga_points?.[idx]?.map((v: number, ci: number)=>(
                          <td key={ci} className="px-2 py-1 text-center">{v}</td>
                        ))}
                      </tr>
                    ))}
                    <tr className="border-t bg-orange-100">
                      <th className="px-3 py-1 text-right">{t.avTotal}</th>
                      {ashtakvarga.ashtakvarga_total?.map((v: number, i: number)=> (
                        <th key={i} className="px-2 py-1 text-center">{v}</th>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {tab===TAB_BHINNASHTAK && (
          <div className="space-y-4 mt-4">
            <div className="max-w-sm mx-auto w-full space-y-2 text-left">
              <Label>{t.planetSelectLabel}</Label>
              <Select value={bhinnPlanet} onValueChange={(v) => setBhinnPlanet(v as PlanetName)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PLANET_NAMES.map((value) => (
                    <SelectItem key={value} value={value}>
                      {PLANET_LABELS[form.lang]?.[value] || PLANET_LABELS.en[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {bhinnLoading && <div className="text-center text-orange-700">{t.loading}</div>}
            {!bhinnLoading && bhinnError && (
              <div className="text-center text-red-600">{bhinnError}</div>
            )}
            {!bhinnLoading && !bhinnError && !bhinnData && (
              <div className="text-center text-gray-600">{t.planetNoData}</div>
            )}
            {bhinnData && (
              <div className="overflow-x-auto">
                <h2 className="text-xl font-bold text-orange-700 mb-2">
                  {t.bhinnashtakTab} – {PLANET_LABELS[form.lang]?.[bhinnPlanet] || bhinnPlanet}
                </h2>
                <table className="w-full border rounded shadow bg-white">
                  <thead className="bg-orange-50">
                    <tr>
                      <th className="px-3 py-2 text-left">{t.house}</th>
                      {Array.from({ length: 12 }).map((_, idx) => (
                        <th key={idx} className="px-2 py-1 text-center">
                          {idx + 1}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(bhinnData).map(([key, arr]: any) => (
                      <tr key={key} className="border-t">
                        <td className="px-3 py-1 font-semibold whitespace-nowrap">{key}</td>
                        {arr.map((v: number, idx: number) => (
                          <td
                            key={idx}
                            className={`px-2 py-1 text-center ${
                              v ? "bg-orange-100 font-semibold text-orange-800" : ""
                            }`}
                          >
                            {v}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {tab===TAB_PLANETS_HOUSES && (
          <div className="space-y-4 mt-4">
            {planetsHousesLoading && <div className="text-center text-orange-700">{t.loading}</div>}
            {!planetsHousesLoading && planetsHousesError && (
              <div className="text-center text-red-600">{planetsHousesError}</div>
            )}
            {!planetsHousesLoading && !planetsHousesError && !planetsHouses && (
              <div className="text-center text-gray-600">{t.planetNoData}</div>
            )}
            {planetsHouses && (
              <div className="overflow-x-auto">
                <h2 className="text-xl font-bold text-orange-700 mb-2">
                  {t.planetsHousesTab}
                </h2>
                <table className="w-full border rounded shadow bg-white">
                  <thead className="bg-orange-50">
                    <tr>
                      <th className="px-3 py-2 text-left">{t.house}</th>
                      <th className="px-3 py-2 text-left">{t.zodiac}</th>
                      <th className="px-3 py-2 text-left">{t.planetName}</th>
                      <th className="px-3 py-2 text-left">{t.houseSignification}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(planetsHouses)
                      .sort((a, b) => Number(a) - Number(b))
                      .map((key) => {
                        const row = (planetsHouses as any)[key];
                        return (
                          <tr key={key} className="border-t align-top">
                            <td className="px-3 py-2 font-semibold">{row.house}</td>
                            <td className="px-3 py-2">
                              {row.zodiac}{" "}
                              <span className="text-xs text-gray-500">#{row.rasi_no}</span>
                            </td>
                            <td className="px-3 py-2">
                              {row.planets && row.planets.length > 0 ? (
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                  {row.planets.map((p: string, idx: number) => (
                                    <li key={idx}>{p}</li>
                                  ))}
                                </ul>
                              ) : (
                                <span className="text-gray-500 text-sm">-</span>
                              )}
                            </td>
                            <td className="px-3 py-2 text-sm">{row.signification}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {tab===TAB_PERSONAL && (
          <div className="space-y-4 mt-4">
            {personalLoading && <div className="text-center text-orange-700">{t.loading}</div>}
            {!personalLoading && personalError && (
              <div className="text-center text-red-600">{personalError}</div>
            )}
            {!personalLoading && !personalError && (!personalChars || personalChars.length === 0) && (
              <div className="text-center text-gray-600">{t.planetNoData}</div>
            )}
            {personalChars?.map((item, idx) => (
              <div key={`${item.current_house}-${idx}`} className="border rounded-lg p-4 shadow-sm bg-white space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <InfoRow label={t.personalHouse} value={item.current_house} />
                  <InfoRow label={t.personalZodiac} value={item.current_zodiac} />
                  <InfoRow label={t.personalZodiacLord} value={item.lord_of_zodiac} />
                  <InfoRow label={t.personalZodiacLordLoc} value={item.lord_zodiac_location} />
                  <InfoRow label={t.personalHouseLocation} value={item.lord_house_location} />
                  <InfoRow label={t.personalStrength} value={item.lord_strength} />
                  <InfoRow label={t.verbalLocation} value={item.verbal_location} />
                </div>
                {item.personalised_prediction && (
                  <SectionBlock title={t.personalPrediction} content={item.personalised_prediction} />
                )}
              </div>
            ))}
          </div>
        )}
        {tab===TAB_AI_PREDICTION && (
          <div className="space-y-4 mt-4">
            {aiLoading && <div className="text-center text-orange-700">{t.loading}</div>}
            {!aiLoading && aiError && (
              <div className="text-center text-red-600">{aiError}</div>
            )}
            {!aiLoading && !aiError && aiPredictions && aiPredictions.length > 0 && (
              <>
                <div className="max-w-sm mx-auto w-full text-left space-y-2">
                  <Label>{t.aiSelectMonth}</Label>
                  <Select value={aiSelectedIndex} onValueChange={setAiSelectedIndex}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {aiPredictions.map((entry, index) => (
                        <SelectItem key={index} value={String(index)}>
                          {formatAiMonthLabel(entry, form.lang)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <AiPredictionCard
                  entry={aiPredictions[Number(aiSelectedIndex)]}
                  lang={form.lang}
                />
              </>
            )}
            {!aiLoading && !aiError && (!aiPredictions || aiPredictions.length === 0) && (
              <div className="text-center text-gray-600">{t.planetNoData}</div>
            )}
          </div>
        )}
        {tab===TAB_ASPECTS && (
          <div className="space-y-4 mt-4">
            {aspectsLoading && <div className="text-center text-orange-700">{t.loading}</div>}
            {!aspectsLoading && aspectsError && (
              <div className="text-center text-red-600">{aspectsError}</div>
            )}
            {!aspectsLoading && !aspectsError && !aspectsData && (
              <div className="text-center text-gray-600">{t.planetNoData}</div>
            )}
            {aspectsData && (
              <div className="overflow-x-auto">
                <h2 className="text-xl font-bold text-orange-700 mb-2">{t.aspectsTab}</h2>
                <table className="w-full border rounded shadow bg-white">
                  <thead className="bg-orange-50">
                    <tr>
                      <th className="px-3 py-2 text-left">{t.house}</th>
                      <th className="px-3 py-2 text-left">{t.zodiac}</th>
                      <th className="px-3 py-2 text-left">{t.planetTab}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(aspectsData)
                      .sort((a, b) => Number(a) - Number(b))
                      .map((key) => {
                        const h = aspectsData[key];
                        return (
                          <tr key={key} className="border-t align-top">
                            <td className="px-3 py-2 font-semibold">{h.house}</td>
                            <td className="px-3 py-2">
                              <div>{h.zodiac}</div>
                              <div className="text-xs text-gray-500">#{h.rasi_no}</div>
                            </td>
                            <td className="px-3 py-2">
                              {h.aspected_by_planet && h.aspected_by_planet.length > 0 ? (
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                  {h.aspected_by_planet.map((p: string, idx: number) => (
                                    <li key={idx}>{p}</li>
                                  ))}
                                </ul>
                              ) : (
                                <span className="text-gray-500 text-sm">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {tab===TAB_ALL_CHARTS && (
          <div className="space-y-4 mt-4">
            {chartsLoading && <div className="text-center text-orange-700">{t.loading}</div>}
            {!chartsLoading && Object.keys(chartsMap).length === 0 && (
              <div className="text-center text-gray-600">{t.planetNoData}</div>
            )}
            {!chartsLoading && Object.keys(chartsMap).length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {chartDivs.map((div) => (
                  <div
                    key={div}
                    className="border rounded-lg bg-white shadow-sm p-2 flex flex-col items-center"
                  >
                    <h3 className="text-sm font-semibold text-orange-800 mb-2">{div}</h3>
                    {chartsMap[div] ? (
                      <div
                        className="w-full max-w-[220px]"
                        style={{ minHeight: 180 }}
                        dangerouslySetInnerHTML={{ __html: chartsMap[div] as string }}
                      />
                    ) : (
                      <div className="text-xs text-gray-500 py-6 text-center w-full">
                        {t.chartLoadErr}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {tab===TAB_SADESATI && (
          <div className="space-y-4 mt-4">
            {sadeLoading && <div className="text-center text-orange-700">{t.loading}</div>}
            {!sadeLoading && sadeError && (
              <div className="text-center text-red-600">{sadeError}</div>
            )}
            {!sadeLoading && !sadeError && !sadeData && (
              <div className="text-center text-gray-600">{t.planetNoData}</div>
            )}
            {sadeData && (
              <div className="border rounded-xl bg-orange-50/60 p-5 space-y-3">
                <h2 className="text-xl font-bold text-orange-800 mb-2">
                  {t.sadesatiHeading}
                </h2>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <strong>{t.sadesatiDate}:</strong> {sadeData.date_considered}
                  </div>
                  <div>
                    <strong>{t.sadesatiType}:</strong> {sadeData.shani_period_type}
                  </div>
                  {typeof sadeData.age !== "undefined" && (
                    <div>
                      <strong>{t.sadesatiAge}:</strong> {sadeData.age}
                    </div>
                  )}
                  <div>
                    <strong>{t.retro}:</strong>{" "}
                    {sadeData.saturn_retrograde ? t.retro : "-"}
                  </div>
                </div>
                {sadeData.bot_response && (
                  <p className="text-sm text-orange-900">
                    <strong>AI:</strong> {sadeData.bot_response}
                  </p>
                )}
                {sadeData.description && (
                  <p className="text-sm leading-relaxed">{sadeData.description}</p>
                )}
                {Array.isArray(sadeData.remedies) && sadeData.remedies.length > 0 && (
                  <div className="mt-2">
                    <h3 className="font-semibold text-orange-800 mb-1">
                      {t.sadesatiRemedies}
                    </h3>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {sadeData.remedies.map((r: string, idx: number) => (
                        <li key={idx}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {tab===TAB_KP && (
          <div className="space-y-6 mt-4">
            {kpLoading && <div className="text-center text-orange-700">{t.loading}</div>}
            {!kpLoading && kpError && (
              <div className="text-center text-red-600">{kpError}</div>
            )}
            {!kpLoading && !kpError && (!kpPlanets || !kpHouses) && (
              <div className="text-center text-gray-600">{t.planetNoData}</div>
            )}
            {kpPlanets && (
              <div className="overflow-x-auto">
                <h2 className="text-xl font-bold text-orange-700 mb-2">
                  {t.kpPlanetsHeading}
                </h2>
                <table className="w-full border rounded shadow bg-white text-sm">
                  <thead className="bg-orange-50">
                    <tr>
                      <th className="px-3 py-2 text-left">{t.planetName}</th>
                      <th className="px-3 py-2 text-left">{t.zodiac}</th>
                      <th className="px-3 py-2 text-left">{t.house}</th>
                      <th className="px-3 py-2 text-left">{t.retro}</th>
                      <th className="px-3 py-2 text-left">Pseudo Rāśi</th>
                      <th className="px-3 py-2 text-left">Pseudo Nakshatra</th>
                      <th className="px-3 py-2 text-left">Sub-lord</th>
                      <th className="px-3 py-2 text-left">Sub-sub-lord</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(kpPlanets)
                      .filter(([k]) => !isNaN(Number(k)))
                      .map(([key, p]: any) => (
                        <tr key={key} className="border-t align-top">
                          <td className="px-3 py-2 font-semibold">{p.full_name || p.name}</td>
                          <td className="px-3 py-2">{p.zodiac}</td>
                          <td className="px-3 py-2">{p.house}</td>
                          <td className="px-3 py-2">
                            {p.retro ? t.retro : "-"}
                          </td>
                          <td className="px-3 py-2">
                            {p.pseudo_rasi}{" "}
                            <span className="text-xs text-gray-500">#{p.pseudo_rasi_no}</span>
                          </td>
                          <td className="px-3 py-2">
                            {p.pseudo_nakshatra}{" "}
                            {p.pseudo_nakshatra_pada
                              ? `(${p.pseudo_nakshatra_pada})`
                              : null}
                          </td>
                          <td className="px-3 py-2">{p.sub_lord}</td>
                          <td className="px-3 py-2">{p.sub_sub_lord}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
            {kpHouses && (
              <div className="overflow-x-auto">
                <h2 className="text-xl font-bold text-orange-700 mb-2">
                  {t.kpHousesHeading}
                </h2>
                <table className="w-full border rounded shadow bg-white text-sm">
                  <thead className="bg-orange-50">
                    <tr>
                      <th className="px-3 py-2 text-left">{t.house}</th>
                      <th className="px-3 py-2 text-left">{t.zodiac}</th>
                      <th className="px-3 py-2 text-left">Start–End</th>
                      <th className="px-3 py-2 text-left">Bhav Madhya</th>
                      <th className="px-3 py-2 text-left">Cusp lords</th>
                      <th className="px-3 py-2 text-left">{t.planetName}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kpHouses.map((h: any, idx: number) => (
                      <tr key={idx} className="border-t align-top">
                        <td className="px-3 py-2 font-semibold">{h.house}</td>
                        <td className="px-3 py-2">
                          {h.start_rasi} → {h.end_rasi}
                        </td>
                        <td className="px-3 py-2">
                          {h.global_start_degree.toFixed(2)}° →{" "}
                          {h.global_end_degree.toFixed(2)}°
                        </td>
                        <td className="px-3 py-2">
                          {h.bhavmadhya.toFixed(2)}°
                        </td>
                        <td className="px-3 py-2">
                          <div>Sub: {h.cusp_sub_lord}</div>
                          <div className="text-xs text-gray-600">
                            Sub-sub: {h.cusp_sub_sub_lord}
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          {h.planets && h.planets.length > 0 ? (
                            <ul className="list-disc list-inside space-y-1">
                              {h.planets.map((p: any) => (
                                <li key={p.planetId}>
                                  {p.full_name}{" "}
                                  {p.retro ? `(${t.retro})` : ""}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-gray-500 text-xs">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {tab===TAB_PLANET_REPORT && (
          <div className="space-y-4">
            <div className="max-w-sm mx-auto w-full space-y-2 text-left">
              <Label>{t.planetSelectLabel}</Label>
              <Select value={reportPlanet} onValueChange={(v) => setReportPlanet(v as PlanetName)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PLANET_NAMES.map((value) => (
                    <SelectItem key={value} value={value}>
                      {PLANET_LABELS[form.lang]?.[value] || PLANET_LABELS.en[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {planetReportLoading && <div className="text-center text-orange-700">{t.loading}</div>}
            {!planetReportLoading && planetReportError && (
              <div className="text-center text-red-600">{planetReportError}</div>
            )}
            {!planetReportLoading && !planetReportError && (!planetReportData || planetReportData.length === 0) && (
              <div className="text-center text-gray-600">{t.planetNoData}</div>
            )}
            {planetReportData?.map((item, idx) => (
              <div key={`${item.planet_considered || reportPlanet}-${idx}`} className="border rounded-lg p-4 shadow-sm bg-orange-50/40 space-y-3">
                <h3 className="text-lg font-semibold text-orange-800">{t.planetReportHeading}: {item.planet_considered || (PLANET_LABELS[form.lang]?.[reportPlanet] || reportPlanet)}</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <InfoRow label={t.planetConsidered} value={item.planet_considered} />
                  <InfoRow label={t.planetLocation} value={item.planet_location} />
                  <InfoRow label={t.planetNativeLocation} value={item.planet_native_location} />
                  <InfoRow label={t.planetZodiac} value={item.planet_zodiac} />
                  <InfoRow label={t.zodiacLord} value={item.zodiac_lord} />
                  <InfoRow label={t.zodiacLordLocation} value={item.zodiac_lord_location} />
                  <InfoRow label={t.zodiacLordHouse} value={item.zodiac_lord_house_location} />
                  <InfoRow label={t.zodiacLordStrength} value={item.zodiac_lord_strength} />
                  <InfoRow label={t.planetStrength} value={item.planet_strength} />
                  <InfoRow label={t.verbalLocation} value={item.verbal_location} />
                </div>
                {item.general_prediction && (
                  <SectionBlock title={t.general} content={item.general_prediction} />
                )}
                {item.personalised_prediction && (
                  <SectionBlock title={t.personalised} content={item.personalised_prediction} />
                )}
                {item.planet_zodiac_prediction && (
                  <SectionBlock title={t.planetZodiacPrediction} content={item.planet_zodiac_prediction} />
                )}
                {item.qualities_long && (
                  <SectionBlock title={t.planetQualitiesLong} content={item.qualities_long} />
                )}
                {item.qualities_short && (
                  <SectionBlock title={t.planetQualitiesShort} content={item.qualities_short} />
                )}
                {item.affliction && (
                  <SectionBlock title={t.planetAffliction} content={item.affliction} />
                )}
                {(item.character_keywords_positive?.length > 0 || item.character_keywords_negative?.length > 0) && (
                  <div className="grid md:grid-cols-2 gap-3">
                    {item.character_keywords_positive?.length > 0 && (
                      <TraitsBlock title={t.planetPositiveTraits} items={item.character_keywords_positive} tone="positive" />
                    )}
                    {item.character_keywords_negative?.length > 0 && (
                      <TraitsBlock title={t.planetNegativeTraits} items={item.character_keywords_negative} tone="negative" />
                    )}
                  </div>
                )}
                {item.planet_definitions && (
                  <SectionBlock title={t.planetDefinition} content={item.planet_definitions} />
                )}
                {item.gayatri_mantra && (
                  <SectionBlock title={t.planetGayatriMantra} content={item.gayatri_mantra} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | number }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="bg-white/70 rounded p-2 border border-orange-100">
      <div className="text-xs uppercase tracking-wide text-orange-500">{label}</div>
      <div className="font-semibold text-orange-900">{value}</div>
    </div>
  );
}

function SectionBlock({ title, content }: { title: string; content: string }) {
  if (!content) return null;
  return (
    <div className="bg-white rounded-md p-3 border border-orange-100">
      <div className="text-sm font-semibold text-orange-700 mb-1">{title}</div>
      <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{content}</p>
    </div>
  );
}

function TraitsBlock({ title, items, tone }: { title: string; items: string[]; tone: "positive" | "negative" }) {
  if (!items || items.length === 0) return null;
  const colors = tone === "positive" ? "bg-green-50 border-green-200 text-green-900" : "bg-red-50 border-red-200 text-red-900";
  return (
    <div className={`rounded-md border p-3 ${colors}`}>
      <div className="text-sm font-semibold mb-2">{title}</div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, idx) => (
          <span key={`${item}-${idx}`} className="px-2 py-1 rounded-full bg-white/70 text-xs font-semibold">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function formatAiMonthLabel(entry: any, lang: SupportedLang) {
  const spec = entry?.specifications;
  if (!spec) return translations[lang]?.aiTab || "Month";
  if (spec.start_month && spec.end_month) {
    return `${spec.start_month} - ${spec.end_month}`;
  }
  if (spec.start_date) return spec.start_date;
  return translations[lang]?.aiTab || "Month";
}

function HouseScores({ scores, lang }: { scores?: Record<string, string>; lang: SupportedLang }) {
  if (!scores) return null;
  const entries = Object.entries(scores);
  if (!entries.length) return null;
  const label = translations[lang]?.aiHouseScores || "House Scores";
  return (
    <div className="bg-white border border-orange-100 rounded-md p-3 mt-3">
      <div className="text-sm font-semibold text-orange-700 mb-2">{label}</div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
        {entries.map(([house, value]) => (
          <div key={house} className="bg-orange-50 rounded px-3 py-2 flex justify-between">
            <span className="font-semibold text-orange-900">{house}</span>
            <span>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AiPredictionCard({ entry, lang }: { entry: any; lang: SupportedLang }) {
  if (!entry) return null;
  const t = translations[lang] || translations.en;
  const specs = entry.specifications || {};
  const categories = entry.predictions ? Object.entries(entry.predictions) : [];
  return (
    <div className="space-y-4">
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <div className="text-lg font-semibold text-orange-800 mb-2">{t.aiSpecifications}</div>
        <div className="grid md:grid-cols-2 gap-3">
          <InfoRow label={t.aiStartDate} value={specs.start_date} />
          <InfoRow label={t.aiEndDate} value={specs.end_date} />
          <InfoRow label={t.aiDasha} value={specs.dasha} />
          <InfoRow label={t.aiOutcome} value={specs.dasha_inflection ? "Yes" : "No"} />
        </div>
      </div>
      {categories.length > 0 ? (
        <div className="space-y-4">
          {categories.map(([key, value]: any) => {
            const labelKey = AI_CATEGORY_KEYS[key] || "";
            const title = (labelKey ? t[labelKey] : "") || key;
            return (
              <div key={key} className="bg-white border rounded-lg p-4 shadow-sm space-y-3">
                <div className="text-lg font-semibold text-orange-900">{title}</div>
                <div className="grid md:grid-cols-2 gap-3">
                  <InfoRow label={t.aiOutcome} value={value?.outcome} />
                  <InfoRow label={t.aiProbability} value={value?.probability} />
                </div>
                {value?.bot_response && (
                  <SectionBlock title={t.personalPrediction} content={value.bot_response} />
                )}
                {value?.contributors && (
                  <SectionBlock title={t.planetDefinition} content={value.contributors} />
                )}
                <HouseScores scores={value?.houseScores} lang={lang} />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-600">{t.planetNoData}</div>
      )}
    </div>
  );
}
