'use client';

import { useState } from 'react';
import { useAccessibility } from '@/hooks/useAccessibility';
import { Accessibility, Type, Contrast, X } from 'lucide-react';

export function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    highContrast, setHighContrast, 
    simplifiedLanguage, setSimplifiedLanguage
  } = useAccessibility();

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300 z-50"
        aria-label="Open Accessibility Menu"
      >
        <Accessibility className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden flex flex-col">
      <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
        <h2 className="font-semibold flex items-center">
          <Accessibility className="w-5 h-5 mr-2" />
          Accessibility
        </h2>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-blue-700 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Close Accessibility Menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* High Contrast Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Contrast className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <p className="font-medium text-sm text-gray-900">High Contrast</p>
              <p className="text-xs text-gray-500">Increase readability</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={highContrast}
              onChange={(e) => setHighContrast(e.target.checked)}
              aria-label="Toggle High Contrast"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Simplified Language Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Type className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <p className="font-medium text-sm text-gray-900">Simple Language</p>
              <p className="text-xs text-gray-500">Easier to understand AI</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={simplifiedLanguage}
              onChange={(e) => setSimplifiedLanguage(e.target.checked)}
              aria-label="Toggle Simplified Language"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

      </div>
    </div>
  );
}
