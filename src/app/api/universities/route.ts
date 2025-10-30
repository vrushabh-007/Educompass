
import { NextResponse, type NextRequest } from 'next/server';
import db from '@/lib/db';
import type { UniversityAPIResponse } from '@/lib/types';

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

    let query = 'SELECT * FROM universities';
    const queryParams: any[] = [];
    let whereClauses: string[] = [];

    if (keyword) {
      queryParams.push(`%${keyword}%`);
      const keywordClauses = `(name ILIKE $${queryParams.length} OR location ILIKE $${queryParams.length} OR EXISTS (SELECT 1 FROM unnest(subjects) AS s WHERE s ILIKE $${queryParams.length}))`;
      whereClauses.push(keywordClauses);
    }
    
    if (countryParam && countryParam !== 'Other' && countryParam !== 'All Countries' && countryParam !== '') {
        queryParams.push(countryParam);
        whereClauses.push(`country = $${queryParams.length}`);
    }

    if (studyLevelParam && studyLevelParam !== '' && studyLevelParam !== 'All Levels') {
        queryParams.push(studyLevelParam);
        whereClauses.push(`$${queryParams.length} = ANY(studylevels)`);
    }

    if (subjectParam && subjectParam !== '' && subjectParam !== 'All Subjects') {
        queryParams.push(subjectParam);
        whereClauses.push(`$${queryParams.length} = ANY(subjects)`);
    }

    if (minCGPAStr) {
        const minCGPA = parseFloat(minCGPAStr);
        if (!isNaN(minCGPA) && minCGPA !== 7.0) {
            queryParams.push(minCGPA);
            whereClauses.push(`mincgpa >= $${queryParams.length}`);
        }
    }

    if (scholarshipsParam === 'true') {
        whereClauses.push('scholarships = true');
    }

    if (whereClauses.length > 0) {
        query += ' WHERE ' + whereClauses.join(' AND ');
    }

    let orderByClause = ' ORDER BY worldranking ASC NULLS LAST';
    if (sortBy === 'name') {
        orderByClause = ' ORDER BY name ASC';
    } else if (sortBy === 'mincgpa') {
        orderByClause = ' ORDER BY mincgpa ASC NULLS LAST';
    }
    query += orderByClause;

    const result = await db.query(query, queryParams);

    const transformedData: UniversityAPIResponse[] = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      country: row.country,
      location: row.stateprovince,
      studylevels: row.studylevels,
      subjects: row.subjects,
      mincgpa: row.mincgpa,
      scholarships: row.scholarships,
      worldranking: row.worldranking,
      webpages: row.webpages,
      imageUrl: row.university_logo, // mapped from university-logo
      ranking_description: row.ranking_description
    }));

    return NextResponse.json({ data: transformedData });

  } catch (e: any) {
    console.error('Unexpected error in /api/universities route:', e);
    const detailMessage = typeof e.message === 'string' ? e.message : String(e);
    return NextResponse.json({ error: 'An unexpected server error occurred.', details: detailMessage }, { status: 500 });
  }
}

