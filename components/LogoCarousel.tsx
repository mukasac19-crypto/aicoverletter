"use client";

import Image from 'next/image';
import Marquee from 'react-fast-marquee';


export default function LogoCarousel({ companyLogos }:{companyLogos:any[]}) {
  return (
    <div className="flex items-center gap-4"> 
      <Marquee
        speed={50} 
        direction="left" 
        pauseOnHover={true} 
        gradient={true} 
        className="gap-4" 
        style={{ height: '80px' }} 
      >
        {companyLogos.map((company, index) => (
          <div key={index} className="h-[80px] min-w-[80px] flex items-center justify-center px-1 py-1 rounded-lg">
            <Image
              src={company.logo}
              alt={`${company.name} logo`}
              width={100}
              height={80}
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback if image fails to load (keep your original logic)
                e.currentTarget.src = `https://via.placeholder.com/120x40/CCCCCC/666666?text=${company.name}`;
              }}
            />
          </div>
        ))}
      </Marquee>
    </div>
  );
}