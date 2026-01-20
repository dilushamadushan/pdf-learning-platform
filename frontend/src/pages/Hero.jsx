import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  Zap,
  Target,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Zap,
      text: "AI-Powered Learning",
      color: "from-cyan-400 to-blue-500",
    },
    {
      icon: Target,
      text: "Interactive Quizzes",
      color: "from-purple-400 to-pink-500",
    },
    {
      icon: Users,
      text: "Collaborative Study",
      color: "from-blue-400 to-cyan-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-screen">
        <div
          className={`flex items-center justify-center gap-4 mb-12 transition-all duration-1000 transform ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"}`}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/50 animate-bounce-slow">
            <BookOpen className="w-9 h-9 text-white" />
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              PDF Learning Platform
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Transform your PDFs into interactive learning experiences
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center text-center max-w-5xl">
          <div
            className={`transition-all duration-1000 delay-300 transform ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full mb-6 animate-pulse">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">
                AI-Powered Learning Revolution
              </span>
            </div>

            <h1 className="text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Transform
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
                Learning Magic
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Upload any PDF and watch it come alive with AI-generated quizzes,
              interactive flashcards, and personalized study paths. Learning has
              never been this engaging.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-500 ${
                      activeFeature === index
                        ? "bg-gradient-to-r " +
                          feature.color +
                          " border-transparent scale-110 shadow-lg"
                        : "bg-white/5 border-white/10"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${activeFeature === index ? "text-white" : "text-gray-400"}`}
                    />
                    <span
                      className={`text-sm font-medium ${activeFeature === index ? "text-white" : "text-gray-400"}`}
                    >
                      {feature.text}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/home">
                <button className="group px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 hover:scale-105 transition-all duration-300 flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <button className="px-8 py-4 bg-white/5 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes orbit {
          0% {
            transform: rotate(0deg) translateX(120px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(120px) rotate(-360deg);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-orbit {
          animation: orbit 8s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default Hero;