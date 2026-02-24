import { useEffect, useState } from 'react';
import { Leaf } from 'lucide-react';

interface LoadingPageProps {
  onLoadingComplete: () => void;
}

const LoadingPage = ({ onLoadingComplete }: LoadingPageProps) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');

  useEffect(() => {
    const loadingSteps = [
      { progress: 20, text: 'Loading sustainable solutions...' },
      { progress: 40, text: 'Connecting green innovators...' },
      { progress: 60, text: 'Preparing eco-friendly content...' },
      { progress: 80, text: 'Finalizing green experience...' },
      { progress: 100, text: 'Welcome to Green Life Expo!' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        const step = loadingSteps[currentStep];
        setProgress(step.progress);
        setLoadingText(step.text);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onLoadingComplete();
        }, 500);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center z-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-green-500 animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 rounded-full bg-green-400 animate-pulse delay-300"></div>
        <div className="absolute bottom-20 left-32 w-12 h-12 rounded-full bg-green-600 animate-pulse delay-700"></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 rounded-full bg-green-300 animate-pulse delay-500"></div>
      </div>

      <div className="text-center space-y-8 max-w-md mx-auto px-6">
        {/* Logo Animation */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-500 rounded-full animate-spin-slow opacity-20"></div>
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Leaf className="w-10 h-10 text-green-600 animate-bounce" />
            </div>
          </div>
          
          {/* Ripple Effect */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-32 h-32 border-2 border-green-300 rounded-full animate-ping opacity-30"></div>
            <div className="absolute inset-0 w-40 h-40 border border-green-200 rounded-full animate-ping opacity-20 delay-300"></div>
          </div>
        </div>

        {/* Brand Name */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            Green Life Expo
          </h1>
          <p className="text-green-600 font-medium text-lg">
            Egypt's Leading Sustainable Living Exhibition
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-4">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 animate-pulse">{loadingText}</span>
            <span className="text-green-600 font-semibold">{progress}%</span>
          </div>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-200"></div>
        </div>

        {/* Tagline */}
        <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
          Connecting sustainable businesses with eco-conscious consumers across the Middle East
        </p>
      </div>

      {/* Bottom Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-600"></div>
    </div>
  );
};

export default LoadingPage;