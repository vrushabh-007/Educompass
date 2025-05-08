
import React from 'react';

function GlobalRankings() {
  return (
    <div className="bg-gradient-to-r from-primary to-primary/80 py-12">
      <div className="container mx-auto px-4 md:px-8">
        <div className="bg-card rounded-lg p-8 flex flex-col md:flex-row items-center justify-between shadow-xl">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <h2 className="text-3xl font-bold text-card-foreground mb-4">GLOBAL RANKINGS</h2>
            <p className="text-muted-foreground">
              Explore top universities worldwide ranked by academic excellence, research impact, and international outlook.
            </p>
            <a 
              href="https://www.topuniversities.com/world-university-rankings"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block bg-gradient-to-r from-primary to-accent text-primary-foreground px-6 py-3 rounded-lg hover:from-primary/90 hover:to-accent/90 transition duration-300 shadow-md hover:shadow-lg"
            >
              View Rankings
            </a>
          </div>
          <div className="md:w-1/3">
            <div className="bg-muted p-6 rounded-lg shadow-inner">
              <div className="text-center">
                <span className="block text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">1000+</span>
                <span className="text-muted-foreground">Universities Ranked</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GlobalRankings;
