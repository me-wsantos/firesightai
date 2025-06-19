"use client";
import { Card } from './Card';
import { SendHorizonal } from 'lucide-react';

export const HotspotDetails = () => {
  return (
    <div className="w-96 bg-slate-800 border-l border-slate-700 p-6 space-y-6 overflow-y-auto">
      <Card className="bg-slate-700 border-slate-600 flex flex-col justify-between p-4 h-full">
        <div className="flex items-center justify-between mb-3 bg-slate-600 p-1 rounded-md">
          <h4 className=" text-gray-300 text-sm">
            🤖 Hello! Welcome to the Virtual Assistant for Fire Prevention and Safety. 
            I&apos;m here to help you clarify any questions and provide reliable information on fire-related topics. Just ask me!
            I&apos;m ready to offer clear and objective guidance. Your safety is our top priority.
          </h4>
        </div>

        <div className="text-center h-24 bg-slate-900">
          <textarea 
            name=""
            id=""
            rows={3}
            maxLength={90}
            placeholder="Ask a question..."
            className="w-full h-full bg-transparent text-white placeholder:text-slate-400 border-none outline-none px-3 py-2 rounded-md border border-white resize-none"
          />
          <SendHorizonal 
            className="w-5 h-5 text-gray-500 cursor-pointer absolute right-12 bottom-6" 
            xlinkTitle='Send your question'
          />
        </div>
      </Card>
    </div>
  );
};
