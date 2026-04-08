
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
  { name: 'UC Berkeley', country: 'USA', logo: 'https://zcfxvkqzyxxxftmtvwdo.supabase.co/storage/v1/object/sign/universitylogos/logos/berkeley-logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMzFiZTQ3Mi03NmE2LTQzMDgtOGM5Ni1mMGFhMmM3NTMyY2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ1bml2ZXJzaXR5bG9nb3MvbG9nb3MvYmVya2VsZXktbG9nby5wbmciLCJpYXQiOjE3NzU1ODAzMDIsImV4cCI6MTgwNzExNjMwMn0.FKDrapNCV2ppNcIRADzZ1gHoykZWOM5qyqb5ITVP5og', website: 'https://www.berkeley.edu/' },
  { name: 'California Institute of Technology', country: 'USA', logo: 'https://zcfxvkqzyxxxftmtvwdo.supabase.co/storage/v1/object/sign/universitylogos/logos/caltech-logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMzFiZTQ3Mi03NmE2LTQzMDgtOGM5Ni1mMGFhMmM3NTMyY2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ1bml2ZXJzaXR5bG9nb3MvbG9nb3MvY2FsdGVjaC1sb2dvLnBuZyIsImlhdCI6MTc3NTU4MDMxOCwiZXhwIjoxODA3MTE2MzE4fQ.iTzPHgyULJ9_49jmDqh3C01jzGQ3QbUFZOU6e0cQ1Uc', website: 'https://www.caltech.edu/' },
  { name: 'University of Cambridge', country: 'UK', logo: 'https://zcfxvkqzyxxxftmtvwdo.supabase.co/storage/v1/object/sign/universitylogos/logos/cambridge-logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMzFiZTQ3Mi03NmE2LTQzMDgtOGM5Ni1mMGFhMmM3NTMyY2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ1bml2ZXJzaXR5bG9nb3MvbG9nb3MvY2FtYnJpZGdlLWxvZ28ucG5nIiwiaWF0IjoxNzc1NTgwMzM1LCJleHAiOjE4MDcxMTYzMzV9.ktckFL5cg1SplHsxVWVDidmRWG_aCSKix_UHTINdcs0', website: 'https://www.cam.ac.uk/' },
  { name: 'University of Chicago', country: 'USA', logo: 'https://zcfxvkqzyxxxftmtvwdo.supabase.co/storage/v1/object/sign/universitylogos/logos/chicago-logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMzFiZTQ3Mi03NmE2LTQzMDgtOGM5Ni1mMGFhMmM3NTMyY2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ1bml2ZXJzaXR5bG9nb3MvbG9nb3MvY2hpY2Fnby1sb2dvLnBuZyIsImlhdCI6MTc3NTU4MDM0NiwiZXhwIjoxODA3MTE2MzQ2fQ.akzBEBalKeGGh2SigOviupw9JBzpkTGhl_VPc7eBbl4', website: 'https://www.uchicago.edu/' },
  { name: 'ETH Zurich', country: 'Switzerland', logo: 'https://zcfxvkqzyxxxftmtvwdo.supabase.co/storage/v1/object/sign/universitylogos/logos/eth-logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMzFiZTQ3Mi03NmE2LTQzMDgtOGM5Ni1mMGFhMmM3NTMyY2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ1bml2ZXJzaXR5bG9nb3MvbG9nb3MvZXRoLWxvZ28ucG5nIiwiaWF0IjoxNzc1NTgwMzU3LCJleHAiOjE4MDcxMTYzNTd9.oqeU4SPei-XisvnGTuTXHzeeKDYUKraaAo6t3LHwN2I', website: 'https://ethz.ch/' },
  { name: 'Harvard University', country: 'USA', logo: 'https://zcfxvkqzyxxxftmtvwdo.supabase.co/storage/v1/object/sign/universitylogos/logos/harverd-logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMzFiZTQ3Mi03NmE2LTQzMDgtOGM5Ni1mMGFhMmM3NTMyY2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ1bml2ZXJzaXR5bG9nb3MvbG9nb3MvaGFydmVyZC1sb2dvLnBuZyIsImlhdCI6MTc3NTU4MDM2NywiZXhwIjoxODA3MTE2MzY3fQ.GOPFywVPFdDCMiBN1Le7p7zNUPpMWvQd-c4gezc8CgI', website: 'https://www.harvard.edu/' },
  { name: 'UCL', country: 'UK', logo: 'https://zcfxvkqzyxxxftmtvwdo.supabase.co/storage/v1/object/sign/universitylogos/logos/london-logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMzFiZTQ3Mi03NmE2LTQzMDgtOGM5Ni1mMGFhMmM3NTMyY2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ1bml2ZXJzaXR5bG9nb3MvbG9nb3MvbG9uZG9uLWxvZ28ucG5nIiwiaWF0IjoxNzc1NTgwMzkzLCJleHAiOjE4MDcxMTYzOTN9.07Sa9dtYcno8oD2NDJ6dvMGJy--t93ZQuvBV8pdb3-Q', website: 'https://www.ucl.ac.uk/' },
  { name: 'Massachusetts Institute of Technology', country: 'USA', logo: 'https://zcfxvkqzyxxxftmtvwdo.supabase.co/storage/v1/object/sign/universitylogos/logos/mit-logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMzFiZTQ3Mi03NmE2LTQzMDgtOGM5Ni1mMGFhMmM3NTMyY2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ1bml2ZXJzaXR5bG9nb3MvbG9nb3MvbWl0LWxvZ28ucG5nIiwiaWF0IjoxNzc1NTgwNDAyLCJleHAiOjE4MDcxMTY0MDJ9.RIkC-86vlEOZqIHZprXEjN9ijnaFr-fzTiTqBrQp92M', website: 'https://web.mit.edu/' },
  { name: 'National University of Singapore', country: 'Singapore', logo: 'https://zcfxvkqzyxxxftmtvwdo.supabase.co/storage/v1/object/sign/universitylogos/logos/nus-logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMzFiZTQ3Mi03NmE2LTQzMDgtOGM5Ni1mMGFhMmM3NTMyY2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ1bml2ZXJzaXR5bG9nb3MvbG9nb3MvbnVzLWxvZ28ucG5nIiwiaWF0IjoxNzc1NTgwNDEyLCJleHAiOjE4MDcxMTY0MTJ9.3T0YT9tU7Q-gxGN3QDqtIjmym0tW8ZQ83mFug13RYeA', website: 'https://nus.edu.sg/' },
  { name: 'University of Oxford', country: 'UK', logo: 'https://zcfxvkqzyxxxftmtvwdo.supabase.co/storage/v1/object/sign/universitylogos/logos/oxford-logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMzFiZTQ3Mi03NmE2LTQzMDgtOGM5Ni1mMGFhMmM3NTMyY2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ1bml2ZXJzaXR5bG9nb3MvbG9nb3Mvb3hmb3JkLWxvZ28ucG5nIiwiaWF0IjoxNzc1NTgwNDIyLCJleHAiOjE4MDcxMTY0MjJ9.JCEujEm_kiBSYFqc-89U3oXDRR8UpRNuxEw3j7wQlbE', website: 'https://www.ox.ac.uk/' },
  { name: 'Princeton University', country: 'USA', logo: 'https://zcfxvkqzyxxxftmtvwdo.supabase.co/storage/v1/object/sign/universitylogos/logos/priceton-logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMzFiZTQ3Mi03NmE2LTQzMDgtOGM5Ni1mMGFhMmM3NTMyY2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ1bml2ZXJzaXR5bG9nb3MvbG9nb3MvcHJpY2V0b24tbG9nby5wbmciLCJpYXQiOjE3NzU1ODA0MzEsImV4cCI6MTgwNzExNjQzMX0.EfMuKT1m_2C5jJJOqwj-1FOjiEVUyYOF2NYWi7hzKSQ', website: 'https://www.princeton.edu/' },
  { name: 'Stanford University', country: 'USA', logo: 'https://zcfxvkqzyxxxftmtvwdo.supabase.co/storage/v1/object/sign/universitylogos/logos/stanford-logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMzFiZTQ3Mi03NmE2LTQzMDgtOGM5Ni1mMGFhMmM3NTMyY2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ1bml2ZXJzaXR5bG9nb3MvbG9nb3Mvc3RhbmZvcmQtbG9nby5wbmciLCJpYXQiOjE3NzU1ODA3NDUsImV4cCI6MTgwNzExNjc0NX0.zWjM3ZLO5uBa7EB6r-d--X2frYIeQTXbJhedEAHhOsk', website: 'https://www.stanford.edu/' },
  { name: 'University of Tokyo', country: 'Japan', logo: 'https://zcfxvkqzyxxxftmtvwdo.supabase.co/storage/v1/object/sign/universitylogos/logos/tokyo-logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMzFiZTQ3Mi03NmE2LTQzMDgtOGM5Ni1mMGFhMmM3NTMyY2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ1bml2ZXJzaXR5bG9nb3MvbG9nb3MvdG9reW8tbG9nby5wbmciLCJpYXQiOjE3NzU1ODA0NTEsImV4cCI6MTgwNzExNjQ1MX0.RXmvSxJ2QPfB7Z81km-HbHpsLO3zPTh8Oo8Tg-vfaSU', website: 'https://www.u-tokyo.ac.jp/' },
  { name: 'Yale University', country: 'USA', logo: 'https://zcfxvkqzyxxxftmtvwdo.supabase.co/storage/v1/object/sign/universitylogos/logos/yale-logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMzFiZTQ3Mi03NmE2LTQzMDgtOGM5Ni1mMGFhMmM3NTMyY2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ1bml2ZXJzaXR5bG9nb3MvbG9nb3MveWFsZS1sb2dvLnBuZyIsImlhdCI6MTc3NTU4MDQ2MCwiZXhwIjoxODA3MTE2NDYwfQ.4F3uHVXnavBiUakI0y5b2_NtZ_ECV-ug7471h0UztCY', website: 'https://www.yale.edu/' },
];


function UniversityLogos() {
  const [universities, setUniversities] = useState<UniversityInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

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
        const loadedUniversities = data.map(uni => {
          let logoUrl = uni['university-logo'];

          // The database currently holds old broken Supabase project URLs (bbxmsfmikhbvbweaderx)
          // We map these to our working mock signed URLs if available.
          if (logoUrl && logoUrl.includes('bbxmsfmikhbvbweaderx.supabase.co')) {
            const mockUni = mockUniversityLogos.find(m => m.name === uni.name);
            logoUrl = mockUni?.logo || null;
          }

          return {
            name: uni.name,
            country: uni.country,
            logo: logoUrl || `https://picsum.photos/seed/${uni.name.replace(/\s+/g, '')}/100/100`,
            website: uni.webpages?.[0] || '#',
          };
        });
        setUniversities(loadedUniversities);
      }
      setLoading(false);
    };

    fetchUniversities();
  }, []);

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
                          priority={false}
                          onError={(e) => {
                            e.currentTarget.srcset = '';
                            e.currentTarget.src = `https://picsum.photos/seed/${uni.name.replace(/\s+/g, '')}/100/100`;
                          }}
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
