export type FeedCategory = 
  | 'pellet' 
  | 'silage' 
  | 'mineral_mixture' 
  | 'feed_mash' 
  | 'alfalfa_hay' 
  | 'mixed_ration';

export interface SensorInputs {
  moisture810nm: number;      // 0 - 100%
  protein940nm: number;       // 0 - 100%
  fiber1050nm: number;        // 0 - 100%
  nitrogenRatioIndex: number; // 10 - 100 (Urea indicator)
  silagePh: number;           // 3.0 - 6.0
  aflatoxinPpb: number;       // 0 - 50 ppb (Mycotoxin level)
  sandSilicaRatio: number;    // 0 - 30% (Sand contamination)
  saltRatio: number;          // 0 - 20% (Salt level)
  mouldPresence: boolean;     // Computer Vision / fungal indicator
  feedType: FeedCategory;
}

export type QualityStatusType = 'Good' | 'Moderate' | 'Poor' | 'Unsafe';

export interface AnalysisResults {
  crudeProtein: number | 'NA';
  moisture: number;
  crudeFiber: number | 'NA';
  energyTdn: number | 'NA';       // Total Digestible Nutrients (%)
  energyNel: number | 'NA';       // Net Energy for Lactation (Mcal/kg)
  aflatoxinPpb: number;
  adulterationDetected: string[]; // List of detected adulterations
  isUreaAdulterated: boolean;
  isSandContaminated: boolean;
  isExcessSalt: boolean;
  isMouldPresent: boolean;
  isAflatoxinUnsafe: boolean;
  silageGrade: string;
  silagePhStatusColor: 'emerald' | 'amber' | 'rose';
  overallScore: number;
  qualityStatus: QualityStatusType;
  qualityRating: 'A+' | 'A' | 'B' | 'C' | 'D';
  advisories: {
    category: 'CRITICAL' | 'WARNING' | 'OPTIMAL' | 'RECOMMENDATION';
    title: string;
    description: string;
  }[];
}

export interface TestRecord {
  id: string;
  timestamp: string;
  feedType: string;
  inputs: SensorInputs;
  results: AnalysisResults;
  certificateHash: string;
}

export type LanguageCode = 'en' | 'hi' | 'pa' | 'gu' | 'mr' | 'ta';

export const LANGUAGES: { code: LanguageCode; name: string; native: string }[] = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
];

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    title: 'SmartFeed AI',
    subtitle: 'Rapid Feed & Silage Quality Testing System | PS ID 26111',
    runAudit: 'Execute Real-Time AI Quality Audit',
    qualityStatus: 'Overall Quality Status',
    adulteration: 'Adulteration & Contamination',
    protein: 'Crude Protein',
    moisture: 'Moisture Content',
    fiber: 'Crude Fiber',
    energy: 'Energy Value (TDN)',
    aflatoxin: 'Aflatoxin (ppb)',
    pH: 'Silage pH',
    certify: 'Certify & Issue Digital QR Certificate',
    presets: 'Official Problem Statement Data Samples',
    cvScan: 'Computer Vision Optical Texture Scanner',
  },
  hi: {
    title: 'स्मार्टफीड एआई',
    subtitle: 'पशु आहार एवं साइलेज गुणवत्ता परीक्षण प्रणाली | समस्या आईडी 26111',
    runAudit: 'वास्तविक समय एआई गुणवत्ता जांच करें',
    qualityStatus: 'समग्र गुणवत्ता स्थिति',
    adulteration: 'मिलावट और संदूषण',
    protein: 'कच्चा प्रोटीन (Crude Protein)',
    moisture: 'नमी की मात्रा (Moisture)',
    fiber: 'फाइबर (Fiber)',
    energy: 'ऊर्जा मूल्य (TDN)',
    aflatoxin: 'एफलाटॉक्सिन / फंगस (ppb)',
    pH: 'साइलेज पीएच',
    certify: 'प्रमाणित करें और डिजिटल क्यूआर प्रमाणपत्र जारी करें',
    presets: 'आधिकारिक नमूना डेटासेट (F001-F005)',
    cvScan: 'कंप्यूटर विजन ऑप्टिकल टेक्सचर स्कैनर',
  },
  pa: {
    title: 'ਸਮਾਰਟਫੀਡ ਏਆਈ',
    subtitle: 'ਪਸ਼ੂ ਖੁਰਾਕ ਅਤੇ ਸਾਈਲੇਜ ਗੁਣਵੱਤਾ ਟੈਸਟਿੰਗ ਸਿਸਟਮ',
    runAudit: 'ਰੀਅਲ-ਟਾਈਮ ਏਆਈ ਗੁਣਵੱਤਾ ਦੀ ਜਾਂਚ ਕਰੋ',
    qualityStatus: 'ਕੁੱਲ ਗੁਣਵੱਤਾ ਦੀ ਸਥਿਤੀ',
    adulteration: 'ਮਿਲਾਵਟ ਅਤੇ ਦੂਸ਼ਿਤਤਾ',
    protein: 'ਪ੍ਰੋਟੀਨ (Crude Protein)',
    moisture: 'ਨਮੀ (Moisture)',
    fiber: 'ਫਾਈਬਰ (Fiber)',
    energy: 'ਊਰਜਾ ਮੁੱਲ (TDN)',
    aflatoxin: 'ਐਫਲਾਟੌਕਸਿਨ (ppb)',
    pH: 'ਸਾਈਲੇਜ pH',
    certify: 'ਡਿਜੀਟਲ QR ਸਰਟੀਫਿਕੇਟ ਜਾਰੀ ਕਰੋ',
    presets: 'ਅਧਿਕਾਰਤ ਨਮੂਨਾ ਡਾਟਾਸੈਟ',
    cvScan: 'ਕੰਪਿਊਟਰ ਵਿਜ਼ਨ ਸਕੈਨਰ',
  },
  gu: {
    title: 'સ્માર્ટફીડ એઆઈ',
    subtitle: 'પશુ આહાર અને સાયલેજ ગુણવત્તા પરીક્ષણ સિસ્ટમ',
    runAudit: 'રીઅલ-ટાઇમ AI ગુણવત્તા તપાસ કરો',
    qualityStatus: 'સમગ્ર ગુણવત્તા સ્થિતિ',
    adulteration: 'ભેળસેળ અને દૂષણ',
    protein: 'પ્રોટીન (Protein)',
    moisture: 'ભેજનું પ્રમાણ (Moisture)',
    fiber: 'ફાઇબર (Fiber)',
    energy: 'ઊર્જા મૂલ્ય (TDN)',
    aflatoxin: 'એફલાટોક્સિન (ppb)',
    pH: 'સાયલેજ pH',
    certify: 'ડિજિટલ QR પ્રમાણપત્ર આપો',
    presets: 'સત્તાવાર નમૂના ડેટા સેટ',
    cvScan: 'કમ્પ્યુટર વિઝન સ્કેનર',
  },
  mr: {
    title: 'स्मार्टफीड एआय',
    subtitle: 'पशुआहार व सायलेज गुणवत्ता तपासणी प्रणाली',
    runAudit: 'रिअल-टाइम AI गुणवत्ता तपासणी करा',
    qualityStatus: 'एकूण गुणवत्ता स्थिती',
    adulteration: 'भेसळ आणि दूषित घटक',
    protein: 'क्रूड प्रोटीन (Protein)',
    moisture: 'ओलसरपणा (Moisture)',
    fiber: 'फायबर (Fiber)',
    energy: 'ऊर्जा मूल्य (TDN)',
    aflatoxin: 'अॅफलाटॉक्सिन (ppb)',
    pH: 'सायलेज पीएच',
    certify: 'डिजिटल क्यूआर प्रमाणपत्र जारी करा',
    presets: 'अधिकृत नमुना डेटा संच',
    cvScan: 'संगणक दृष्टी टेक्सचर स्कॅनर',
  },
  ta: {
    title: 'ஸ்மார்ட்ஃபீட் AI',
    subtitle: 'கால்நடை தீவனம் மற்றும் சைலேஜ் தர சோதனை முறைமை',
    runAudit: 'AI தர சோதனையை இயக்கவும்',
    qualityStatus: 'ஒட்டுமொத்த தர நிலை',
    adulteration: 'கலப்படம் மற்றும் மாசுபாடு',
    protein: 'புரதம் (Protein)',
    moisture: 'ஈரப்பதம் (Moisture)',
    fiber: 'நார்ச்சத்து (Fiber)',
    energy: 'ஆற்றல் மதிப்பு (TDN)',
    aflatoxin: 'அஃப்லாடாக்சின் (ppb)',
    pH: 'சைலேஜ் pH',
    certify: 'டிஜிட்டல் QR சான்றிதழ் வழங்கவும்',
    presets: 'அதிகாரப்பூர்வ மாதிரி தரவுத் தொகுப்பு',
    cvScan: 'கம்ப்யூட்டர் விஷன் ஸ்கேனர்',
  },
};

export function calculateFeedQuality(inputs: SensorInputs): AnalysisResults {
  const {
    moisture810nm,
    protein940nm,
    fiber1050nm,
    nitrogenRatioIndex,
    silagePh,
    aflatoxinPpb,
    sandSilicaRatio,
    saltRatio,
    mouldPresence,
    feedType,
  } = inputs;

  const isMineral = feedType === 'mineral_mixture';

  // 1. Calculate Core Parameters
  const moisture = Math.round(Math.min(95, Math.max(2, 6 + (moisture810nm * 0.76))) * 10) / 10;
  
  const crudeProtein = isMineral 
    ? 'NA' 
    : Math.round(Math.min(45, Math.max(3, (protein940nm * 0.28) + (nitrogenRatioIndex > 65 ? (nitrogenRatioIndex - 65) * 0.08 : 0))) * 10) / 10;

  const crudeFiber = isMineral 
    ? 'NA' 
    : Math.round(Math.min(55, Math.max(4, 10 + (fiber1050nm * 0.42))) * 10) / 10;

  // Energy Value TDN & NEL
  let energyTdn: number | 'NA' = 'NA';
  let energyNel: number | 'NA' = 'NA';

  if (typeof crudeFiber === 'number') {
    const rawTdn = 88.9 - (0.779 * crudeFiber);
    energyTdn = Math.round(Math.min(85, Math.max(40, rawTdn)) * 10) / 10;
    energyNel = Math.round(Math.min(2.2, Math.max(0.8, (energyTdn * 0.0245) - 0.12)) * 100) / 100;
  }

  // 2. Adulteration & Contamination Checks
  const adulterationDetected: string[] = [];
  const isUreaAdulterated = nitrogenRatioIndex > 65;
  const isSandContaminated = sandSilicaRatio > 8;
  const isExcessSalt = saltRatio > 5;
  const isMouldPresent = mouldPresence || aflatoxinPpb >= 10;
  const isAflatoxinUnsafe = aflatoxinPpb >= 18;

  if (isUreaAdulterated) adulterationDetected.push('Urea Adulteration');
  if (isSandContaminated) adulterationDetected.push('Sand/Silica Contamination');
  if (isExcessSalt) adulterationDetected.push('Excess Salt');
  if (isMouldPresent) adulterationDetected.push('Mould / Fungal Presence');
  if (isAflatoxinUnsafe) adulterationDetected.push('Aflatoxin Mycotoxins (>18 ppb)');
  if (silagePh > 4.8 && feedType === 'silage') adulterationDetected.push('Spoilage Detected');

  if (adulterationDetected.length === 0) {
    adulterationDetected.push('None');
  }

  // 3. Silage pH Classification
  let silageGrade = 'Optimal Fermentation';
  let silagePhStatusColor: 'emerald' | 'amber' | 'rose' = 'emerald';

  if (feedType === 'silage') {
    if (silagePh >= 3.8 && silagePh <= 4.2) {
      silageGrade = 'Excellent (Optimal Lactic Acid)';
      silagePhStatusColor = 'emerald';
    } else if (silagePh >= 4.3 && silagePh <= 4.8) {
      silageGrade = 'Fair (Moderate Quality)';
      silagePhStatusColor = 'amber';
    } else if (silagePh > 4.8) {
      silageGrade = 'Spoiled / High Aerobic Risk';
      silagePhStatusColor = 'rose';
    } else {
      silageGrade = 'Over-acidified (<3.8)';
      silagePhStatusColor = 'rose';
    }
  } else {
    silageGrade = 'N/A (Dry Feed)';
  }

  // 4. Quality Status Determination (Good / Moderate / Poor / Unsafe)
  let qualityStatus: QualityStatusType = 'Good';
  let score = 90;

  if (isAflatoxinUnsafe || isSandContaminated || (isUreaAdulterated && typeof crudeProtein === 'number' && crudeProtein > 30)) {
    qualityStatus = 'Unsafe';
    score = 30;
  } else if (isUreaAdulterated || isExcessSalt || (feedType === 'silage' && silagePh > 4.8)) {
    qualityStatus = 'Poor';
    score = 48;
  } else if (isMouldPresent || (feedType === 'silage' && silagePh > 4.2)) {
    qualityStatus = 'Moderate';
    score = 68;
  } else {
    qualityStatus = 'Good';
    score = 92;
  }

  const overallScore = Math.max(0, Math.min(100, score));

  let qualityRating: 'A+' | 'A' | 'B' | 'C' | 'D' = 'B';
  if (overallScore >= 90) qualityRating = 'A+';
  else if (overallScore >= 80) qualityRating = 'A';
  else if (overallScore >= 65) qualityRating = 'B';
  else if (overallScore >= 50) qualityRating = 'C';
  else qualityRating = 'D';

  // 5. Dynamic Farmer Advisories
  const advisories: AnalysisResults['advisories'] = [];

  if (isAflatoxinUnsafe) {
    advisories.push({
      category: 'CRITICAL',
      title: 'AFLATOXIN MYCOTOXIN HAZARD (>18 ppb)',
      description: `Aflatoxin level measured at ${aflatoxinPpb} ppb exceeds legal safety limits for lactating dairy cattle. High risk of milk toxin excretion (Aflatoxin M1) and liver toxicity.`
    });
  }

  if (isSandContaminated) {
    advisories.push({
      category: 'WARNING',
      title: 'SAND & SILICA CONTAMINATION DETECTED',
      description: `Sand/Silica ratio at ${sandSilicaRatio}% poses high risk of abomasal impaction and dental wear in cattle. Screen and winnow feed before serving.`
    });
  }

  if (isExcessSalt) {
    advisories.push({
      category: 'WARNING',
      title: 'EXCESS SALT ADULTERATION',
      description: `Salt concentration at ${saltRatio}% is excessively high. May cause electrolyte imbalance, water intoxication, and reduced feed intake.`
    });
  }

  if (isUreaAdulterated) {
    advisories.push({
      category: 'CRITICAL',
      title: 'SYNTHETIC UREA ADULTERATION',
      description: `Nitrogen ratio ${nitrogenRatioIndex} indicates artificial non-protein nitrogen. Do not feed to young pre-weaned calves.`
    });
  }

  if (feedType === 'silage' && silagePh > 4.8) {
    advisories.push({
      category: 'WARNING',
      title: 'SILAGE SPOILAGE DETECTED (pH > 4.8)',
      description: `Incomplete anaerobic fermentation. Treat face with organic propionic acid and increase compaction.`
    });
  }

  if (qualityStatus === 'Good') {
    advisories.push({
      category: 'OPTIMAL',
      title: 'EXCELLENT NUTRITIONAL BALANCE',
      description: `All nutritional and safety parameters are well within optimal physiological limits for high-yield dairy cattle.`
    });
  }

  return {
    crudeProtein,
    moisture,
    crudeFiber,
    energyTdn,
    energyNel,
    aflatoxinPpb,
    adulterationDetected,
    isUreaAdulterated,
    isSandContaminated,
    isExcessSalt,
    isMouldPresent,
    isAflatoxinUnsafe,
    silageGrade,
    silagePhStatusColor,
    overallScore,
    qualityStatus,
    qualityRating,
    advisories,
  };
}

/**
 * Official Problem Statement 3 Dummy Dataset Presets (F001 - F005)
 */
export const OFFICIAL_DATASET_PRESETS: {
  id: string;
  name: string;
  feedTypeLabel: string;
  inputs: SensorInputs;
  expectedStatus: QualityStatusType;
}[] = [
  {
    id: 'F001',
    name: 'F001 - Cattle Feed Pellet',
    feedTypeLabel: 'Cattle Feed Pellet',
    expectedStatus: 'Good',
    inputs: {
      moisture810nm: 6,
      protein940nm: 60,
      fiber1050nm: 10,
      nitrogenRatioIndex: 25,
      silagePh: 6.0,
      aflatoxinPpb: 5,
      sandSilicaRatio: 2,
      saltRatio: 1,
      mouldPresence: false,
      feedType: 'pellet',
    },
  },
  {
    id: 'F002',
    name: 'F002 - Silage (Mould Presence)',
    feedTypeLabel: 'Silage',
    expectedStatus: 'Moderate',
    inputs: {
      moisture810nm: 78,
      protein940nm: 18,
      fiber1050nm: 34,
      nitrogenRatioIndex: 30,
      silagePh: 4.1,
      aflatoxinPpb: 12,
      sandSilicaRatio: 3,
      saltRatio: 1,
      mouldPresence: true,
      feedType: 'silage',
    },
  },
  {
    id: 'F003',
    name: 'F003 - Mineral Mixture (Excess Salt)',
    feedTypeLabel: 'Mineral Mixture',
    expectedStatus: 'Poor',
    inputs: {
      moisture810nm: 0,
      protein940nm: 0,
      fiber1050nm: 0,
      nitrogenRatioIndex: 20,
      silagePh: 6.0,
      aflatoxinPpb: 0,
      sandSilicaRatio: 4,
      saltRatio: 12, // Excess Salt
      mouldPresence: false,
      feedType: 'mineral_mixture',
    },
  },
  {
    id: 'F004',
    name: 'F004 - Feed Mash (Sand Contamination)',
    feedTypeLabel: 'Feed Mash',
    expectedStatus: 'Unsafe',
    inputs: {
      moisture810nm: 8,
      protein940nm: 50,
      fiber1050nm: 14,
      nitrogenRatioIndex: 35,
      silagePh: 6.0,
      aflatoxinPpb: 20, // High Aflatoxin
      sandSilicaRatio: 16, // High Sand
      saltRatio: 2,
      mouldPresence: true,
      feedType: 'feed_mash',
    },
  },
  {
    id: 'F005',
    name: 'F005 - Silage (Spoilage Detected)',
    feedTypeLabel: 'Silage',
    expectedStatus: 'Poor',
    inputs: {
      moisture810nm: 84,
      protein940nm: 15,
      fiber1050nm: 42,
      nitrogenRatioIndex: 40,
      silagePh: 5.8, // High pH Spoilage
      aflatoxinPpb: 8,
      sandSilicaRatio: 3,
      saltRatio: 1,
      mouldPresence: true,
      feedType: 'silage',
    },
  },
];

export const MOCK_HISTORY: TestRecord[] = OFFICIAL_DATASET_PRESETS.map((preset) => ({
  id: preset.id,
  timestamp: '2026-09-15 12:00',
  feedType: preset.feedTypeLabel,
  inputs: preset.inputs,
  results: calculateFeedQuality(preset.inputs),
  certificateHash: '0x' + Math.floor(Math.random() * 100000000).toString(16),
}));
