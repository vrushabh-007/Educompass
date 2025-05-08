
import { NextResponse, type NextRequest } from 'next/server';
import { mockColleges } from '@/data/mock-colleges';
import type { College } from '@/lib/types';

// Helper to parse ranking string like "Global #1" or "India #3" to a number
function parseRanking(rankingStr?: string): number | null {
  if (!rankingStr) return null;
  const match = rankingStr.match(/#(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword')?.toLowerCase();
  const country = searchParams.get('country')?.toLowerCase();
  // const studyLevel = searchParams.get('studyLevel')?.toLowerCase(); // studyLevel not in mockColleges
  const subject = searchParams.get('subject')?.toLowerCase();
  // const minCGPAStr = searchParams.get('minCGPA'); // minCGPA not in mockColleges
  const sortBy = searchParams.get('sortBy') || 'worldranking';

  let filtered = [...mockColleges];

  if (keyword) {
    filtered = filtered.filter(college =>
      college.name.toLowerCase().includes(keyword) ||
      college.description.toLowerCase().includes(keyword) ||
      college.location.toLowerCase().includes(keyword) ||
      (college.popularPrograms && college.popularPrograms.some(p => p.toLowerCase().includes(keyword)))
    );
  }

  if (country) {
    filtered = filtered.filter(college => college.country.toLowerCase() === country);
  }

  if (subject) {
    filtered = filtered.filter(college =>
      college.popularPrograms && college.popularPrograms.some(p => p.toLowerCase().includes(subject))
    );
  }
  
  // Sorting
  if (sortBy === 'name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'worldranking') {
    filtered.sort((a, b) => {
      const rankA = parseRanking(a.ranking);
      const rankB = parseRanking(b.ranking);
      if (rankA === null && rankB === null) return 0;
      if (rankA === null) return 1; // Sort colleges without ranking to the end
      if (rankB === null) return -1;
      return rankA - rankB;
    });
  }
  // Add other sort options like mincgpa if data becomes available

  // Transform data to match what ResultsPage expects
  const transformedData = filtered.map(college => ({
    id: college.id,
    name: college.name,
    country: college.country,
    location: college.location, // ResultsPage expects location, not stateprovince separately
    studylevels: [], // Not available in mockColleges, provide empty or mock
    subjects: college.popularPrograms || [],
    mincgpa: null, // Not available in mockColleges
    scholarships: college.financialAidAvailable || false,
    worldranking: parseRanking(college.ranking),
    webpages: college.website ? [college.website] : [],
    // Pass through other fields ResultsPage might use if they match
    description: college.description,
    imageUrl: college.imageUrl,
    acceptanceRate: college.acceptanceRate,
    tuitionFees: college.tuitionFees,
    admissionDeadline: college.admissionDeadline,
  }));

  return NextResponse.json({ data: transformedData });
}
