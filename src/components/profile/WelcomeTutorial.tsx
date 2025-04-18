import React, { useState } from 'react';
import { CheckCircleIcon, ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { SparklesIcon, MusicalNoteIcon, UserIcon, CogIcon } from '@heroicons/react/24/solid';

interface WelcomeTutorialProps {
  username: string;
  onComplete: () => void;
  onSkip: () => void;
}

const WelcomeTutorial: React.FC<WelcomeTutorialProps> = ({ 
  username, 
  onComplete, 
  onSkip 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Tutorial steps
  const steps = [
    {
      title: 'Welcome to Your Profile',
      description: `Hey ${username}! 👋 We're excited to have you join our music community. Let's take a quick tour of your new profile features.`,
      icon: <SparklesIcon className="h-8 w-8 text-blue-400" />,
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&h=400&q=80'
    },
    {
      title: 'Customize Your Experience',
      description: 'Make your profile uniquely yours with custom banners, avatars, and color themes that match your personality and music taste.',
      icon: <UserIcon className="h-8 w-8 text-purple-400" />,
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&h=400&q=80'
    },
    {
      title: 'Share Your Music',
      description: 'Create and share playlists that showcase your favorite tracks. Connect with like-minded music lovers and discover new sounds.',
      icon: <MusicalNoteIcon className="h-8 w-8 text-pink-400" />,
      image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&h=400&q=80'
    },
    {
      title: 'Privacy Controls',
      description: 'You\'re in control. Choose who can see your profile, playlists, and activity. Keep your playlists public while maintaining profile privacy.',
      icon: <CogIcon className="h-8 w-8 text-green-400" />,
      image: 'https://images.unsplash.com/photo-1588532063562-5cf0f2635179?auto=format&fit=crop&w=800&h=400&q=80'
    }
  ];

  // Handle completing a step
  const completeStep = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
  };

  // Move to next step
  const handleNext = () => {
    completeStep();
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  // Move to previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Skip the tutorial
  const handleSkip = () => {
    onSkip();
  };

  // Current step data
  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-80">
      <div className="relative bg-gray-900 rounded-lg shadow-xl border border-gray-800 w-full max-w-2xl">
        {/* Close button */}
        <button 
          className="absolute top-2 right-2 text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800"
          onClick={handleSkip}
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        {/* Progress indicator */}
        <div className="flex justify-center p-4 space-x-2">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? 'w-8 bg-blue-500'
                  : completedSteps.includes(index)
                  ? 'w-2 bg-blue-400'
                  : 'w-2 bg-gray-700'
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>

        {/* Image */}
        <div 
          className="h-48 w-full bg-cover bg-center rounded-t-lg relative"
          style={{ backgroundImage: `url(${currentStepData.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
          <div className="absolute bottom-4 left-4 flex items-center space-x-2">
            {currentStepData.icon}
            <span className="text-2xl font-bold text-white">{currentStepData.title}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-white text-lg mb-8">{currentStepData.description}</p>
          
          {/* Action buttons */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                currentStep === 0
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              <ChevronLeftIcon className="h-5 w-5 mr-1" />
              Previous
            </button>
            
            <div className="flex space-x-3">
              <button
                onClick={handleSkip}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-md text-sm font-medium hover:bg-gray-700"
              >
                Skip Tutorial
              </button>
              
              <button
                onClick={handleNext}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    <CheckCircleIcon className="h-5 w-5 mr-1" />
                    Complete
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRightIcon className="h-5 w-5 ml-1" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeTutorial; 