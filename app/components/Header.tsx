"use client"
import Link from 'next/link';
import { Github } from 'lucide-react';
import Image from 'next/image';
import useAppContext from '../context/appContext';

export const Header = () => {
  const { activeMap, setActiveMap } = useAppContext();

  return (
    <header className="invisible bg-slate-800 border-b border-slate-700 h-20 flex items-center justify-between px-6 md:visible lg:visible">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-auto h-auto rounded-lg flex items-center justify-center">
            <Image
              src="/images/firesight_logo.webp"
              alt="FireSight AI Logo"
              width={250}
              height={50}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div 
          className={`flex items-center gap-3 ${activeMap === "predictive" ? 'bg-orange-500' : 'bg-slate-700' } px-4 py-2 rounded-lg hover:cursor-pointer`}
          onClick={() => setActiveMap('predictive')}
        >
          <span className="font-semibold">🔥 Fire Prediction</span>
        </div>

        <div 
          className={`flex items-center gap-3 ${activeMap === "historical" ? 'bg-orange-500' : 'bg-slate-700' } px-4 py-2 rounded-lg hover:cursor-pointer`}
          onClick={() => setActiveMap('historical')}
        >
          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <span className="font-semibold">Historical Data</span>
        </div>
        
        

        <Link 
          href="https://github.com/Victorlct/firesightai-front" target="_blank"
          className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors cursor-pointer">
            <Github className="w-5 h-5" />
            <span className="text-sm font-medium">GitHub</span>
          </div>
        </Link>
      </div>
    </header>
  );
};
