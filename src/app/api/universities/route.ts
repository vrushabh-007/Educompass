
import { NextResponse, type NextRequest } from 'next/server';
import { mockColleges } from '@/data/mock-colleges';
import type { UniversityAPIResponse, College } from '@/lib/types';

// Function to convert our detailed College mock data to the flatter UniversityAPIResponse
const transformCollegeToAPIResponse = (college: College): UniversityAPIResponse => {
  return {
    id: college.id,
    name: college.name,
    country: college.country,
    location: college.location,
    studylevels: ['Bachelors', 'Masters', 'PhD'], // Mock data, not in original College type
    subjects: college.popularPrograms || [],
    mincgpa: 7.0, // Mock data, not in original College type
    scholarships: college.financialAidAvailable,
    worldranking: parseInt(college.ranking?.match(/\d+/)?.[0] || '0', 10) || undefined,
    webpages: college.website ? [college.website] : [],
    imageUrl: college.imageUrl,
    description: college.description,
    acceptanceRate: college.acceptanceRate,
    tuitionFees: college.tuitionFees,
    admissionDeadline: college.admissionDeadline,
    ranking_description: college.ranking,
    financialAidAvailable: college.financialAidAvailable,
    popularPrograms: college.popularPrograms,
    campusLife: college.campusLife,
    requiredExams: college.requiredExams,
  };
};


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

    let filteredData = mockColleges.map(transformCollegeToAPIResponse);

    if (keyword) {
      filteredData = filteredData.filter(uni =>
        uni.name.toLowerCase().includes(keyword) ||
        uni.location?.toLowerCase().includes(keyword) ||
        uni.subjects?.some(s => s.toLowerCase().includes(keyword))
      );
    }

    if (countryParam && countryParam !== 'Other' && countryParam !== 'All Countries' && countryParam !== '') {
      filteredData = filteredData.filter(uni => uni.country === countryParam);
    }
    
    if (studyLevelParam && studyLevelParam !== '' && studyLevelParam !== 'All Levels') {
        // This is mock filtering as study levels are not in our base mock data
        // For demonstration, we'll just let it pass or you could implement specific logic
    }
    
    if (subjectParam && subjectParam !== '' && subjectParam !== 'All Subjects') {
        filteredData = filteredData.filter(uni => uni.subjects?.includes(subjectParam));
    }

    if (minCGPAStr) {
      const minCGPA = parseFloat(minCGPAStr);
      if (!isNaN(minCGPA) && minCGPA !== 7.0) {
        // Mock filtering for CGPA as it's not in the base mock data
        // This will be a placeholder logic
        filteredData = filteredData.filter(uni => (uni.mincgpa || 0) >= minCGPA);
      }
    }

    if (scholarshipsParam === 'true') {
      filteredData = filteredData.filter(uni => uni.scholarships === true);
    }
    
    if (sortBy === 'name') {
        filteredData.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'mincgpa') {
        // Sorting by a mock field
        filteredData.sort((a, b) => (a.mincgpa || 10) - (b.mincgpa || 10));
    } else { // Default to worldranking
        filteredData.sort((a, b) => (a.worldranking || 9999) - (b.worldranking || 9999));
    }

    return NextResponse.json({ data: filteredData });

  } catch (e: any) {
    console.error('Unexpected error in /api/universities route:', e);
    const detailMessage = typeof e.message === 'string' ? e.message : String(e);
    return NextResponse.json({ error: 'An unexpected server error occurred.', details: detailMessage }, { status: 500 });
  }
}
