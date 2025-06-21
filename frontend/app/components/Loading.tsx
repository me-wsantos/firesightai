"use client"
import Image from "next/image";

export default function Loading({ isLoading }: { isLoading: boolean }) {
  return (
    isLoading && 
    <div className="flex items-center justify-center h-32 w-32">
      <Image
        src="/images/loading.gif"
        alt="Loading..."
        width={250}
        height={50}
        className="animate-pulse opacity-20"
      />
    </div>
  )

}