import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AssemblyGuide from './components/AssemblyGuide';
import SafetySection from './components/SafetySection';
import AiAssistant from './components/AiAssistant';
import Maintenance from './components/Maintenance';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import { Tab } from './types';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.HOME);
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [shouldUnmountSplash, setShouldUnmountSplash] = useState(false);

  useEffect(() => {
    // Show splash for 2 seconds then trigger fade out
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
      // Wait for exit animation to complete before unmounting
      setTimeout(() => setShouldUnmountSplash(true), 500);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const renderContent = () => {
    switch (currentTab) {
      case Tab.HOME:
        return <Hero onStartLearning={() => setCurrentTab(Tab.ASSEMBLY)} />;
      case Tab.ASSEMBLY:
        return <AssemblyGuide />;
      case Tab.SAFETY:
        return <SafetySection />;
      case Tab.MAINTENANCE:
        return <Maintenance />;
      case Tab.AI_ASSISTANT:
        return <AiAssistant />;
      default:
        return <Hero onStartLearning={() => setCurrentTab(Tab.ASSEMBLY)} />;
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-50 overflow-hidden relative">
      {/* Startup Splash Screen */}
      {!shouldUnmountSplash && (
        <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-emerald-700 ${!isSplashVisible ? 'animate-splash-exit' : ''}`}>
          <div className="flex flex-col items-center animate-zoom-fade-in">
            <div className="bg-white text-emerald-700 text-6xl font-black px-6 py-2 rounded-2xl shadow-2xl mb-6 transform rotate-[-2deg]">
              BK
            </div>
            <h1 className="text-white text-3xl font-bold tracking-[0.2em]">4301FL</h1>
            <div className="w-12 h-1 bg-white/30 rounded-full mt-4"></div>
            <p className="text-emerald-100 text-xs mt-6 font-light uppercase tracking-widest opacity-80">龍龍龍 專業制作</p>
          </div>
        </div>
      )}

      <Header activeTab={currentTab} onTabChange={setCurrentTab} />
      
      {/* 
        Main content area 
        - flex-grow to fill space
        - pb-16 to account for fixed bottom nav on mobile
        - overflow-y-auto to allow scrolling within main, except for AI Assistant which handles its own scroll
      */}
      <main className={`flex-grow flex flex-col md:pb-0 ${currentTab === Tab.AI_ASSISTANT ? 'overflow-hidden pb-16' : 'overflow-y-auto pb-20'}`}>
        {renderContent()}
        
        {/* Render Footer only if not in AI mode on mobile to save space, or just keep it at bottom of scrollable content */}
        {currentTab !== Tab.AI_ASSISTANT && <Footer />}
      </main>

      <BottomNav activeTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
};

export default App;