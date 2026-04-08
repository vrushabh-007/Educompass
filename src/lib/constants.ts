
export const EDUCATION_LEVELS = [
  { value: "bachelors", label: "Bachelors" },
  { value: "masters", label: "Masters" },
  { value: "phd", label: "PhD" },
  // { value: "other", label: "Other Levels" } // Can be added if 'other' is a valid filter
];

const countryNames = ['USA', 'United Kingdom', 'Switzerland', 'India', 'Canada', 'Singapore', 'Germany', 'Australia', 'Other'];
export const COUNTRIES = countryNames.map(country => ({
  value: country,
  // Provide more user-friendly labels if desired, e.g., 'United States' for 'USA'
  label: country === 'USA' ? 'United States' : country === 'UK' ? 'United Kingdom' : country 
}));


export const FINANCIAL_STATUS_OPTIONS = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
  { value: "Scholarship-dependent", label: "Scholarship-dependent" },
];

export const EXAM_OPTIONS = ['GRE', 'GMAT', 'TOEFL', 'IELTS', 'SAT', 'ACT'];

export const MAJORS_SAMPLE = [
  'Engineering', 'Computer Science', 'Business', 'Biology', 'Law', 'Medicine', 'Social Sciences',
  'Mathematics', 'Arts', 'Humanities', 'Sciences', 'Physics', 'Chemistry', 'Natural Sciences',
  'Architecture', 'Economics', 'Mechanical Engineering', 'Electrical Engineering', 'Business Analytics', 'Life Sciences',
];
