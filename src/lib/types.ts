

export interface College {
  id: string;
  name: string;
  location: string; // This will be mapped from stateprovince
  country: string; 
  description?: string; // Was present, but not in schema image; keep as optional for now if used elsewhere
  imageUrl?: string; // This will be mapped from university-logo
  acceptanceRate?: number; // Not in schema image
  tuitionFees?: { // Not in schema image
    amount: number;
    currency: string;
    period: string; 
  };
  financialAidAvailable?: boolean; // Mapped from scholarships
  popularPrograms?: string[]; // Mapped from subjects
  ranking?: string;  // Potentially worldranking or ranking_description, clarify usage
  campusLife?: string; // Not in schema image
  website?: string; // Mapped from webpages[0]
  admissionDeadline?: string; // Not in schema image
  requiredExams?: string[]; // Not in schema image
  _aiIsGoodFit?: boolean; // Internal helper for AI recommendation display
  _aiDescription?: string; // Internal helper for AI recommendation display
}

export interface StudentAcademicScores {
  cgpa?: number; 
  cgpaScale?: number;
  percentage?: number;
}

export interface StudentExamResults {
  gre?: {
    verbal?: number;
    quant?: number;
    awa?: number;
    total?: number;
  };
  gmat?: {
    verbal?: number;
    quant?: number;
    awa?: number;
    ir?: number;
    total?: number;
  };
  toefl?: number;
  ielts?: number;
  sat?: number;
  act?: number;
}

export interface StudentPreferences {
  preferredCountries: string[]; 
  financialStatus: string; 
  preferredMajors: string[];
  collegeType?: string[]; 
}

export interface StudentProfile {
  id: string;
  fullName: string;
  email: string;
  educationLevel: string; 
  academicScores: StudentAcademicScores;
  examResults?: StudentExamResults;
  preferences: StudentPreferences;
  workExperienceYears?: number;
  extracurriculars?: string;
  statementOfPurpose?: string;
}

export interface AIRecommendationInput {
  academicScores: {
    cgpa?: number;
    percentage?: number;
  };
  examResults: {
    gre?: number;
    gmat?: number;
    toefl?: number;
  };
  preferences: {
    country: string; 
    financialStatus: string;
    major: string;
  };
  additionalInfo?: string;
}

export interface AIRecommendedCollege {
  collegeName: string;
  location: string;
  majorOffered: string;
  acceptanceRate: number;
  description: string;
  isGoodFit: boolean;
}

// Matches the Supabase schema image and the API transformation
export interface UniversityAPIResponse {
  id: string;
  name: string;
  country: string;
  location?: string; // Mapped from 'stateprovince'
  studylevels?: string[] | null; // from 'studylevels'
  subjects?: string[] | null; // from 'subjects'
  mincgpa?: number | null; // from 'mincgpa'
  scholarships?: boolean | null; // from 'scholarships'
  worldranking?: number | null; // from 'worldranking'
  webpages?: string[] | null; // from 'webpages' (is _text, so array of strings)
  imageUrl?: string | null; // from 'university-logo'
  
  // These fields are NOT in the provided schema image for the University table
  // They are kept here as optional if other parts of the UI expect them, but data won't come from the current API query
  description?: string | null; 
  acceptanceRate?: number | null;
  tuitionFees?: {
    amount: number;
    currency: string;
    period: 'annual' | 'semester' | 'total' | string;
  } | null;
  admissionDeadline?: string | null;
  ranking_description?: string | null; 
  financialAidAvailable?: boolean | null; // This is essentially 'scholarships'
  popularPrograms?: string[] | null; // This is essentially 'subjects'
  campusLife?: string | null;
  requiredExams?: string[] | null;
}

