
'use client';

import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

interface UniversityInfo {
  name: string;
  country: string;
  logo: string;
  website: string;
}

const mockUniversityLogos: UniversityInfo[] = [
    { name: 'Massachusetts Institute of Technology', country: 'USA', logo: 'https://bbxmsfmikhbvbweaderx.supabase.co/storage/v1/object/public/universitylogos/logos/mit-logo.png', website: 'https://web.mit.edu/' },
    { name: 'Stanford University', country: 'USA', logo: 'https://bbxmsfmikhbvbweaderx.supabase.co/storage/v1/object/public/universitylogos/logos/stanford-logo.png', website: 'https://www.stanford.edu/' },
    { name: 'Harvard University', country: 'USA', logo: 'https://bbxmsfmikhbvbweaderx.supabase.co/storage/v1/object/public/universitylogos/logos/harverd-logo.png', website: 'https://www.harvard.edu/' },
    { name: 'University of Cambridge', country: 'UK', logo: 'https://bbxmsfmikhbvbweaderx.supabase.co/storage/v1/object/public/universitylogos/logos/cambridge-logo.png', website: 'https://www.cam.ac.uk/' },
    { name: 'University of Oxford', country: 'UK', logo: 'https://bbxmsfmikhbvbweaderx.supabase.co/storage/v1/object/public/universitylogos/logos/oxford-logo.png', website: 'https://www.ox.ac.uk/' },
    { name: 'California Institute of Technology', country: 'USA', logo: 'https://bbxmsfmikhbvbweaderx.supabase.co/storage/v1/object/public/universitylogos/logos/caltech-logo.png', website: 'https://www.caltech.edu/' },
    { name: 'ETH Zurich', country: 'Switzerland', logo: 'https://bbxmsfmikhbvbweaderx.supabase.co/storage/v1/object/public/universitylogos/logos/eth-logo.png', website: 'https://ethz.ch/' },
];


function UniversityLogos() {
  const [universities, setUniversities] = useState<UniversityInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchUniversities = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('University')
        .select('name, country, "university-logo", webpages')
        .limit(10); // Fetch a few for the carousel

      if (error || !data || data.length === 0) {
        console.error("Error fetching universities for logos or no data, falling back to mocks:", error);
        setUniversities(mockUniversityLogos);
      } else if (data) {
        const loadedUniversities = data.map(uni => ({
          name: uni.name,
          country: uni.country,
          logo: uni['university-logo'] || `https://picsum.photos/seed/${uni.name}/100/100`, // Use placeholder if logo is missing
          website: uni.webpages?.[0] || '#',
        }));
        setUniversities(loadedUniversities);
      }
      setLoading(false);
    };

    fetchUniversities();
  }, [supabase]);

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

  if (universities.length === 0) {
    return null; // Don't render anything if there's no data
  }

  return (
    <div className="py-12">
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
                          onError={(e) => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/fallback-${uni.name}/100/100`; }}
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
