
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { College, UniversityAPIResponse } from '@/lib/types';
import { mockColleges } from '@/data/mock-colleges';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const supabase = createClient();

    const keyword = searchParams.get('keyword')?.toLowerCase();
    const countryParam = searchParams.get('country');
    const studyLevelParam = searchParams.get('studyLevel');
    const subjectParam = searchParams.get('subject');
    const minCGPAStr = searchParams.get('minCGPA');
    const sortBy = searchParams.get('sortBy') || 'worldranking';
    const scholarshipsParam = searchParams.get('scholarships');
    
    let query = supabase.from('University').select('*');

    if (keyword) {
      // Assuming 'name' and 'subjects' are columns you want to search.
      // Supabase's `textSearch` is often better for this but needs setup.
      // Using `or` for broad matching.
      query = query.or(`name.ilike.%${keyword}%,subjects.cs.{"${keyword}"}`);
    }
    
    if (countryParam && countryParam !== 'Other' && countryParam !== 'All Countries') {
      query = query.eq('country', countryParam);
    }
    
    if (studyLevelParam) {
      query = query.contains('studylevels', [studyLevelParam]);
    }

    if (subjectParam) {
      query = query.contains('subjects', [subjectParam]);
    }

    const minCGPA = minCGPAStr ? parseFloat(minCGPAStr) : undefined;
    if (minCGPA) {
        query = query.gte('mincgpa', minCGPA);
    }

    if (scholarshipsParam === 'true') {
        query = query.eq('scholarships', true);
    }

    if (sortBy) {
        const ascending = sortBy !== 'worldranking'; // worldranking is better descending
        query = query.order(sortBy, { ascending });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      // Fallback to mock data on Supabase error
      return NextResponse.json({ data: mockColleges.map(transformCollegeToAPIResponse) });
    }

    const transformedData: UniversityAPIResponse[] = data.map(uni => ({
      id: uni.id,
      name: uni.name,
      country: uni.country,
      location: uni.stateprovince,
      studylevels: uni.studylevels,
      subjects: uni.subjects,
      mincgpa: uni.mincgpa,
      scholarships: uni.scholarships,
      worldranking: uni.worldranking,
      webpages: uni.webpages,
      imageUrl: uni.university_logo,
      ranking_description: uni.ranking_description,
    }));
    
    return NextResponse.json({ data: transformedData });

  } catch (e: any) {
    console.error('Unexpected error in /api/universities route:', e);
    const detailMessage = typeof e.message === 'string' ? e.message : String(e);
    // Fallback to mock data on any unexpected error
    return NextResponse.json({ data: mockColleges.map(transformCollegeToAPIResponse) }, { status: 200 });
  }
}

// Helper to transform mock data to the API response shape
function transformCollegeToAPIResponse(college: College): UniversityAPIResponse {
    return {
      id: college.id,
      name: college.name,
      country: college.country,
      location: college.location,
      studylevels: [], // Mock data doesn't have this
      subjects: college.popularPrograms,
      mincgpa: undefined, // Mock data doesn't have this
      scholarships: college.financialAidAvailable,
      worldranking: college.ranking ? parseInt(college.ranking.replace(/[^0-9]/g, ''), 10) || undefined : undefined,
      webpages: college.website ? [college.website] : [],
      imageUrl: college.imageUrl,
      ranking_description: college.ranking,
    };
}
