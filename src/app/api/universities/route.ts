
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
  const sortBy = searchParams.get('sortBy') || 'world_ranking'; 

  // Start building the query
  let query = supabase.from('University').select(`
    id,
    name,
    country,
    location,
    study_levels, 
    popular_programs,
    min_cgpa,
    financial_aid_available,
    world_ranking,
    website,
    image_url,
    description,
    acceptance_rate,
    tuition_fees_amount,
    tuition_fees_currency,
    tuition_fees_period,
    admission_deadline,
    ranking_description,
    campus_life,
    required_exams
  `);

  if (keyword) {
    query = query.or(`name.ilike.%${keyword}%,description.ilike.%${keyword}%,location.ilike.%${keyword}%`);
  }

  if (countryParam) {
    query = query.eq('country', countryParam);
  }

  if (studyLevelParam) {
    query = query.cs('study_levels', `{${studyLevelParam}}`); 
  }
  
  if (subjectParam) {
    query = query.cs('popular_programs', `{${subjectParam}}`); 
  }

  if (minCGPAStr) {
    const minCGPA = parseFloat(minCGPAStr);
    if (!isNaN(minCGPA)) {
      query = query.gte('min_cgpa', minCGPA);
    }
  }

  if (sortBy === 'name') {
    query = query.order('name', { ascending: true });
  } else if (sortBy === 'worldranking' || sortBy === 'world_ranking') { 
    query = query.order('world_ranking', { ascending: true, nullsFirst: false });
  } else if (sortBy === 'mincgpa' || sortBy === 'min_cgpa') {
    query = query.order('min_cgpa', { ascending: true, nullsFirst: false });
  } else {
    query = query.order('world_ranking', { ascending: true, nullsFirst: false });
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
    location: uni.location,
    studylevels: uni.study_levels || [], 
    subjects: uni.popular_programs || [], 
    mincgpa: uni.min_cgpa,
    scholarships: uni.financial_aid_available ?? false,
    worldranking: uni.world_ranking, 
    webpages: uni.website ? [uni.website] : [],
    imageUrl: uni.image_url,
    description: uni.description,
    acceptanceRate: uni.acceptance_rate,
    tuitionFees: uni.tuition_fees_amount && uni.tuition_fees_currency && uni.tuition_fees_period ? {
        amount: uni.tuition_fees_amount,
        currency: uni.tuition_fees_currency,
        period: uni.tuition_fees_period as 'annual' | 'semester' | 'total',
    } : undefined,
    admissionDeadline: uni.admission_deadline,
    ranking_description: uni.ranking_description,
    financialAidAvailable: uni.financial_aid_available,
    popularPrograms: uni.popular_programs,
    campusLife: uni.campus_life,
    requiredExams: uni.required_exams,
  }));

  return NextResponse.json({ data: transformedData });
}
