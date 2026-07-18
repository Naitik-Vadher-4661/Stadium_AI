'use client';

import { useState } from 'react';
import { useAccessibility } from '@/hooks/useAccessibility';
import { Ear, Eye, Accessibility, HeartHandshake, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function AccessibilityPage() {
  const { highContrast, setHighContrast, simplifiedLanguage, setSimplifiedLanguage } = useAccessibility();
  const [shuttleRequested, setShuttleRequested] = useState(false);

  const handleRequestShuttle = () => {
    setShuttleRequested(true);
    setTimeout(() => setShuttleRequested(false), 5000);
  };

  return (
    <div className="min-h-full bg-background flex flex-col items-center py-12 px-4 transition-colors">
      <div className="max-w-3xl w-full flex flex-col gap-8">
        
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Accessibility className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Accessibility & Inclusion</h2>
          <p className="text-foreground/70">
            We are committed to making the stadium experience incredible for every single fan. Customize your app experience or request on-demand assistance here.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Settings Panel */}
          <div className="bg-card border border-card-border rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-4 text-foreground flex items-center">
              <Eye className="w-5 h-5 mr-2 text-primary" />
              Display & Language
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">High Contrast Mode</h4>
                  <p className="text-sm text-foreground/60">Increases visibility for visually impaired fans.</p>
                </div>
                <button
                  onClick={() => setHighContrast(!highContrast)}
                  className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${highContrast ? 'bg-primary' : 'bg-card-border'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-card transition-transform ${highContrast ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Simplified Language</h4>
                  <p className="text-sm text-foreground/60">AI will use simpler vocabulary and shorter sentences.</p>
                </div>
                <button
                  onClick={() => setSimplifiedLanguage(!simplifiedLanguage)}
                  className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${simplifiedLanguage ? 'bg-primary' : 'bg-card-border'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-card transition-transform ${simplifiedLanguage ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Assistance Panel */}
          <div className="bg-card border border-card-border rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-4 text-foreground flex items-center">
              <HeartHandshake className="w-5 h-5 mr-2 text-primary" />
              On-Demand Assistance
            </h3>

            <div className="space-y-4">
              <button
                onClick={handleRequestShuttle}
                disabled={shuttleRequested}
                className="w-full flex items-center justify-between p-4 rounded-lg border border-card-border bg-background hover:border-primary/50 transition-colors text-left"
              >
                <div>
                  <h4 className="font-medium text-foreground">Request Wheelchair Shuttle</h4>
                  <p className="text-sm text-foreground/60">A staff member will pick you up at your seat.</p>
                </div>
                {shuttleRequested ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Accessibility className="w-5 h-5 text-primary" />}
              </button>

              <Link
                href="/assistant"
                className="w-full flex items-center justify-between p-4 rounded-lg border border-card-border bg-background hover:border-primary/50 transition-colors text-left"
              >
                <div>
                  <h4 className="font-medium text-foreground">Find Sensory Rooms</h4>
                  <p className="text-sm text-foreground/60">Quiet, low-light spaces for fans with autism.</p>
                </div>
                <Ear className="w-5 h-5 text-primary" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
