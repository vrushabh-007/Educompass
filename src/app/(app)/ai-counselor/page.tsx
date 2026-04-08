"use client";

import { CollegeAdvisorChat } from "@/components/ai/college-advisor-chat";

export default function AICounselorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <CollegeAdvisorChat />
      </div>
    </div>
  );
}
