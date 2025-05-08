
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { UniversityAPIResponse } from '@/lib/types'; 

export async function GET(request: NextRequest) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);

  const keyword = searchParams.get('keyword')?.toLowerCase();
  const countryParam = searchParams.get('country');
  const studyLevelParam = searchParams.get('studyLevel')?.toLowerCase();
  const subjectParam = searchParams.get('subject')?.toLowerCase();
  const minCGPAStr = searchParams.get('minCGPA');
  const sortBy = searchParams.get('sortBy') || 'worldranking'; 

  // Start building the query
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
    // Assuming 'stateprovince' is the column for location in your DB
    query = query.or(`name.ilike.%${keyword}%,stateprovince.ilike.%${keyword}%,subjects.cs.{${keyword}}`);
  }

  if (countryParam) {
    query = query.eq('country', countryParam);
  }

  if (studyLevelParam) {
    query = query.cs('studylevels', `{${studyLevelParam}}`); 
  }
  
  if (subjectParam) {
    query = query.cs('subjects', `{${subjectParam}}`); 
  }

  if (minCGPAStr) {
    const minCGPA = parseFloat(minCGPAStr);
    if (!isNaN(minCGPA)) {
      query = query.gte('mincgpa', minCGPA);
    }
  }

  if (sortBy === 'name') {
    query = query.order('name', { ascending: true });
  } else if (sortBy === 'worldranking') { 
    query = query.order('worldranking', { ascending: true, nullsFirst: false });
  } else if (sortBy === 'mincgpa') {
    query = query.order('mincgpa', { ascending: true, nullsFirst: false });
  } else {
    // Default sort by worldranking
    query = query.order('worldranking', { ascending: true, nullsFirst: false });
  }
  
  const { data: universities, error } = await query;

  if (error) {
    console.error('Supabase error fetching universities:', error);
    return NextResponse.json({ error: 'Failed to fetch universities', details: error.message }, { status: 500 });
  }

  if (!universities) {
    return NextResponse.json({ data: [] });
  }

  const transformedData: UniversityAPIResponse[] = universities.map(uni => ({
    id: String(uni.id),
    name: uni.name,
    country: uni.country,
    location: uni.stateprovince, // Mapped from uni.stateprovince
    studylevels: uni.studylevels || [], 
    subjects: uni.subjects || [], 
    mincgpa: uni.mincgpa,
    scholarships: uni.scholarships ?? false,
    worldranking: uni.worldranking, 
    webpages: uni.webpages || [], // Supabase _text can be null
    imageUrl: uni["university-logo"], // Mapped from uni.university-logo
    // Fields not in the provided schema image are removed or set to undefined if they were previously expected
    description: undefined, // Not in schema image
    acceptanceRate: undefined, // Not in schema image
    tuitionFees: undefined, // Not in schema image
    admissionDeadline: undefined, // Not in schema image
    ranking_description: undefined, // Not in schema image
    financialAidAvailable: uni.scholarships ?? false, // Mapped from uni.scholarships
    popularPrograms: uni.subjects || [], // Mapped from uni.subjects
    campusLife: undefined, // Not in schema image
    requiredExams: undefined, // Not in schema image
  }));

  return NextResponse.json({ data: transformedData });
}

