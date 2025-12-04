export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface SlotTemplate {
  day: Weekday;
  slots: string[];
}

function generateSlots(start: string, end: string) {
  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  const startMin = toMinutes(start);
  const endMin = toMinutes(end);
  const slots: string[] = [];
  for (let m = startMin; m + 30 <= endMin; m += 30) {
    const h = Math.floor(m / 60);
    const mm = m % 60;
    slots.push(`${h.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}`);
  }
  return slots;
}

export interface AstrologerProfile {
    id: string;
  slug: string;
    name: string;
  headline: string;
  topicExpertise: string;
  experienceRange: string;
    rating: number;
    totalConsultations: number;
  avatar: string;
  shortBio: string;
  longBio: string;
    languages: string[];
  fee: number;
  sessionMinutes: number;
  credentials: string[];
  availabilityTemplate: SlotTemplate[];
  privateDetails: {
    dob: string;
    gender: "Female";
    phone: string;
    email: string;
  };
  login: {
    username: string;
    password: string;
  };
}

const DEFAULT_TEMPLATE: SlotTemplate[] = [
  { day: 1, slots: generateSlots("09:00", "12:00") },
];

export const astrologers: AstrologerProfile[] = [
  {
    id: "astro-ShriPriya",
    slug: "astro-ShriPriya",
    name: "Astro ShriPriya",
    headline: "7+ वर्ष का अनुभव • वैदिक ज्योतिष मार्गदर्शक",
    topicExpertise: "वैदिक ज्योतिष",
    experienceRange: "7+ वर्षे",
      rating: 4.9,
    totalConsultations: 2400,
    avatar: "https://drjyotijoshi.com/wp-content/uploads/2025/11/No1.jpg?auto=format&fit=crop&w=800&q=80",
    shortBio:
      "७ वर्षांचा अनुभव असलेल्या, ‘श्री गुरुकृपा ज्योती संस्था’च्या संचालिका व पुरस्कारप्राप्त ज्योतिष अभ्यासिका.",
    longBio:
      "गेल्या सात वर्षांपासून ज्योतिष क्षेत्रात कार्यरत. महाराष्ट्र ज्योतिष परिषद मान्यता प्राप्त श्री गुरुकृपा ज्योतिष संस्थेच्या संचालिका. संस्थेमार्फत शेकडो विद्यार्थ्यांना ज्योतिष प्रशिक्षण. आजवर हजारो लोकांना ज्योतिषशास्त्राच्या माध्यमातून मार्गदर्शन. वैदिक ज्योतिष, कृष्णमूर्ती पद्धती, अंकशास्त्र, अष्टकवर्ग, वास्तुशास्त्र अभ्यासक. अनेक ज्योतिष अधिवेशनात व्याख्याने. ज्योतिश्री तसेच अहिल्यारत्न पुरस्कार प्राप्त.",
    languages: ["मराठी", "हिंदी", "English"],
    fee: 1100,
    sessionMinutes: 30,
    credentials: [
      "ज्योतिष विशेषज्ञ (Vedic + KP System)",
      "अंकशास्त्र व वास्तु अभ्यासक",
      "मान्यताप्राप्त श्री गुरुकृपा ज्योती संस्था – संचालिका",
      "शेकडो विद्यार्थ्यांना ज्योतिष प्रशिक्षण",
      "हजारो लोकांना वैदिक मार्गदर्शन",
    ],
    // Astro ShriPriya – everyday 11:00 to 20:00, 30-minute slots
    availabilityTemplate: [
      { day: 0, slots: generateSlots("11:00", "20:00") },
      { day: 1, slots: generateSlots("11:00", "20:00") },
      { day: 2, slots: generateSlots("11:00", "20:00") },
      { day: 3, slots: generateSlots("11:00", "20:00") },
      { day: 4, slots: generateSlots("11:00", "20:00") },
      { day: 5, slots: generateSlots("11:00", "20:00") },
      { day: 6, slots: generateSlots("11:00", "20:00") },
    ],
    privateDetails: {
      dob: "1983-05-19",
      gender: "Female",
      phone: "9075257345",
      email: "shwetabokil4@gmail.com",
    },
    login: {
      username: "shweta",
      password: "shweta@2025",
    },
  },
  {
    id: "Astrologer Aacharya Shivangi",
    slug: "Astrologer-Aacharya-Shivangi",
    name: "Astrologer Aacharya Shivangi",
    headline: "6+ वर्ष का अनुभव • वैदिक ज्योतिष मार्गदर्शक",
    topicExpertise: "वैदिक ज्योतिष",
    experienceRange: "6–10 वर्षे",
    rating: 4.9,
    totalConsultations: 1700,
    avatar: "https://drjyotijoshi.com/wp-content/uploads/2025/11/6.jpg?auto=format&fit=crop&w=800&q=80",
    shortBio:
      "एम.ए., बी.एड. इंग्लिश शिक्षणासोबत ज्योतिष विद्यावाचस्पती पदवीधर | वैदिक व टॅरो मार्गदर्शक | संयमित आणि व्यवहार्य उपायांची खासियत",
    longBio:
      "नमस्कार मी प्रीती चंद्रशेखर. माझे शिक्षण एम ए बी एड इंग्लिश आहे. तसेच मी ज्योतिष विद्यावाचस्पती ही पदवी सुद्धा पूर्ण केलेली आहे. मी टॅरो कार्ड्स आणि अंक ज्योतिष चे शिक्षण घेतले आहे. गेले सहा वर्ष झाले मी ज्योतिषी म्हणून कार्यरत आहे.",
    languages: ["मराठी", "हिंदी", "English"],
    fee: 1100,
    sessionMinutes: 30,
    credentials: [
      "ज्योतिष विद्यावाचस्पती",
      "टॅरो व अंक ज्योतिष सर्टिफाइड",
      "6+ वर्षे अनुभव",
    ],
    // Astrologer Aacharya Shivangi – everyday 14:00–17:00 and 19:00–22:00
    availabilityTemplate: [
      {
        day: 0,
        slots: [...generateSlots("14:00", "17:00"), ...generateSlots("19:00", "22:00")],
      },
      {
        day: 1,
        slots: [...generateSlots("14:00", "17:00"), ...generateSlots("19:00", "22:00")],
      },
      {
        day: 2,
        slots: [...generateSlots("14:00", "17:00"), ...generateSlots("19:00", "22:00")],
      },
      {
        day: 3,
        slots: [...generateSlots("14:00", "17:00"), ...generateSlots("19:00", "22:00")],
      },
      {
        day: 4,
        slots: [...generateSlots("14:00", "17:00"), ...generateSlots("19:00", "22:00")],
      },
      {
        day: 5,
        slots: [...generateSlots("14:00", "17:00"), ...generateSlots("19:00", "22:00")],
      },
      {
        day: 6,
        slots: [...generateSlots("14:00", "17:00"), ...generateSlots("19:00", "22:00")],
      },
    ],
    privateDetails: {
      dob: "1984-08-25",
      gender: "Female",
      phone: "9767773236",
      email: "pritichandrashekhar123@gmail.com",
    },
    login: {
      username: "priti",
      password: "priti@2025",
    },
  },
  {
    id: "gauri-gopinath-pol",
    slug: "gauri-gopinath-pol",
    name: "Dr. Gauri Gopinath Pol",
    headline: "ज्योतिष वाचस्पति • वैदिक ज्योतिष विशेषज्ञ",
    topicExpertise: "वैदिक ज्योतिष",
    experienceRange: "6–10 वर्षे",
      rating: 4.8,
    totalConsultations: 1800,
    avatar: "https://drjyotijoshi.com/wp-content/uploads/2025/11/5.jpg?auto=format&fit=crop&w=800&q=80",
    shortBio:
      "ज्योतिष वाचस्पति | ज्योतिष अलंकार व मार्तंड | परिवार आणि करिअर मार्गदर्शनासाठी खास",
    longBio:
      "(1) ज्योतिष वाचस्पति, (2) ज्योतिष अलंकार, (3) ज्योतिष मार्तंड. जीवनातील प्रत्येक दिशेसाठी वैदिक मार्गदर्शनाचा समृद्ध अनुभव.",
    languages: ["मराठी", "हिंदी"],
    fee: 1100,
    sessionMinutes: 30,
    credentials: ["ज्योतिष वाचस्पति", "ज्योतिष अलंकार", "ज्योतिष मार्तंड"],
    // Dr. Gauri Gopinath Pol – everyday 17:00 to 21:00
    availabilityTemplate: [
      { day: 0, slots: generateSlots("17:00", "21:00") },
      { day: 1, slots: generateSlots("17:00", "21:00") },
      { day: 2, slots: generateSlots("17:00", "21:00") },
      { day: 3, slots: generateSlots("17:00", "21:00") },
      { day: 4, slots: generateSlots("17:00", "21:00") },
      { day: 5, slots: generateSlots("17:00", "21:00") },
      { day: 6, slots: generateSlots("17:00", "21:00") },
    ],
    privateDetails: {
      dob: "1969-03-25",
      gender: "Female",
      phone: "8928386999",
      email: "mruga1317@gmail.com",
    },
    login: {
      username: "gauri",
      password: "Gauri@2025",
    },
  },
  {
    id: "sanjeevani-ramdurgkar",
    slug: "sanjeevani-ramdurgkar",
    name: "Astrologer Acharya Devyani",
    headline: "10+ वर्षांचा अनुभव • ज्योतिष भूषण A ग्रेड",
    topicExpertise: "वैदिक ज्योतिष",
    experienceRange: "10+ वर्षे",
    rating: 4.95,
    totalConsultations: 1400,
    avatar: "https://drjyotijoshi.com/wp-content/uploads/2025/11/4.jpg?auto=format&fit=crop&w=800&q=80&sat=-60&blend-mode=multiply",
    shortBio:
      "Jyotish Praveen • Jyotish Visharad • Diploma in Ashtakvarg | व्यावहारिक उपाय",
    longBio:
      "Jyotish Praveen ,Jyotish visharad ,Jyotish Bhaskar 'A ,grade Diploma in AshtakVarg. वैदिक ज्योतिषातील प्रत्यक्ष अनुभवासह विद्यार्थ्यांना आणि ग्राहकालाही मार्गदर्शन.",
    languages: ["मराठी", "हिंदी", "English"],
    fee: 1100,
    sessionMinutes: 30,
    credentials: [
      "Jyotish Praveen",
      "Jyotish Visharad",
      "Jyotish Bhaskar 'A",
      "Diploma in AshtakVarg",
    ],
    // Astrologer Acharya Devyani – everyday 09:00 to 13:00
    availabilityTemplate: [
      { day: 0, slots: generateSlots("09:00", "13:00") },
      { day: 1, slots: generateSlots("09:00", "13:00") },
      { day: 2, slots: generateSlots("09:00", "13:00") },
      { day: 3, slots: generateSlots("09:00", "13:00") },
      { day: 4, slots: generateSlots("09:00", "13:00") },
      { day: 5, slots: generateSlots("09:00", "13:00") },
      { day: 6, slots: generateSlots("09:00", "13:00") },
    ],
    privateDetails: {
      dob: "1963-07-29",
      gender: "Female",
      phone: "8317386961",
      email: "ramdurgkarsanjeevani@gmail.com",
    },
    login: {
      username: "sanjeevani",
      password: "Sanjeevani@2025",
    },
  },
  {
    id: "nilima-deepak-bauskar",
    slug: "nilima-deepak-bauskar",
    name: "Vedatagya Acharya Shaktidevi",
    headline: "रेट्रो-ज्योतिष अभ्यासू • शिक्षिका व वैदिक मार्गदर्शक",
    topicExpertise: "वैदिक ज्योतिष",
    experienceRange: "3–5 वर्षे",
      rating: 4.7,
    totalConsultations: 1850,
    avatar: "https://drjyotijoshi.com/wp-content/uploads/2025/11/3.jpg?auto=format&fit=crop&w=800&q=80",
    shortBio:
      "Jyotish Praveen • Jyotish Visharad • Destiny Manager | ऑनलाइन व ऑफलाइन मार्गदर्शन",
    longBio:
      "Jyotish Praveen ,Jyotish visharad ,Jyotish Bhaskar 'A ,grade Diploma in AshtakVarg. वैदिक praveen to ratna exam done, astrology and MA in astrology 1st semester clear from Jyotish Sanshodhan Kendra, Jalgaon by Dr. Jyoti Joshi.",
    languages: ["मराठी", "हिंदी", "English"],
    fee: 1100,
    sessionMinutes: 30,
    credentials: [
      "Jyotish Praveen",
      "Jyotish Visharad",
      "Jyotish Bhaskar 'A",
      "Destiny Manager - Abhijit Pratishthan",
    ],
    // Vedatagya Acharya Shaktidevi – Mon, Wed, Thu, Fri 12:00 to 17:00
    availabilityTemplate: [
      { day: 1, slots: generateSlots("12:00", "17:00") },
      { day: 3, slots: generateSlots("12:00", "17:00") },
      { day: 4, slots: generateSlots("12:00", "17:00") },
      { day: 5, slots: generateSlots("12:00", "17:00") },
    ],
    privateDetails: {
      dob: "1978-03-10",
      gender: "Female",
      phone: "8149149501",
      email: "ndbauskar123@gmail.com",
    },
    login: {
      username: "nilima",
      password: "Nilima@2025",
    },
  },
  {
    id: "swati-bajirao-kakulte",
    slug: "swati-bajirao-kakulte",
    name: "Swati Bajirao Kakulte",
    headline: "ज्योतिष विशारद • समुपदेशन तज्ज्ञ",
    topicExpertise: "वैदिक ज्योतिष",
    experienceRange: "6–10 वर्षे",
    rating: 4.85,
    totalConsultations: 1800,
    avatar: "https://drjyotijoshi.com/wp-content/uploads/2025/11/2.jpg?auto=format&fit=crop&w=800&q=80&sat=-35",
    shortBio:
      "ज्योतिष प्रवीण, विशारद, भास्कर, अलंकार, विद्यावाचस्पती | अंकशास्त्र व वास्तु अभ्यासक",
    longBio:
      "मी सौ. स्वाती बाजीराव काकुळते , मी गेल्या दहा अकरा वर्षांपासून ज्योतिषशास्त्र शिकून जातकांना मार्गदर्शन करते. ... दुःखी व्यक्तीच्या चेहऱ्यावर परत हसू आणणे हेच ध्येय.",
    languages: ["मराठी", "हिंदी"],
    fee: 1100,
    sessionMinutes: 30,
    credentials: [
      "ज्योतिष प्रवीण",
      "ज्योतिष विशारद",
      "ज्योतिष भास्कर",
      "ज्योतिष विद्यावाचस्पती",
    ],
    // Swati Bajirao Kakulte –
    // Mon, Wed, Fri, Sat: 11:00–16:00
    // Sun, Thu: 08:00–22:00
    // Tue: 14:00–18:00
    availabilityTemplate: [
      // Sunday
      { day: 0, slots: generateSlots("08:00", "22:00") },
      // Monday
      { day: 1, slots: generateSlots("11:00", "16:00") },
      // Tuesday
      { day: 2, slots: generateSlots("14:00", "18:00") },
      // Wednesday
      { day: 3, slots: generateSlots("11:00", "16:00") },
      // Thursday
      { day: 4, slots: generateSlots("08:00", "22:00") },
      // Friday
      { day: 5, slots: generateSlots("11:00", "16:00") },
      // Saturday
      { day: 6, slots: generateSlots("11:00", "16:00") },
    ],
    privateDetails: {
      dob: "1980-04-23",
      gender: "Female",
      phone: "9028433437",
      email: "swatikakulte6@gmail.com",
    },
    login: {
      username: "swati",
      password: "Swati@2025",
    },
  },
  {
    id: "shakuntala-rajesh-dangat",
    slug: "shakuntala-rajesh-dangat",
    name: "Shakuntala Rajesh Dangat",
    headline: "कौटुंबिक मार्गदर्शक • गृहिणी ते प्रोफेशनल ज्योतिषी",
    topicExpertise: "वैदिक ज्योतिष",
    experienceRange: "3–5 वर्षे",
    rating: 4.6,
    totalConsultations: 1700,
    avatar: "https://drjyotijoshi.com/wp-content/uploads/2025/11/1.jpg?auto=format&fit=crop&w=800&q=80",
    shortBio:
      "घरगुती अनुभवासह वैदिक ज्योतिषावर ठाम श्रद्धा • साधे उपाय",
    longBio: "House wife ज्योतिष अभ्यासक | कुटुंब व्यवस्थापन आणि आध्यात्मिक संतुलनासाठी मार्गदर्शन.",
    languages: ["मराठी", "हिंदी"],
    fee: 1100,
    sessionMinutes: 30,
    credentials: ["Vedic Astrology Practitioner"],
    // Shakuntala Rajesh Dangat – everyday 14:00–17:00 and 21:00–23:00
    availabilityTemplate: [
      {
        day: 0,
        slots: [...generateSlots("14:00", "17:00"), ...generateSlots("21:00", "23:00")],
      },
      {
        day: 1,
        slots: [...generateSlots("14:00", "17:00"), ...generateSlots("21:00", "23:00")],
      },
      {
        day: 2,
        slots: [...generateSlots("14:00", "17:00"), ...generateSlots("21:00", "23:00")],
      },
      {
        day: 3,
        slots: [...generateSlots("14:00", "17:00"), ...generateSlots("21:00", "23:00")],
      },
      {
        day: 4,
        slots: [...generateSlots("14:00", "17:00"), ...generateSlots("21:00", "23:00")],
      },
      {
        day: 5,
        slots: [...generateSlots("14:00", "17:00"), ...generateSlots("21:00", "23:00")],
      },
      {
        day: 6,
        slots: [...generateSlots("14:00", "17:00"), ...generateSlots("21:00", "23:00")],
      },
    ],
    privateDetails: {
      dob: "1977-10-04",
      gender: "Female",
      phone: "9049055333",
      email: "astroshakuntala55@gmail.com",
    },
    login: {
      username: "shakuntala",
      password: "Shaku@2025",
    },
  },
];

export const ADMIN_USER = {
  username: "admin",
  password: "Admin@2025",
  name: "Portal Admin",
  role: "admin" as const,
};

export type SanitizedAstrologer = Pick<
  AstrologerProfile,
  | "id"
  | "slug"
  | "name"
  | "headline"
  | "topicExpertise"
  | "experienceRange"
  | "rating"
  | "totalConsultations"
  | "avatar"
  | "shortBio"
  | "languages"
  | "fee"
  | "sessionMinutes"
>;

export function listPublicAstrologers(): SanitizedAstrologer[] {
  return astrologers.map(
    ({
      id,
      slug,
      name,
      headline,
      topicExpertise,
      experienceRange,
      rating,
      totalConsultations,
      avatar,
      shortBio,
      languages,
      fee,
      sessionMinutes,
    }) => ({
      id,
      slug,
      name,
      headline,
      topicExpertise,
      experienceRange,
      rating,
      totalConsultations,
      avatar,
      shortBio,
      languages,
      fee,
      sessionMinutes,
    })
  );
}

export function findAstrologer(identifier: string) {
  return astrologers.find(
    (astro) => astro.id === identifier || astro.slug === identifier
  );
}

export function getPreviewSlots(
  astrologer: AstrologerProfile,
  limit = 4
): string[] {
  const slots: string[] = [];
  astrologer.availabilityTemplate.forEach((template) => {
    template.slots.forEach((slot) => {
      if (slots.length < limit) {
        slots.push(slot);
      }
    });
  });
  return slots;
}

export function authenticateUser(username: string, password: string) {
  if (
    ADMIN_USER.username.toLowerCase() === username.toLowerCase() &&
    ADMIN_USER.password === password
  ) {
    return {
      role: "admin" as const,
      name: ADMIN_USER.name,
      username: ADMIN_USER.username,
    };
  }

  const astro = astrologers.find(
    (a) =>
      a.login.username.toLowerCase() === username.toLowerCase() &&
      a.login.password === password
  );
  if (!astro) return null;
  return {
    role: "astrologer" as const,
    astrologerId: astro.id,
    name: astro.name,
    username: astro.login.username,
  };
}