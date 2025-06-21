"use client";
import ChatBotWrapper from './chatbot/ChatBot';

export const HotspotDetails = () => {
  return (
    <div className="w-96 bg-slate-800 border-l border-slate-700 p-4 pb-4 space-y-6 overflow-y-auto">
      <div
        className="bg-slate-700 border border-slate-600 flex flex-col justify-between p-2 h-[800px] overflow-hidden rounded-lg"
      >
        <div className="h-full pb-6">
          <ChatBotWrapper />
        </div>

      </div>
    </div>
  );
};
