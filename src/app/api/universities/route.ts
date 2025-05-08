
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { UniversityAPIResponse } from '@/lib/types'; 

export async function GET(request: NextRequest) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);

  const keyword = searchParams.get('keyword')?.toLowerCase();
  const countryParam = searchParams.get('country');
  const studyLevelParam = searchParams.get('studyLevel'); // Keep case from client (client sends lowercase for levels)
  const subjectParam = searchParams.get('subject');   // Keep case from client (client sends TitleCase for subjects)
  const minCGPAStr = searchParams.get('minCGPA');
  const sortBy = searchParams.get('sortBy') || 'worldranking'; 
  const scholarshipsParam = searchParams.get('scholarships');

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
    // Keyword search applies to name and location (stateprovince).
    // Specific subject filtering is handled by subjectParam.
    query = query.or(`name.ilike.%${keyword}%,stateprovince.ilike.%${keyword}%`);
  }

  if (countryParam) {
    query = query.eq('country', countryParam);
  }

  if (studyLevelParam) {
    // Use JSON.stringify to correctly quote the value for array containment
    // e.g. studylevels=cs.{"bachelors"}
    query = query.cs('studylevels', `{${JSON.stringify(studyLevelParam)}}`); 
  }
  
  if (subjectParam) {
    // Use JSON.stringify to correctly quote the value, especially if it contains spaces
    // e.g. subjects=cs.{"Computer Science"}
    query = query.cs('subjects', `{${JSON.stringify(subjectParam)}}`); 
  }

  if (minCGPAStr) {
    const minCGPA = parseFloat(minCGPAStr);
    if (!isNaN(minCGPA)) {
      query = query.gte('mincgpa', minCGPA);
    }
  }

  if (scholarshipsParam === 'true') {
    query = query.is('scholarships', true);
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
    location: uni.stateprovince, 
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
}
