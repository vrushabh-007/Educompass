
export interface College {
  id: string;
  name: string;
  location: string;
  country: string; 
  description: string;
  imageUrl?: string;
  acceptanceRate?: number; 
  tuitionFees?: {
    amount: number;
    currency: string;
    period: string; 
  };
  financialAidAvailable?: boolean;
  popularPrograms?: string[];
  ranking?: string; 
  campusLife?: string;
  website?: string;
  admissionDeadline?: string; 
  requiredExams?: string[]; 
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

export interface UniversityAPIResponse {
  id: string;
  name: string;
  country: string;
  location?: string;
  studylevels?: string[];
  subjects?: string[];
  mincgpa?: number | null;
  scholarships?: boolean;
  worldranking?: number | null; 
  webpages?: string[];
  imageUrl?: string;
  description?: string;
  acceptanceRate?: number | null;
  tuitionFees?: {
    amount: number;
    currency: string;
    period: 'annual' | 'semester' | 'total' | string;
  };
  admissionDeadline?: string | null;
  ranking_description?: string | null; 
  financialAidAvailable?: boolean | null;
  popularPrograms?: string[] | null;
  campusLife?: string | null;
  requiredExams?: string[] | null;
}
