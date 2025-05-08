export interface College {
  id: string;
  name: string;
  location: string;
  country: 'India' | 'USA' | 'Canada' | 'UK' | 'Australia' | 'Germany' | 'Other';
  description: string;
  imageUrl?: string;
  acceptanceRate?: number; // Percentage
  tuitionFees?: {
    amount: number;
    currency: string;
    period: 'annual' | 'semester' | 'total';
  };
  financialAidAvailable?: boolean;
  popularPrograms?: string[];
  ranking?: string; // e.g., "Top 10 in Engineering"
  campusLife?: string;
  website?: string;
  admissionDeadline?: string; 
  requiredExams?: ('GRE' | 'GMAT' | 'TOEFL' | 'IELTS' | 'SAT' | 'ACT')[];
}

export interface StudentAcademicScores {
  cgpa?: number; // e.g., out of 4.0 or 10.0
  cgpaScale?: number; // 4 or 10
  percentage?: number; // e.g., out of 100
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
  toefl?: number; // Total score
  ielts?: number; // Overall band score
  sat?: number; // Total score
  act?: number; // Composite score
}

export interface StudentPreferences {
  preferredCountries: ('India' | 'USA' | 'Canada' | 'UK' | 'Australia' | 'Germany' | 'Other')[];
  financialStatus: 'Low' | 'Medium' | 'High' | 'Scholarship-dependent';
  preferredMajors: string[];
  collegeType?: ('Public' | 'Private' | 'Research' | 'Liberal Arts')[];
}

export interface StudentProfile {
  id: string;
  fullName: string;
  email: string;
  educationLevel: '10th' | '12th' | 'Graduation' | 'Post-graduation';
  academicScores: StudentAcademicScores;
  examResults?: StudentExamResults;
  preferences: StudentPreferences;
  workExperienceYears?: number;
  extracurriculars?: string;
  statementOfPurpose?: string;
}

// For AI Recommendation
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
    country: string; // For simplicity in AI, maybe take first from StudentPreferences
    financialStatus: string;
    major: string; // For simplicity, take first major
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
