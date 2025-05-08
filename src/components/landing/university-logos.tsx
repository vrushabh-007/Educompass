
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
      logo: 'https://bbxmsfmikhbvbweaderx.supabase.co/storage/v1/object/public/universitylogos/logos/harverd-logo.png',
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
      logo: 'https://bbxmsfmikhbvbweaderx.supabase.co/storage/v1/object/public/universitylogos/logos/priceton-logo.png',
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
        
        const { data, error: queryError } = await supabase
          .from('University')
          .select('name, country')
          .order('name', { ascending: true });

        if (queryError) {
          console.error('Supabase query error:', queryError);
          throw new Error(`Failed to fetch universities: ${queryError.message}`);
        }

        if (!data || data.length === 0) {
          console.warn('No universities found in the database');
          setUniversities([]);
          setLoading(false);
          return;
        }

        const universitiesWithData = data
          .filter(uni => universityData[uni.name])
          .map(uni => ({
            name: uni.name,
            country: uni.country,
            logo: universityData[uni.name].logo,
            website: universityData[uni.name].website
          }));

        setUniversities(universitiesWithData);
      } catch (err: any) {
        console.error('Error in fetchUniversities:', err);
        setError(err.message || 'Failed to fetch universities');
      } finally {
        setLoading(false);
      }
    }

    fetchUniversities();
  }, [supabase]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 5000,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0, // For continuous scroll, speed controls it with cssEase linear
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

  const bgColor = "bg-[hsl(var(--background))]"; // Using theme background
  const textColor = "text-[hsl(var(--foreground))]";
  const mutedTextColor = "text-[hsl(var(--muted-foreground))]";
  const cardBgColor = "bg-[hsl(var(--card))]";
  const cardBorderColor = "border-[hsl(var(--border))]";


  if (loading) {
    return (
      <div className={`${bgColor} py-12`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold ${textColor} mb-4`}>Featured Universities</h2>
            <p className={`text-lg ${mutedTextColor}`}>Loading universities...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${bgColor} py-12`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold ${textColor} mb-4`}>Featured Universities</h2>
            <p className="text-lg text-red-500">Error: {error}</p>
            <p className={`text-sm ${mutedTextColor} mt-2`}>Please check the browser console for more details.</p>
          </div>
        </div>
      </div>
    );
  }

  if (universities.length === 0) {
    return (
      <div className={`${bgColor} py-12`}>
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
    <div className={`${bgColor} py-12`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-bold ${textColor} mb-4`}>Featured Universities</h2>
          <p className={`text-lg ${mutedTextColor}`}>Explore opportunities at world-renowned institutions</p>
        </div>
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
                    // Middle click or ctrl/cmd click should open in new tab without preventDefault
                    if (e.button === 1 || e.metaKey || e.ctrlKey) {
                      return;
                    }
                    e.preventDefault();
                    window.open(uni.website, '_blank');
                  }}
                >
                  <div className={`aspect-square rounded-xl ${cardBgColor} shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center justify-between border ${cardBorderColor} h-full`}>
                    <div className="w-full h-2/3 flex items-center justify-center mb-3 flex-grow">
                      {uni.logo ? (
                        <Image 
                          src={uni.logo}
                          alt={`${uni.name} logo`}
                          width={100} // Provide appropriate width
                          height={100} // Provide appropriate height
                          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          data-ai-hint="university logo"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
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
