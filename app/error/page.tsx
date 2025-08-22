"use client"

// pages/error.tsx
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const ErrorPage = () => {
  const router = useRouter();
  const params = useParams();
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    // Get the message query parameter from the URL
    const { message } = params;
    if (message && typeof message === 'string') {
      // Decode the message and set it to state
      setErrorMessage(decodeURIComponent(message));
    } else {
      setErrorMessage('An unexpected error occurred. Please try again or contact support.');
    }
  }, [params]); // Re-run effect if router.query changes

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen p-4 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center border-l-4 border-red-500">
        <div className="flex flex-col items-center mb-6">
          {/* Error Icon using SVG */}
          <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h1 className="text-3xl font-bold text-gray-800 mt-4">Oops! Something went wrong.</h1>
        </div>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          {errorMessage}
        </p>
        
        <button
          onClick={() => router.push('/')}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
