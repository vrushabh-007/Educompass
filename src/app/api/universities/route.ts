
import { NextResponse, type NextRequest } from 'next/server';
import { mockColleges } from '@/data/mock-colleges';
import type { College, UniversityAPIResponse } from '@/lib/types';

// This function simulates filtering on the mock data, similar to what a database would do.
function filterColleges(
  colleges: College[],
  filters: {
    keyword?: string;
    country?: string;
    studyLevel?: string;
    subject?: string;
    minCGPA?: number;
    scholarships?: boolean;
    sortBy?: string;
  }
): College[] {
  let filtered = colleges;

  if (filters.keyword) {
    const keyword = filters.keyword.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(keyword) ||
        c.location.toLowerCase().includes(keyword) ||
        c.popularPrograms?.some(p => p.toLowerCase().includes(keyword))
    );
  }

  if (filters.country && filters.country !== 'Other' && filters.country !== 'All Countries') {
    filtered = filtered.filter((c) => c.country === filters.country);
  }

  // Note: Mock data doesn't have study levels, so this filter won't have an effect.
  // if (filters.studyLevel) { ... }

  if (filters.subject) {
    filtered = filtered.filter((c) => c.popularPrograms?.includes(filters.subject!));
  }
  
  // Note: Mock data doesn't have min CGPA, so this filter won't have an effect.
  // if (filters.minCGPA) { ... }

  if (filters.scholarships) {
    filtered = filtered.filter((c) => c.financialAidAvailable);
  }

  if (filters.sortBy) {
    if (filters.sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
    // Default sort is by mock data order, which is like a pre-set ranking
  }

  return filtered;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const keyword = searchParams.get('keyword')?.toLowerCase();
    const countryParam = searchParams.get('country');
    const studyLevelParam = searchParams.get('studyLevel');
    const subjectParam = searchParams.get('subject');
    const minCGPAStr = searchParams.get('minCGPA');
    const sortBy = searchParams.get('sortBy') || 'worldranking';
    const scholarshipsParam = searchParams.get('scholarships');

    const minCGPA = minCGPAStr ? parseFloat(minCGPAStr) : undefined;
    const scholarships = scholarshipsParam === 'true';

    // Using mock data as a fallback
    const filteredColleges = filterColleges(mockColleges, {
      keyword,
      country: countryParam || undefined,
      studyLevel: studyLevelParam || undefined,
      subject: subjectParam || undefined,
      minCGPA,
      scholarships,
      sortBy,
    });
    
    const transformedData: UniversityAPIResponse[] = filteredColleges.map(college => ({
      id: college.id,
      name: college.name,
      country: college.country,
      location: college.location,
      // The mock data doesn't have all the fields from the DB, so we map what we have.
      studylevels: [], // Not available in mock data
      subjects: college.popularPrograms,
      mincgpa: undefined, // Not available in mock data
      scholarships: college.financialAidAvailable,
      worldranking: college.ranking ? parseInt(college.ranking.replace(/[^0-9]/g, ''), 10) || undefined : undefined,
      webpages: college.website ? [college.website] : [],
      imageUrl: college.imageUrl,
      ranking_description: college.ranking,
    }));

    return NextResponse.json({ data: transformedData });

  } catch (e: any) {
    console.error('Unexpected error in /api/universities route:', e);
    const detailMessage = typeof e.message === 'string' ? e.message : String(e);
    return NextResponse.json({ error: 'An unexpected server error occurred.', details: detailMessage }, { status: 500 });
  }
}
