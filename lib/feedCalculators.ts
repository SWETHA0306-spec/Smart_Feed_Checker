export interface SensorInputs {
  moisture810nm: number; // Range 0 - 100 (% NIR reflection intensity)
  protein940nm: number;  // Range 0 - 100 (% NIR reflection intensity)
  fiber1050nm: number;   // Range 0 - 100 (% NIR reflection intensity)
  nitrogenRatioIndex: number; // Range 10 - 100 (Urea adulteration indicator)
  silagePh: number;      // Range 3.0 - 6.0 (Silage pH level)
  feedType: 'corn_silage' | 'alfalfa_hay' | 'grass_hay' | 'mixed_ration';
}

export type SilageGradeType = 
  | 'Excellent'
  | 'Fair'
  | 'Spoiled / High Aerobic Risk'
  | 'Over-acidified / Clostridial Risk';

export interface AnalysisResults {
  crudeProtein: number;       // Percentage (%)
  moisture: number;           // Percentage (%)
  crudeFiber: number;         // Percentage (%)
  isUreaAdulterated: boolean; // Flag if urea > 65
  silageGrade: SilageGradeType;
  silagePhStatusColor: 'emerald' | 'amber' | 'rose';
  overallScore: number;       // 0 - 100
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

/**
 * Calculates Crude Protein, Moisture, Crude Fiber, Urea Adulteration,
 * Silage Quality Grade, composite score, and farmer advisories.
 */
export function calculateFeedQuality(inputs: SensorInputs): AnalysisResults {
  const { moisture810nm, protein940nm, fiber1050nm, nitrogenRatioIndex, silagePh, feedType } = inputs;

  // 1. Calculate Core Chemical Parameters via Spectral Calibration Formulas
  // Base Moisture calculation calibrated against 810nm water absorption band
  const rawMoisture = 8 + (moisture810nm * 0.72);
  const moisture = Math.round(Math.min(95, Math.max(5, rawMoisture)) * 10) / 10;

  // Crude Protein calibrated against 940nm N-H overtone band + Urea correction
  const baseProtein = 4 + (protein940nm * 0.24);
  const ureaOffset = nitrogenRatioIndex > 65 ? (nitrogenRatioIndex - 65) * 0.08 : 0;
  const crudeProtein = Math.round(Math.min(45, Math.max(2, baseProtein + ureaOffset)) * 10) / 10;

  // Crude Fiber calibrated against 1050nm C-H overtone band
  const rawFiber = 10 + (fiber1050nm * 0.42);
  const crudeFiber = Math.round(Math.min(60, Math.max(5, rawFiber)) * 10) / 10;

  // 2. Urea Adulteration Check
  const isUreaAdulterated = nitrogenRatioIndex > 65;

  // 3. Silage Quality Grading based on pH
  let silageGrade: SilageGradeType = 'Fair';
  let silagePhStatusColor: 'emerald' | 'amber' | 'rose' = 'amber';

  if (silagePh >= 3.8 && silagePh <= 4.2) {
    silageGrade = 'Excellent';
    silagePhStatusColor = 'emerald';
  } else if (silagePh >= 4.3 && silagePh <= 4.8) {
    silageGrade = 'Fair';
    silagePhStatusColor = 'amber';
  } else if (silagePh > 4.8) {
    silageGrade = 'Spoiled / High Aerobic Risk';
    silagePhStatusColor = 'rose';
  } else {
    // pH < 3.8
    silageGrade = 'Over-acidified / Clostridial Risk';
    silagePhStatusColor = 'rose';
  }

  // 4. Overall Score Calculation (0 - 100)
  let score = 85;

  // Protein evaluation
  if (crudeProtein >= 16) score += 5;
  else if (crudeProtein < 10) score -= 15;

  // pH penalties
  if (silageGrade === 'Excellent') score += 10;
  else if (silageGrade === 'Fair') score -= 5;
  else score -= 25; // Spoiled or over-acidified

  // Urea penalty
  if (isUreaAdulterated) {
    score -= 35;
  }

  // Moisture evaluation based on feed type
  if (feedType === 'corn_silage' || feedType === 'mixed_ration') {
    if (moisture >= 60 && moisture <= 68) score += 5;
    else if (moisture > 72 || moisture < 50) score -= 15;
  } else if (feedType === 'alfalfa_hay' || feedType === 'grass_hay') {
    if (moisture <= 16) score += 5;
    else if (moisture > 20) score -= 20; // Mold hazard
  }

  const overallScore = Math.max(0, Math.min(100, Math.round(score)));

  // Quality Rating Letter Grade
  let qualityRating: 'A+' | 'A' | 'B' | 'C' | 'D' = 'B';
  if (overallScore >= 90) qualityRating = 'A+';
  else if (overallScore >= 80) qualityRating = 'A';
  else if (overallScore >= 65) qualityRating = 'B';
  else if (overallScore >= 50) qualityRating = 'C';
  else qualityRating = 'D';

  // 5. Dynamic Farmer Advisories Generation
  const advisories: AnalysisResults['advisories'] = [];

  // Urea Advisory
  if (isUreaAdulterated) {
    advisories.push({
      category: 'CRITICAL',
      title: 'CRITICAL: Synthetic Urea Adulteration Detected!',
      description: `Nitrogen Index measured at ${nitrogenRatioIndex} (Threshold: 65). Elevated non-protein nitrogen (NPN) poses high ammonia toxicity risk to ruminants. Do not feed to young calves or pregnant cows without professional nutrition balancing.`
    });
  }

  // Silage pH Advisory
  if (silagePh > 4.8) {
    advisories.push({
      category: 'WARNING',
      title: 'High Silage pH - Spoiled / Aerobic Risk',
      description: `pH level of ${silagePh} indicates incomplete anaerobic fermentation. High vulnerability to yeast, mold, and mycotoxins. Ensure tight pit compression and treat feed face with organic propionic acid.`
    });
  } else if (silagePh < 3.8) {
    advisories.push({
      category: 'WARNING',
      title: 'Over-Acidified Silage (pH < 3.8)',
      description: `Excessive acidic content may cause sub-acute ruminal acidosis (SARA) and decrease dry matter intake (DMI). Mix with clean dry hay to buffer dietary pH.`
    });
  } else if (silagePh >= 3.8 && silagePh <= 4.2) {
    advisories.push({
      category: 'OPTIMAL',
      title: 'Optimal Lactic Acid Fermentation',
      description: `Silage pH ${silagePh} is in the golden zone (3.8 - 4.2). Excellent stability, high palatability, and maximum nutrient retention.`
    });
  }

  // Moisture Advisory
  if (feedType.includes('hay') && moisture > 18) {
    advisories.push({
      category: 'WARNING',
      title: 'High Moisture Hay - Mold Hazard',
      description: `Hay moisture at ${moisture}% exceeds safe dry storage threshold (16%). High risk of heating, spontaneous combustion, and internal mold spore buildup.`
    });
  } else if ((feedType === 'corn_silage' || feedType === 'mixed_ration') && moisture < 55) {
    advisories.push({
      category: 'RECOMMENDATION',
      title: 'Low Moisture Silage',
      description: `Moisture at ${moisture}% is drier than ideal silage target (60-65%). May hinder oxygen exclusion during packing.`
    });
  }

  // Protein Advisory
  if (crudeProtein >= 16) {
    advisories.push({
      category: 'OPTIMAL',
      title: 'High Crude Protein Yield',
      description: `Crude Protein content of ${crudeProtein}% provides robust amino acid profile suitable for high-yielding lactating cows (25+ L/day).`
    });
  } else if (crudeProtein < 12) {
    advisories.push({
      category: 'RECOMMENDATION',
      title: 'Protein Supplementation Advised',
      description: `Crude Protein is low at ${crudeProtein}%. Consider fortifying total mixed ration (TMR) with soybean meal, mustard cake, or leguminous forage.`
    });
  }

  // Calf Safety Advisory
  if (isUreaAdulterated || silagePh > 4.8) {
    advisories.push({
      category: 'CRITICAL',
      title: 'Calf & Pre-Weaned Heifer Safety Alert',
      description: 'DO NOT FEED THIS BATCH TO PRE-WEANED CALVES. Undeveloped rumen microbial flora cannot safely metabolize adulterated NPN or moldy silage.'
    });
  } else {
    advisories.push({
      category: 'RECOMMENDATION',
      title: 'Calf & Replacement Heifer Safe',
      description: 'Tested sample parameters fall within safe biological limits for growing calves and dry heifers.'
    });
  }

  return {
    crudeProtein,
    moisture,
    crudeFiber,
    isUreaAdulterated,
    silageGrade,
    silagePhStatusColor,
    overallScore,
    qualityRating,
    advisories
  };
}

/**
 * Pre-defined test sample scenarios for instant demonstration
 */
export const PRESET_SCENARIOS: { name: string; description: string; inputs: SensorInputs }[] = [
  {
    name: 'Optimal Corn Silage',
    description: 'High quality silage with ideal pH 4.0 and balanced nutrients',
    inputs: {
      moisture810nm: 72,
      protein940nm: 45,
      fiber1050nm: 40,
      nitrogenRatioIndex: 32,
      silagePh: 4.0,
      feedType: 'corn_silage'
    }
  },
  {
    name: 'Adulterated High-Urea Feed',
    description: 'Elevated Nitrogen ratio simulating artificial urea chemical padding',
    inputs: {
      moisture810nm: 45,
      protein940nm: 78,
      fiber1050nm: 35,
      nitrogenRatioIndex: 82, // Triggers urea alert > 65
      silagePh: 4.5,
      feedType: 'mixed_ration'
    }
  },
  {
    name: 'Spoiled / Aerobic Silage',
    description: 'Unstable high pH silage exposed to moisture and air ingress',
    inputs: {
      moisture810nm: 85,
      protein940nm: 25,
      fiber1050nm: 65,
      nitrogenRatioIndex: 40,
      silagePh: 5.3, // Triggers spoiled silage alert
      feedType: 'corn_silage'
    }
  },
  {
    name: 'Premium Alfalfa Hay',
    description: 'High-protein leguminous forage with low moisture for long storage',
    inputs: {
      moisture810nm: 8,
      protein940nm: 62,
      fiber1050nm: 32,
      nitrogenRatioIndex: 25,
      silagePh: 6.0,
      feedType: 'alfalfa_hay'
    }
  }
];

export const MOCK_HISTORY: TestRecord[] = [
  {
    id: 'SMP-2026-0914',
    timestamp: '2026-09-14 14:30',
    feedType: 'corn_silage',
    inputs: PRESET_SCENARIOS[0].inputs,
    results: calculateFeedQuality(PRESET_SCENARIOS[0].inputs),
    certificateHash: '0x8f3a...91bc'
  },
  {
    id: 'SMP-2026-0912',
    timestamp: '2026-09-12 09:15',
    feedType: 'mixed_ration',
    inputs: PRESET_SCENARIOS[1].inputs,
    results: calculateFeedQuality(PRESET_SCENARIOS[1].inputs),
    certificateHash: '0x7e1b...42ad'
  },
  {
    id: 'SMP-2026-0910',
    timestamp: '2026-09-10 16:45',
    feedType: 'alfalfa_hay',
    inputs: PRESET_SCENARIOS[3].inputs,
    results: calculateFeedQuality(PRESET_SCENARIOS[3].inputs),
    certificateHash: '0x3c9f...88e1'
  }
];
