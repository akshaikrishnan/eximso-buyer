import React from 'react';
import Image from 'next/image';

interface EmptyStateProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  buttonText: string;
  onButtonClick: () => void;
  errorType?: 'server' | 'notFound' | 'network';
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  subtitle,
  imageUrl,
  buttonText,
  onButtonClick,
  errorType
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
      <Image 
        src={imageUrl}
        alt="Empty state illustration"
        width={256} // Set the width
        height={256} // Set the height
        className="mb-6"
      />
      
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        {title}
      </h2>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {subtitle}
      </p>

      {errorType && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
          {errorType === 'server' && 'Server error occurred. Please try again later.'}
          {errorType === 'network' && 'Network connection issue. Check your internet.'}
          {errorType === 'notFound' && 'The requested resource was not found.'}
        </div>
      )}
      
      <button
        onClick={onButtonClick}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                 transition-colors duration-200"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default EmptyState;