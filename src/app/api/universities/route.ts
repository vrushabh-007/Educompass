
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { UniversityAPIResponse } from '@/lib/types'; 

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);

    const keyword = searchParams.get('keyword')?.toLowerCase();
    const countryParam = searchParams.get('country');
    const studyLevelParam = searchParams.get('studyLevel');
    const subjectParam = searchParams.get('subject');
    const minCGPAStr = searchParams.get('minCGPA');
    const sortBy = searchParams.get('sortBy') || 'worldranking'; 
    const scholarshipsParam = searchParams.get('scholarships');

    let query = supabase.from('University').select(`
      id,
      name,
      country,
      stateprovince,
      studylevels, 
      subjects,
      mincgpa,
      scholarships,
      worldranking,
      webpages,
      "university-logo"
    `);

    if (keyword) {
      const orFilterParts = [
        `name.ilike.%${keyword}%`,
        `stateprovince.ilike.%${keyword}%`
      ];
      // Assuming 'subjects' is text[] and we want to check if the keyword is one of the subjects.
      // PostgREST syntax for array contains (cs) requires the value to be in "value" format if it contains spaces.
      const escapedKeyword = keyword.replace(/"/g, '""'); // Basic CSV-style escaping for quotes in PostgREST filter strings.
      orFilterParts.push(`subjects.cs.{"${escapedKeyword}"}`);
      query = query.or(orFilterParts.join(','));
    }

    if (countryParam && countryParam !== 'Other' && countryParam !== 'All Countries' && countryParam !== '') {
      query = query.eq('country', countryParam);
    }

    if (studyLevelParam && studyLevelParam !== '' && studyLevelParam !== 'All Levels') {
      // Ensure studylevels is an array column in your DB (e.g., text[])
      query = query.cs('studylevels', [studyLevelParam]);
    }
    
    if (subjectParam && subjectParam !== '' && subjectParam !== 'All Subjects') {
      // Ensure subjects is an array column in your DB (e.g., text[])
      query = query.cs('subjects', [subjectParam]);
    }

    if (minCGPAStr) {
      const minCGPA = parseFloat(minCGPAStr);
      if (!isNaN(minCGPA) && minCGPA !== 7.0) { 
        query = query.gte('mincgpa', minCGPA);
      }
    }

    if (scholarshipsParam === 'true') {
      query = query.is('scholarships', true);
    }

    if (sortBy === 'name') {
      query = query.order('name', { ascending: true });
    } else if (sortBy === 'mincgpa') {
      query = query.order('mincgpa', { ascending: true, nullsFirst: false });
    } else { // Default to worldranking
      query = query.order('worldranking', { ascending: true, nullsFirst: false });
    }
    
    const { data: universities, error } = await query;

    if (error) {
      console.error('Supabase error fetching universities:', error);
      return NextResponse.json({ error: 'Failed to fetch universities from Supabase', details: error.message }, { status: 500 });
    }

    if (!universities) {
      return NextResponse.json({ data: [] });
    }

    const transformedData: UniversityAPIResponse[] = universities.map(uni => ({
      id: String(uni.id),
      name: uni.name,
      country: uni.country,
      location: uni.stateprovince || undefined, 
      studylevels: uni.studylevels || [], 
      subjects: uni.subjects || [], 
      mincgpa: uni.mincgpa,
      scholarships: uni.scholarships ?? false,
      worldranking: uni.worldranking, 
      webpages: uni.webpages || [], 
      imageUrl: uni["university-logo"], 
      description: undefined, 
      acceptanceRate: undefined, 
      tuitionFees: undefined, 
      admissionDeadline: undefined, 
      ranking_description: undefined, 
      financialAidAvailable: uni.scholarships ?? false, 
      popularPrograms: uni.subjects || [], 
      campusLife: undefined, 
      requiredExams: undefined, 
    }));

    return NextResponse.json({ data: transformedData });

  } catch (e: any) {
    console.error('Unexpected error in /api/universities route:', e);
    // Ensure the error details are correctly passed. e.message might not always be a string.
    const detailMessage = typeof e.message === 'string' ? e.message : String(e);
    return NextResponse.json({ error: 'An unexpected server error occurred.', details: detailMessage }, { status: 500 });
  }
}
