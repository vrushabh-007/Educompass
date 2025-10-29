
'use client';

import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
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

  // Map of university names to their logo URLs and websites
  const universityData: Record<string, { logo: string; website: string; country: string; }> = {
    'University of Cambridge': {
      logo: 'https://picsum.photos/seed/cambridge-logo/100/100',
      website: 'https://www.cam.ac.uk/',
      country: 'United Kingdom'
    },
    'ETH Zurich': {
      logo: 'https://picsum.photos/seed/eth-logo/100/100',
      website: 'https://ethz.ch/',
      country: 'Switzerland'
    },
    'Harvard University': {
      logo: 'https://picsum.photos/seed/harvard-logo/100/100',
      website: 'https://www.harvard.edu/',
      country: 'USA'
    },
    'Massachusetts Institute of Technology': {
      logo: 'https://picsum.photos/seed/mit-logo/100/100',
      website: 'https://www.mit.edu/',
      country: 'USA'
    },
    'National University of Singapore': {
      logo: 'https://picsum.photos/seed/nus-logo/100/100',
      website: 'https://www.nus.edu.sg/',
      country: 'Singapore'
    },
    'University of Oxford': {
      logo: 'https://picsum.photos/seed/oxford-logo/100/100',
      website: 'https://www.ox.ac.uk/',
      country: 'United Kingdom'
    },
    'Princeton University': {
      logo: 'https://picsum.photos/seed/princeton-logo/100/100',
      website: 'https://www.princeton.edu/',
      country: 'USA'
    },
    'Stanford University': {
      logo: 'https://picsum.photos/seed/stanford-logo/100/100',
      website: 'https://www.stanford.edu/',
      country: 'USA'
    },
    'University of Tokyo': {
      logo: 'https://picsum.photos/seed/tokyo-logo/100/100',
      website: 'https://www.u-tokyo.ac.jp/',
      country: 'Japan'
    },
    'Yale University': {
      logo: 'https://picsum.photos/seed/yale-logo/100/100',
      website: 'https://www.yale.edu/',
      country: 'USA'
    }
  };

  useEffect(() => {
    const loadedUniversities = Object.keys(universityData).map(name => ({
        name,
        country: universityData[name].country,
        logo: universityData[name].logo,
        website: universityData[name].website,
    }));
    setUniversities(loadedUniversities);
    setLoading(false);
  }, []); // universityData is stable, no need to add as dep

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
