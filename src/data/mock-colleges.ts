import type { College } from '@/lib/types';

export const mockColleges: College[] = [
  {
    id: '1',
    name: 'Massachusetts Institute of Technology', // Ensure name matches logoMap key
    location: 'Cambridge, MA, USA',
    country: 'USA',
    description: 'A world-renowned private research university known for its programs in science, engineering, and technology.',
    imageUrl: 'https://picsum.photos/seed/mit/600/400',
    acceptanceRate: 7,
    tuitionFees: { amount: 55000, currency: 'USD', period: 'annual' },
    financialAidAvailable: true,
    popularPrograms: ['Computer Science', 'Mechanical Engineering', 'Physics'],
    ranking: 'Global #1',
    website: 'https://web.mit.edu/',
    admissionDeadline: 'January 1',
    requiredExams: ['SAT', 'ACT', 'TOEFL', 'IELTS'],
    alumni: [
      { name: 'Richard Feynman', headline: 'Theoretical Physicist', linkedinUrl: '#', avatarUrl: 'https://picsum.photos/seed/feynman/40/40', institution: 'MIT' },
      { name: 'Buzz Aldrin', headline: 'Astronaut', linkedinUrl: '#', avatarUrl: 'https://picsum.photos/seed/aldrin/40/40', institution: 'MIT' },
      { name: 'Kofi Annan', headline: 'Former UN Secretary-General', linkedinUrl: '#', avatarUrl: 'https://picsum.photos/seed/annan/40/40', institution: 'MIT' },
    ]
  },
  {
    id: '2',
    name: 'Stanford University', // Ensure name matches logoMap key
    location: 'Stanford, CA, USA',
    country: 'USA',
    description: 'A leading private research university in Silicon Valley, excelling in innovation and entrepreneurship.',
    imageUrl: 'https://picsum.photos/seed/stanford/600/400',
    acceptanceRate: 5,
    tuitionFees: { amount: 58000, currency: 'USD', period: 'annual' },
    financialAidAvailable: true,
    popularPrograms: ['Computer Science', 'Business', 'Engineering'],
    ranking: 'Global #2',
    website: 'https://www.stanford.edu/',
    admissionDeadline: 'January 5',
    requiredExams: ['SAT', 'ACT', 'TOEFL', 'IELTS'],
    alumni: [
        { name: 'Larry Page', headline: 'Co-founder of Google', linkedinUrl: '#', avatarUrl: 'https://picsum.photos/seed/page/40/40', institution: 'Stanford' },
        { name: 'Sergey Brin', headline: 'Co-founder of Google', linkedinUrl: '#', avatarUrl: 'https://picsum.photos/seed/brin/40/40', institution: 'Stanford' },
        { name: 'Reese Witherspoon', headline: 'Actress and Producer', linkedinUrl: '#', avatarUrl: 'https://picsum.photos/seed/witherspoon/40/40', institution: 'Stanford' },
    ]
  },
  {
    id: '3',
    name: 'Indian Institute of Technology Bombay', // Ensure name matches logoMap key
    location: 'Mumbai, India',
    country: 'India',
    description: 'One of India\'s premier engineering and technology institutes, known for its rigorous academics and research.',
    imageUrl: 'https://picsum.photos/seed/iitb/600/400',
    acceptanceRate: 10, 
    tuitionFees: { amount: 220000, currency: 'INR', period: 'annual' },
    financialAidAvailable: true,
    popularPrograms: ['Computer Engineering', 'Mechanical Engineering', 'Electrical Engineering'],
    ranking: 'India #1',
    website: 'https://www.iitb.ac.in/',
    admissionDeadline: 'Varies (JEE)',
    requiredExams: ['JEE Advanced'],
    alumni: [
        { name: 'Nandan Nilekani', headline: 'Co-founder of Infosys', linkedinUrl: '#', avatarUrl: 'https://picsum.photos/seed/nilekani/40/40', institution: 'IIT Bombay' },
        { name: 'Parag Agrawal', headline: 'Former CEO of Twitter', linkedinUrl: '#', avatarUrl: 'https://picsum.photos/seed/agrawal/40/40', institution: 'IIT Bombay' },
    ]
  },
  {
    id: '4',
    name: 'University of Toronto', // Ensure name matches logoMap key
    location: 'Toronto, ON, Canada',
    country: 'Canada',
    description: 'Canada\'s largest university, recognized for its comprehensive programs and research impact.',
    imageUrl: 'https://picsum.photos/seed/utoronto/600/400',
    acceptanceRate: 43,
    tuitionFees: { amount: 45000, currency: 'CAD', period: 'annual' }, 
    financialAidAvailable: true,
    popularPrograms: ['Computer Science', 'Life Sciences', 'Humanities'],
    ranking: 'Canada #1',
    website: 'https://www.utoronto.ca/',
    admissionDeadline: 'January 15',
    requiredExams: ['TOEFL', 'IELTS'],
  },
  {
    id: '5',
    name: 'National University of Singapore', // Ensure name matches logoMap key
    location: 'Singapore',
    country: 'Singapore', 
    description: 'Asia\'s leading comprehensive research university, offering a global approach to education and research.',
    imageUrl: 'https://picsum.photos/seed/nus/600/400',
    acceptanceRate: 25, 
    tuitionFees: { amount: 17550, currency: 'SGD', period: 'annual' }, 
    financialAidAvailable: true,
    popularPrograms: ['Computer Science', 'Business Analytics', 'Engineering'],
    ranking: 'Asia #1',
    website: 'https.nus.edu.sg',
    admissionDeadline: 'March 19',
    requiredExams: ['SAT', 'ACT', 'TOEFL', 'IELTS'],
  },
];
