"use client"

import { NavbarMobile } from "./components/NavbarMobile";
import { Navbar } from "./components/Navbar";
import { FilterSidebar } from "./components/FilterSidebar";
import { HotspotDetails } from "./components/HotspotDetails";
import dynamic from "next/dynamic";
import useAppContext from "./context/appContext";

// Importa o componente sem SSR
const MapViewPredictive = dynamic(
  () => import("./components/MapViewPredictive").then((mod) => mod.MapViewPredictive),
  { 
    ssr: false, // 👈 Desabilita server-side rendering
    loading: () => (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '600px' 
      }}>
        <p>Load map...</p>
      </div>
    )
  }
);

// Importa o componente sem SSR
const MapViewHistorical = dynamic(
  () => import("./components/MapViewHistorical").then((mod) => mod.MapViewHistorical),
  { 
    ssr: false, // 👈 Desabilita server-side rendering
    loading: () => (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '600px' 
      }}>
        <p>Load map...</p>
      </div>
    )
  }
);

export default function Home() {
  const { activeMap } = useAppContext();
  
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar />
      <NavbarMobile />
      
      <div className="flex flex-col md:flex-row lg:h-[calc(100vh-60px)]">
        <FilterSidebar />
        <main className="flex-1 relative mt-12">
          { activeMap === "predictive" ? <MapViewPredictive /> : <MapViewHistorical /> }
          
        </main>
        <HotspotDetails />
      </div>
    </div>
  );
}
