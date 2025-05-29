
'use client';

import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

interface UniversityInfo {
  name: string;
  country: string;
  logo: string;
  website: string;
}

function UniversityLogos() {
  const [universities, setUniversities] = useState<UniversityInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  // Map of university names to their logo URLs and websites
  const universityData: Record<string, { logo: string; website: string }> = {
    'University of Cambridge': {
      logo: 'https://bbxmsfmikhbvbweaderx.supabase.co/storage/v1/object/public/universitylogos/logos/cambridge-logo.png',
      website: 'https://www.cam.ac.uk/'
    },
    'ETH Zurich': {
      logo: 'https://bbxmsfmikhbvbweaderx.supabase.co/storage/v1/object/public/universitylogos/logos/eth-logo.png',
      website: 'https://ethz.ch/'
    },
    'Harvard University': {
      logo: 'https://bbxmsfmikhbvbweaderx.supabase.co/storage/v1/object/public/universitylogos/logos/harverd-logo.png', // Note: Typo 'harverd' in original, kept for consistency with map
      website: 'https://www.harvard.edu/'
    },
    'Massachusetts Institute of Technology': {
      logo: 'https://bbxmsfmikhbvbweaderx.supabase.co/storage/v1/object/public/universitylogos/logos/mit-logo.png',
      website: 'https://www.mit.edu/'
    },
    'National University of Singapore': {
      logo: 'https://bbxmsfmikhbvbweaderx.supabase.co/storage/v1/object/public/universitylogos/logos/nus-logo.png',
      website: 'https://www.nus.edu.sg/'
    },
    'University of Oxford': {
      logo: 'https://bbxmsfmikhbvbweaderx.supabase.co/storage/v1/object/public/universitylogos/logos/oxford-logo.png',
      website: 'https://www.ox.ac.uk/'
    },
    'Princeton University': {
      logo: 'https://bbxmsfmikhbvbweaderx.supabase.co/storage/v1/object/public/universitylogos/logos/priceton-logo.png', // Note: Typo 'priceton'
      website: 'https://www.princeton.edu/'
    },
    'Stanford University': {
      logo: 'https://bbxmsfmikhbvbweaderx.supabase.co/storage/v1/object/public/universitylogos/logos/stanford-logo.png',
      website: 'https://www.stanford.edu/'
    },
    'University of Tokyo': {
      logo: 'https://bbxmsfmikhbvbweaderx.supabase.co/storage/v1/object/public/universitylogos/logos/tokyo-logo.png',
      website: 'https://www.u-tokyo.ac.jp/'
    },
    'Yale University': {
      logo: 'https://bbxmsfmikhbvbweaderx.supabase.co/storage/v1/object/public/universitylogos/logos/yale-logo.png',
      website: 'https://www.yale.edu/'
    }
  };

  useEffect(() => {
    async function fetchUniversities() {
      try {
        setLoading(true);
        setError(null);

        const initialUniversities = Object.keys(universityData).map(name => ({
          name,
          country: 'N/A', // Default country, to be updated from DB if possible
          logo: universityData[name].logo,
          website: universityData[name].website,
        }));

        if (initialUniversities.length === 0) {
            setUniversities([]);
            setLoading(false);
            return;
        }

        const { data: dbData, error: queryError } = await supabase
          .from('University')
          .select('name, country')
          .in('name', initialUniversities.map(u => u.name)); // Fetch only relevant unis

        if (queryError) {
          let detail = "No specific error message from Supabase.";
          if (queryError.message) {
            detail = queryError.message;
          } else if (typeof queryError === 'object' && queryError !== null && Object.keys(queryError).length > 0) {
            try {
              detail = JSON.stringify(queryError);
            } catch (e) {
              detail = "Supabase error object could not be stringified.";
            }
          }
          console.warn('Supabase query for university countries failed. Error object:', queryError);
          console.warn('Falling back to predefined university data. Error details:', detail);
          setError(`Could not fetch country data: ${detail}. Displaying default info.`);
          setUniversities(initialUniversities); 
        } else if (dbData && dbData.length > 0) {
          const mergedUniversities = initialUniversities.map(initialUni => {
            const dbUni = dbData.find(dbEntry => dbEntry.name === initialUni.name);
            return {
              ...initialUni,
              country: dbUni?.country || initialUni.country, 
            };
          });
          setUniversities(mergedUniversities);
        } else {
            console.warn('Supabase query returned no data for university countries. Using predefined data.');
            setUniversities(initialUniversities);
        }

      } catch (err: any) {
        let errorMessage = 'Failed to process university data';
        if (err instanceof Error && err.message) {
            errorMessage = err.message;
        } else if (typeof err === 'string') {
            errorMessage = err;
        }
        console.error('Error in fetchUniversities (outer catch):', err);
        setError(errorMessage);
        
        const fallbackUniversities = Object.keys(universityData).map(name => ({
            name,
            country: 'N/A',
            logo: universityData[name].logo,
            website: universityData[name].website,
        }));
        setUniversities(fallbackUniversities);
      } finally {
        setLoading(false);
      }
    }

    fetchUniversities();
  }, [supabase]); // universityData is stable, no need to add as dep

  const settings = {
    dots: false,
    infinite: true,
    speed: 5000,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0, 
    cssEase: "linear",
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        }
      }
    ]
  };

  const textColor = "text-[hsl(var(--foreground))]";
  const mutedTextColor = "text-[hsl(var(--muted-foreground))]";


  if (loading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold ${textColor} mb-4`}>Featured Universities</h2>
            <p className={`text-lg ${mutedTextColor}`}>Loading universities...</p>
          </div>
        </div>
      </div>
    );
  }

  // Displaying an error message on the UI if one was set
  if (error && universities.length === 0) { // Only show critical error if no unis can be displayed
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold ${textColor} mb-4`}>Featured Universities</h2>
            <p className="text-lg text-destructive">Error: {error}</p>
            <p className={`text-sm ${mutedTextColor} mt-2`}>Could not load university data. Please check the console for details.</p>
          </div>
        </div>
      </div>
    );
  }

  if (universities.length === 0) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold ${textColor} mb-4`}>Featured Universities</h2>
            <p className={`text-lg ${mutedTextColor}`}>No featured universities available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-bold ${textColor} mb-4`}>Featured Universities</h2>
          <p className={`text-lg ${mutedTextColor}`}>Explore opportunities at world-renowned institutions</p>
        </div>
        {error && <p className="text-center text-sm text-amber-500 mb-4">Note: {error}</p>}
        <div className="relative">
          <Slider {...settings}>
            {universities.map((uni, index) => (
              <div key={`${uni.name}-${index}`} className="px-4 h-full">
                <a 
                  href={uni.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group transform transition-all duration-300 hover:scale-105 h-full"
                  onClick={(e) => {
                    if (e.button === 1 || e.metaKey || e.ctrlKey) {
                      return; // Allow middle-click/ctrl-click to open in new tab
                    }
                    // For left-click, prevent default and use window.open to ensure _blank target
                    e.preventDefault();
                    window.open(uni.website, '_blank');
                  }}
                >
                  <div className="aspect-square rounded-xl bg-transparent/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center justify-between border border-border/30 h-full">
                    <div className="w-full h-2/3 flex items-center justify-center mb-3 flex-grow">
                      {uni.logo ? (
                        <Image 
                          src={uni.logo}
                          alt={`${uni.name} logo`}
                          width={100} 
                          height={100} 
                          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          data-ai-hint="university logo"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted/30 rounded-lg">
                          <span className={`${mutedTextColor} text-sm`}>No logo</span>
                        </div>
                      )}
                    </div>
                    <span className={`text-xs font-medium ${textColor} text-center leading-tight block`}>
                      {uni.name}
                    </span>
                  </div>
                </a>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
}

export default UniversityLogos;
