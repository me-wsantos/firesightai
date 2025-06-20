"use client"
import { useState } from 'react'
import Image from 'next/image';
import useAppContext from '../context/appContext';
import { Menu, X } from 'lucide-react';

export const NavbarMobile = () => {
  const [showMenu, setShowMenu] = useState(false)
  const { setActiveMap } = useAppContext()

  const handleShowMenu = (mobile: boolean) => {
    if (mobile) setShowMenu(!showMenu);
  }

  return (
    <nav className="w-auto px-0 h-12 fixed top-0 right-0 left-0 z-10 p-3 mt-0 bg-custom-blue md:invisible lg:h-0">
      <div className="w-full flex justify-between px-6">
        <div className="w-auto h-auto rounded-lg flex items-center justify-center">
          <Image
            src="/images/firesight_logo.webp"
            alt="FireSight AI Logo"
            width={250}
            height={50}
            className="rounded-lg"
          />
        </div>
        <div className='flex justify-end py-0 px-2'>
          <div className="ml-4">
            {showMenu ?
              <X size={30} color='#ffff' onClick={() => handleShowMenu(true)} />
              :
              <Menu size={30} color='#ffff' onClick={() => handleShowMenu(true)} />
            }
          </div>
        </div>
      </div>

      {showMenu &&
        <div className="w-full flex justify-between py-4 px-6 bg-custom-blue-light 1sm:items-end bg-gray-600">

          <div
            className="w-[50%] flex justify-end text-base text-end text-white p-2 hover:text-blue-300 bg-gray-800 rounded-xl mr-2 "
            onClick={() => [setActiveMap('predictive'), setShowMenu(false)]}
          >
            <div className="w-6 h-6  flex items-center justify-center mr-4">
              🔥
            </div>
              <span>Fire Prediction</span>
          </div>

          <div
            className="w-[50%] flex justify-end text-base text-end text-white p-2 hover:text-blue-300 bg-gray-800 rounded-xl ml-2 "
            onClick={() => [setActiveMap('historical'), setShowMenu(false)]}
          >
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-4">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <span>Historical Data</span>
          </div>

        </div>
      }
    </nav>
  )
}