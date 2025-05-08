
'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image'; 
import type { UniversityAPIResponse } from '@/lib/types'; 
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const logoMap: Record<string, string> = {
  'Massachusetts Institute of Technology': 'https://bbxmsfmikhbvbweaderx.supabase.co/storage/v1/object/public/universitylogos/logos/mit-logo.png',
  'Stanford University': 'https://bbxmsfmikhbvbweaderx.supabase.co/storage/v1/object/public/universitylogos/logos/stanford-logo.png',
  'Harvard University': 'https://bbxmsfmikhbvbweaderx.supabase.co/storage/v1/object/public/universitylogos/logos/harverd-logo.png', // Corrected from harverd to harvard if it was a typo
  'University of Cambridge': 'https://bbxmsfmikhbvbweaderx.supabase.co/storage/v1/object/public/universitylogos/logos/cambridge-logo.png',
  'University of Oxford': 'https://bbxmsfmikhbvbweaderx.supabase.co/storage/v1/object/public/universitylogos/logos/oxford-logo.png',
  'California Institute of Technology': 'https://bbxmsfmikhbvbweaderx.supabase.co/storage/v1/object/public/universitylogos/logos/caltech-logo.png',
  'ETH Zurich': 'https://bbxmsfmikhbvbweaderx.supabase.co/storage/v1/object/public/universitylogos/logos/eth-logo.png',
  'University College London': 'https://bbxmsfmikhbvbweaderx.supabase.co/storage/v1/object/public/universitylogos/logos/london-logo.png',
  'Imperial College London': 'https://bbxmsfmikhbvbweaderx.supabase.co/storage/v1/object/public/universitylogos/logos/imperial-logo.png',
  'University of Chicago': 'https://bbxmsfmikhbvbweaderx.supabase.co/storage/v1/object/public/universitylogos/logos/chicago-logo.png',
  'University of California, Berkeley': 'https://bbxmsfmikhbvbweaderx.supabase.co/storage/v1/object/public/universitylogos/logos/berkeley-logo.png',
  'National University of Singapore': 'https://bbxmsfmikhbvbweaderx.supabase.co/storage/v1/object/public/universitylogos/logos/nus-logo.png',
  'Princeton University': 'https://bbxmsfmikhbvbweaderx.supabase.co/storage/v1/object/public/universitylogos/logos/priceton-logo.png', // Corrected from priceton to princeton if typo
  'University of Tokyo': 'https://bbxmsfmikhbvbweaderx.supabase.co/storage/v1/object/public/universitylogos/logos/tokyo-logo.png',
  'Yale University': 'https://bbxmsfmikhbvbweaderx.supabase.co/storage/v1/object/public/universitylogos/logos/yale-logo.png',
  // Add more mappings if actual logos are stored in 'university-logo' column
};

// Trim whitespace from all URLs in logoMap
for (const key in logoMap) {
  if (Object.prototype.hasOwnProperty.call(logoMap, key)) {
    logoMap[key] = logoMap[key].trimEnd();
  }
}


const studyLevels = ['bachelors', 'masters', 'phd'];
const countries = ['USA', 'United Kingdom', 'Switzerland', 'India', 'Canada', 'Singapore', 'Germany', 'Australia', 'Other']; 
const subjects = [
  'Engineering', 'Computer Science', 'Business', 'Biology', 'Law', 'Medicine', 'Social Sciences',
  'Mathematics', 'Arts', 'Humanities', 'Sciences', 'Physics', 'Chemistry', 'Natural Sciences',
  'Architecture', 'Economics', 'Mechanical Engineering', 'Electrical Engineering', 'Business Analytics', 'Life Sciences',
];


export default function ResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [universities, setUniversities] = useState<UniversityAPIResponse[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState(() => searchParams.get('keyword') || searchParams.get('searchTerm') || '');
  const [selectedCountry, setSelectedCountry] = useState(() => searchParams.get('country') || searchParams.get('destination') || '');
  const [selectedLevel, setSelectedLevel] = useState(() => searchParams.get('studyLevel') || searchParams.get('educationLevel') || '');
  const [selectedSubject, setSelectedSubject] = useState(() => searchParams.get('subject') || searchParams.get('major') || '');
  const [sortBy, setSortBy] = useState(() => searchParams.get('sortBy') || 'worldranking');
  const [minCGPA, setMinCGPA] = useState(() => searchParams.get('minCGPA') || searchParams.get('cgpa') || '7.0');
  const [includeScholarships, setIncludeScholarships] = useState(() => searchParams.get('scholarships') === 'true');

  const [page, setPage] = useState(1);
  const perPage = 6;

  const fetchUniversities = useCallback(async () => {
    setLoading(true);
    const apiParams = new URLSearchParams();
    if (search) apiParams.set('keyword', search);
    if (selectedCountry) apiParams.set('country', selectedCountry);
    if (selectedLevel) apiParams.set('studyLevel', selectedLevel);
    if (selectedSubject) apiParams.set('subject', selectedSubject);
    if (minCGPA && minCGPA !== '7.0') apiParams.set('minCGPA', minCGPA); 
    if (includeScholarships) apiParams.set('scholarships', 'true');
    apiParams.set('sortBy', sortBy);
    
    try {
      const res = await fetch(`/api/universities?${apiParams.toString()}`);
      if (!res.ok) {
        console.error("Failed to fetch universities", res.status, await res.text());
        setUniversities([]);
      } else {
        const { data } = await res.json();
        setUniversities(data || []);
      }
    } catch (error) {
      console.error("Error fetching universities:", error);
      setUniversities([]);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCountry, selectedLevel, selectedSubject, sortBy, minCGPA, includeScholarships]);

  useEffect(() => {
    fetchUniversities();
  }, [fetchUniversities]); 

   useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('keyword', search);
    if (selectedCountry) params.set('country', selectedCountry);
    if (selectedLevel) params.set('studyLevel', selectedLevel);
    if (selectedSubject) params.set('subject', selectedSubject);
    if (sortBy !== 'worldranking') params.set('sortBy', sortBy);
    if (minCGPA !== '7.0') params.set('minCGPA', minCGPA);
    if (includeScholarships) params.set('scholarships', 'true');


    const queryString = params.toString();
    // Using replace to avoid multiple history entries for filter changes
    router.replace(`/college-search${queryString ? `?${queryString}` : ''}`, { scroll: false });
  }, [search, selectedCountry, selectedLevel, selectedSubject, sortBy, minCGPA, includeScholarships, router]);

  const paginatedUniversities = useMemo(() => {
    const startIndex = (page - 1) * perPage;
    return universities.slice(startIndex, startIndex + perPage);
  }, [universities, page, perPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(universities.length / perPage);
  }, [universities, perPage]);

  const handleSearchFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); 
    // fetchUniversities will be called by its own useEffect dependency change
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCountry('');
    setSelectedLevel('');
    setSelectedSubject('');
    setSortBy('worldranking');
    setMinCGPA('7.0');
    setIncludeScholarships(false);
    setPage(1);
     // fetchUniversities will be called by its own useEffect dependency change
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto mt-2 px-4 sm:px-0">
        <form onSubmit={handleSearchFormSubmit} className="flex flex-col md:flex-row items-center gap-4 bg-card rounded-xl shadow p-4">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 items-end">
            <input
              type="text"
              placeholder="Search university, subject..."
              className="w-full px-4 py-2 rounded border border-border focus:outline-none focus:border-primary text-foreground bg-input col-span-full sm:col-span-1 md:col-span-1 lg:col-span-2"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              value={selectedCountry}
              onChange={e => setSelectedCountry(e.target.value)}
              className="w-full px-3 py-2 rounded border border-border bg-input text-foreground"
            >
              <option value="">All Countries</option>
              {countries.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={selectedLevel}
              onChange={e => setSelectedLevel(e.target.value)}
              className="w-full px-3 py-2 rounded border border-border bg-input text-foreground"
            >
              <option value="">All Levels</option>
              {studyLevels.map(l => (
                <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
              ))}
            </select>
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 rounded border border-border bg-input text-foreground"
            >
              <option value="">All Subjects</option>
              {subjects.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <div className="flex items-center gap-2 col-span-full sm:col-span-1 md:col-span-1 lg:col-span-1">
              <label htmlFor="minCGPAInput" className="text-sm text-muted-foreground whitespace-nowrap">Min CGPA:</label>
              <input
                id="minCGPAInput"
                type="number"
                min="0" 
                max="10.0" 
                step="0.1"
                value={minCGPA}
                onChange={e => setMinCGPA(e.target.value)}
                className="w-20 px-2 py-2 rounded border border-border bg-input text-foreground"
              />
            </div>
             <div className="flex items-center gap-2 col-span-full sm:col-span-1 md:col-span-1 lg:col-span-1 justify-self-start">
              <Checkbox
                id="includeScholarships"
                checked={includeScholarships}
                onCheckedChange={(checked) => setIncludeScholarships(checked as boolean)}
                className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label htmlFor="includeScholarships" className="text-sm text-muted-foreground whitespace-nowrap">Scholarships?</Label>
            </div>
          </div>
          <button type="submit" className="w-full md:w-auto mt-3 md:mt-0 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold shadow hover:bg-primary/90 transition">Find it now</button>
        </form>

        <div className="flex flex-wrap items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">Sort by:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-2 py-1 rounded border border-border text-sm bg-input text-foreground"
            >
              <option value="worldranking">World Ranking</option>
              <option value="name">Name</option>
              <option value="mincgpa">Min CGPA</option>
            </select>
          </div>
          <button 
            className="ml-auto text-sm text-primary underline hover:text-primary/90" 
            onClick={handleClearFilters}
          >
            Clear all
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-6 mb-2 text-muted-foreground text-sm font-semibold px-4 sm:px-0">
        {universities?.length || 0} universities found
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-8 px-4 sm:px-0">
        {loading ? (
          Array.from({ length: perPage }).map((_, idx) => (
            <div key={idx} className="rounded-xl border p-6 bg-card shadow-md animate-pulse">
              <div className="h-14 w-14 bg-muted rounded-lg mb-3"></div>
              <div className="h-5 w-3/4 bg-muted rounded mb-1"></div>
              <div className="h-4 w-1/2 bg-muted rounded mb-2"></div>
              <div className="flex flex-wrap gap-2 mb-2">
                <div className="h-5 w-16 bg-muted rounded-full"></div>
                <div className="h-5 w-20 bg-muted rounded-full"></div>
              </div>
              <div className="h-4 w-full bg-muted rounded mb-1"></div>
              <div className="h-4 w-1/3 bg-muted rounded mb-1"></div>
              <div className="h-4 w-1/2 bg-muted rounded mb-1"></div>
              <div className="h-10 w-full bg-muted rounded-lg mt-auto"></div>
            </div>
          ))
        ) : paginatedUniversities.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground py-10">No universities found. Try adjusting your filters.</div>
        ) : (
          paginatedUniversities.map((uni, idx) => {
            const isFirstCard = idx === 0 && page === 1; 
            // Prioritize uni.imageUrl (from DB), then logoMap, then picsum
            const logoSrc = (uni.imageUrl || logoMap[uni.name] || `https://picsum.photos/seed/${uni.id || uni.name.replace(/\s/g, '-')}/56/56`).trimEnd();
            return (
            <div
              key={uni.id || uni.name}
              className={`rounded-xl border p-6 flex flex-col items-start shadow-md transition relative bg-card ${isFirstCard ? 'border-primary shadow-lg' : 'border-border'}`}
            >
              <Image
                src={logoSrc}
                alt={`${uni.name} logo`}
                width={56}
                height={56}
                className="object-contain mb-3 rounded-lg bg-muted"
                onError={(e) => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/fallback-${uni.id}/56/56`; }}
                data-ai-hint="university logo"
              />
              <h2 className={`text-lg font-bold mb-1 ${isFirstCard ? 'text-primary' : 'text-primary'}`}>{uni.name}</h2>
              <div className={`mb-2 text-sm ${isFirstCard ? 'text-foreground/80' : 'text-muted-foreground'}`}>{uni.country}{uni.location ? `, ${uni.location}` : ''}</div>
              
              {uni.studylevels && uni.studylevels.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {uni.studylevels.map((level: string) => (
                    <span key={level} className={`px-2 py-0.5 rounded-full text-xs font-semibold ${isFirstCard ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-accent/10 text-accent border border-accent/20'}`}>{level}</span>
                  ))}
                </div>
              )}
              {uni.subjects && uni.subjects.length > 0 && (
                 <div className="flex flex-wrap gap-1 mb-2">
                    {uni.subjects.slice(0, 3).map((subj: string) => ( 
                    <span key={subj} className={`px-1.5 py-0.5 rounded-full text-xs ${isFirstCard ? 'bg-muted text-foreground/80' : 'bg-secondary text-secondary-foreground'}`}>{subj}</span>
                    ))}
                 </div>
              )}

              {uni.mincgpa != null && <div className={`text-xs mb-1 ${isFirstCard ? 'text-foreground/70' : 'text-muted-foreground'}`}>Min CGPA: <span className="font-semibold">{uni.mincgpa}</span></div>}
              
              <div className={`text-xs mb-1 ${isFirstCard ? 'text-foreground/70' : 'text-muted-foreground'}`}>Scholarships: <span className={uni.scholarships ? 'text-accent font-semibold' : 'text-destructive font-semibold'}>{uni.scholarships ? 'Available' : 'Not Available'}</span></div>
              
              {uni.worldranking != null && (
                <div className={`text-xs mb-1 ${isFirstCard ? 'text-foreground/70' : 'text-muted-foreground'}`}>World Ranking: <span className="font-semibold">#{uni.worldranking}</span></div>
              )}
               {uni.ranking_description && ( // This field might not be available anymore based on schema
                 <div className={`text-xs mb-1 ${isFirstCard ? 'text-foreground/70' : 'text-muted-foreground'}`}>Ranking: <span className="font-semibold">{uni.ranking_description}</span></div>
              )}
              {uni.webpages && uni.webpages.length > 0 && (
                <Link
                  href={uni.webpages[0].startsWith('http') ? uni.webpages[0] : `https://${uni.webpages[0]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-auto pt-3 px-4 py-2 rounded-lg font-semibold transition text-center w-full ${isFirstCard ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
                >
                  Visit Website
                </Link>
              )}
            </div>
          )})
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8 mb-12">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
            <button
              key={num}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm border transition ${page === num ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-primary border-border hover:bg-muted'}`}
              onClick={() => setPage(num)}
            >
              {num}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

