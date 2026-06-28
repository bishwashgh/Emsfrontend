import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function NotFoundPage() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className="relative min-h-[70vh] overflow-hidden bg-gradient-to-br from-amber-50/80 via-orange-50/80 to-amber-50/80">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-amber-200/30 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-red-200/20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-amber-300/10 blur-3xl"></div>
      </div>

      {/* Floating Ornaments */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 text-4xl animate-float-slow opacity-30">💐</div>
        <div className="absolute bottom-10 right-10 text-4xl animate-float-medium opacity-30">💒</div>
        <div className="absolute top-1/3 right-20 text-3xl animate-float-fast opacity-20">✨</div>
        <div className="absolute bottom-1/3 left-20 text-3xl animate-float-slow opacity-20">🌸</div>
        <div className="absolute top-20 right-1/4 text-2xl animate-float-medium opacity-25">🕊️</div>
        <div className="absolute bottom-20 left-1/3 text-2xl animate-float-slow opacity-25">🎀</div>
      </div>

      <div className="container-app relative flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
        {/* 404 Number with Animation */}
        <div className="relative">
          <div className={`font-display text-8xl font-extrabold md:text-9xl transition-all duration-1000 ${
            animate ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}>
            <span className="bg-gradient-to-r from-red-700 via-amber-600 to-amber-700 bg-clip-text text-transparent">
              404
            </span>
          </div>
          
          {/* Decorative Ring */}
          <div className={`absolute inset-0 -m-8 rounded-full border-4 border-amber-200/30 transition-all duration-1000 ${
            animate ? 'opacity-100 scale-100' : 'opacity-0 scale-150'
          }`}></div>
          <div className={`absolute inset-0 -m-12 rounded-full border-2 border-amber-300/20 transition-all duration-1000 delay-200 ${
            animate ? 'opacity-100 scale-100' : 'opacity-0 scale-150'
          }`}></div>
          
          {/* Floating Hearts */}
          <div className={`absolute -top-8 -right-8 text-4xl transition-all duration-1000 delay-300 ${
            animate ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 -translate-y-10 rotate-45'
          }`}>❤️</div>
          <div className={`absolute -bottom-8 -left-8 text-4xl transition-all duration-1000 delay-400 ${
            animate ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-10 -rotate-45'
          }`}>💖</div>
          <div className={`absolute -top-4 -left-12 text-3xl transition-all duration-1000 delay-500 ${
            animate ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}>✨</div>
          <div className={`absolute -bottom-4 -right-12 text-3xl transition-all duration-1000 delay-600 ${
            animate ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}>✨</div>
        </div>

        {/* Message */}
        <div className={`mt-6 space-y-3 transition-all duration-700 delay-300 ${
          animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl">💔</span>
            <h1 className="font-display text-2xl font-bold text-stone-800 md:text-3xl">
              Page not found
            </h1>
            <span className="text-2xl">💔</span>
          </div>
          
          <p className="text-stone-600 max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist or has moved to another venue.
          </p>
          
          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-3 my-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-300"></div>
            <span className="text-amber-400">◆</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-300"></div>
          </div>
          
          <p className="text-sm text-stone-500">
            Let's get you back to planning your perfect event!
          </p>
        </div>

        {/* Actions */}
        <div className={`mt-8 flex flex-wrap items-center justify-center gap-4 transition-all duration-700 delay-500 ${
          animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-700 via-red-600 to-amber-700 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-700/30 transition-all hover:scale-105 hover:shadow-red-700/40 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to home
          </Link>
          
          <Link 
            to="/venues" 
            className="inline-flex items-center gap-2 rounded-full border border-amber-600/30 bg-white/70 px-8 py-3.5 text-sm font-semibold text-amber-800 shadow-sm backdrop-blur-sm transition-all hover:bg-amber-50 hover:border-amber-600/50 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            Browse venues
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </Link>
        </div>

        {/* Help Text */}
        <div className={`mt-8 transition-all duration-700 delay-700 ${
          animate ? 'opacity-100' : 'opacity-0'
        }`}>
          <p className="text-xs text-stone-400">
            Need help? Contact us at{' '}
            <a href="mailto:support@eventify.com" className="text-amber-600 hover:text-amber-700 hover:underline">
              support@eventify.com
            </a>
          </p>
        </div>
      </div>

      {/* Add custom animations */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(10deg); }
        }
        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 3s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}