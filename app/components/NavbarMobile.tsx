"use client"
import { useState } from 'react'
import Image from 'next/image';
import useAppContext from '../context/appContext';
import { Menu, X, Github } from 'lucide-react';
import Link from 'next/link';

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
        <div className="w-full flex flex-col items-end py-4 px-6 bg-custom-blue-light 1sm:items-end bg-gray-600">

          <div
            className="w-[50%] flex justify-between text-base text-end text-white p-2 hover:text-blue-300 bg-gray-800 rounded-xl"
            onClick={() => [setActiveMap('predictive'), setShowMenu(false)]}
          >
            <div className="w-6 h-6  flex items-center justify-center mr-4 pl-3">
              🔥
            </div>
            <span className="pr-4">Fire Prediction</span>
          </div>

          <div
            className="w-[50%] flex justify-between text-base text-end text-white p-2 hover:text-blue-300 bg-gray-800 rounded-xl mt-2"
            onClick={() => [setActiveMap('historical'), setShowMenu(false)]}
          >
            <div className="w-6 h-6  flex items-center justify-center mr-4 pl-3">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            </div>
            <span className="pr-4">Historical Data</span>
          </div>

          <div
            className="w-[50%] flex justify-between text-base text-end text-white p-2 hover:text-blue-300 bg-gray-800 rounded-xl mt-2"
          >
            <div className="w-6 h-6  flex items-center justify-center mr-4">
              <Github className="w-10 h-10 ml-2" color='#f97316' />
            </div>
            <Link
              href="https://github.com/devcaiada/firesightai/tree/main" target="_blank"
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <span className="pr-4">GitHub</span>
            </Link>
          </div>

        </div>
      }

    </nav>
  )
}