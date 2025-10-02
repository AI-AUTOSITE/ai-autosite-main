// app/tools/unit-converter/guide.tsx

import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  AlertCircle, 
  BookOpen, 
  Ruler,
  Scale,
  Thermometer,
  Droplets,
  Globe,
  ChefHat,
  Sparkles,
  ArrowUpDown,
  Calculator,
  Lightbulb,
  Target,
  Info
} from 'lucide-react';

interface GuideProps {
  onClose?: () => void;
}

export default function UnitConverterGuide({ onClose }: GuideProps) {
  const [copiedExample, setCopiedExample] = useState<string | null>(null);

  const conversionExamples = {
    mile_to_km: "1 mile = 1.609 km",
    pound_to_kg: "1 pound = 454 grams",
    celsius_to_fahrenheit: "0°C = 32°F",
    cup_to_ml: "1 cup = 237 mL"
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedExample(id);
    setTimeout(() => setCopiedExample(null), 2000);
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 max-h-[80vh] overflow-hidden flex flex-col relative w-full max-w-2xl">
      {/* Fixed Header */}
      <div className="p-6 border-b border-white/10 relative">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-2 hover:bg-white/10 rounded-lg transition-colors z-10"
            aria-label="Close guide"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        )}

        {/* Title */}
        <div className="flex items-center gap-3">
          <Ruler className="w-8 h-8 text-blue-400" />
          <h3 className="text-2xl font-bold text-white">Unit Converter Guide</h3>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto flex-1 p-6 space-y-6">
        {/* Overview */}
        <div className="bg-gradient-to-r from-blue-500/10 to-green-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-300">
              <p className="font-semibold mb-1">Convert Any Measurement Instantly</p>
              <p>Switch between metric and imperial units with precision.</p>
              <p className="mt-2">Perfect for cooking, travel, shopping, and DIY projects!</p>
            </div>
          </div>
        </div>

        {/* Categories Overview */}
        <div>
          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-cyan-400" />
            4 Conversion Categories
          </h4>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Length */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Ruler className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">Length</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Meters, kilometers, miles, feet, inches
                  </p>
                </div>
              </div>
            </div>
            
            {/* Weight */}
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Scale className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">Weight</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Kilograms, pounds, ounces, grams
                  </p>
                </div>
              </div>
            </div>

            {/* Temperature */}
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Thermometer className="w-5 h-5 text-orange-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">Temperature</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Celsius, Fahrenheit, Kelvin
                  </p>
                </div>
              </div>
            </div>

            {/* Volume */}
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Droplets className="w-5 h-5 text-cyan-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">Volume</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Liters, gallons, cups, tablespoons
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Common Conversions */}
        <div>
          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-400" />
            Most Used Conversions
          </h4>
          
          <div className="space-y-2">
            {/* Mile to Km */}
            <div className="bg-gray-800/50 border border-white/10 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Travel & Distance</p>
                  <p className="text-sm text-white font-mono">{conversionExamples.mile_to_km}</p>
                </div>
                <button
                  onClick={() => handleCopy(conversionExamples.mile_to_km, 'mile_to_km')}
                  className="p-1.5 hover:bg-white/10 rounded transition-colors"
                >
                  {copiedExample === 'mile_to_km' ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            
            {/* Pound to Kg */}
            <div className="bg-gray-800/50 border border-white/10 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Weight & Shopping</p>
                  <p className="text-sm text-white font-mono">{conversionExamples.pound_to_kg}</p>
                </div>
                <button
                  onClick={() => handleCopy(conversionExamples.pound_to_kg, 'pound_to_kg')}
                  className="p-1.5 hover:bg-white/10 rounded transition-colors"
                >
                  {copiedExample === 'pound_to_kg' ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Temperature */}
            <div className="bg-gray-800/50 border border-white/10 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Weather & Cooking</p>
                  <p className="text-sm text-white font-mono">{conversionExamples.celsius_to_fahrenheit}</p>
                </div>
                <button
                  onClick={() => handleCopy(conversionExamples.celsius_to_fahrenheit, 'celsius_to_fahrenheit')}
                  className="p-1.5 hover:bg-white/10 rounded transition-colors"
                >
                  {copiedExample === 'celsius_to_fahrenheit' ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Cup to mL */}
            <div className="bg-gray-800/50 border border-white/10 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Cooking & Baking</p>
                  <p className="text-sm text-white font-mono">{conversionExamples.cup_to_ml}</p>
                </div>
                <button
                  onClick={() => handleCopy(conversionExamples.cup_to_ml, 'cup_to_ml')}
                  className="p-1.5 hover:bg-white/10 rounded transition-colors"
                >
                  {copiedExample === 'cup_to_ml' ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* How to Use */}
        <div>
          <h4 className="font-semibold text-white mb-3">How to Use This Tool</h4>
          <ol className="space-y-3">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                1
              </span>
              <div>
                <p className="font-medium text-white">Select Category</p>
                <p className="text-sm text-gray-400 mt-1">
                  Choose Length, Weight, Temperature, or Volume
                </p>
              </div>
            </li>
            
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                2
              </span>
              <div>
                <p className="font-medium text-white">Enter Value</p>
                <p className="text-sm text-gray-400 mt-1">
                  Type the number you want to convert
                </p>
              </div>
            </li>
            
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                3
              </span>
              <div>
                <p className="font-medium text-white">Choose Units</p>
                <p className="text-sm text-gray-400 mt-1">
                  Select "From" and "To" units from dropdowns
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                4
              </span>
              <div>
                <p className="font-medium text-white">Get Result Instantly</p>
                <p className="text-sm text-gray-400 mt-1">
                  <ArrowUpDown className="inline w-3 h-3 mr-1" />
                  Use swap button to reverse conversion
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Cooking Conversions */}
        <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <ChefHat className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-orange-300">
              <p className="font-semibold mb-2">Cooking Conversions</p>
              <div className="grid grid-cols-2 gap-2 text-gray-300 text-xs">
                <div>• 1 cup = 240 mL</div>
                <div>• 1 tbsp = 15 mL</div>
                <div>• 1 tsp = 5 mL</div>
                <div>• 1 oz = 28 g</div>
                <div>• 1 cup flour = 125 g</div>
                <div>• 1 cup sugar = 200 g</div>
              </div>
            </div>
          </div>
        </div>

        {/* Pro Tips */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-300">
              <p className="font-semibold mb-2">Pro Tips</p>
              <ul className="space-y-1 text-gray-300">
                <li>• Room temperature is ~20°C or ~70°F</li>
                <li>• Body temperature is 37°C or 98.6°F</li>
                <li>• Water freezes at 0°C (32°F)</li>
                <li>• Water boils at 100°C (212°F)</li>
                <li>• For baking: weight is more accurate than volume</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Common Use Cases */}
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Target className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-indigo-300">
              <p className="font-semibold mb-2">Perfect For:</p>
              <ul className="space-y-1 text-gray-300">
                <li>• Converting international recipes</li>
                <li>• Understanding weather in different countries</li>
                <li>• Shopping with foreign measurements</li>
                <li>• DIY and home improvement projects</li>
                <li>• Academic and scientific calculations</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Reference */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-white font-medium mb-2">Quick Memory Tricks</p>
              <div className="space-y-1 text-xs text-gray-400">
                <p>• Miles to km: multiply by 1.6 (roughly)</p>
                <p>• Kg to pounds: multiply by 2.2</p>
                <p>• Inches to cm: multiply by 2.5</p>
                <p>• °C to °F: double and add 30 (approximate)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export metadata for dynamic loading
export const guideMetadata = {
  title: 'Unit Converter Guide',
  icon: '📏',
  available: true,
};