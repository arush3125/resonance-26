import { FlaskConical } from "lucide-react";

export const TestModeIndicator = () => {
  const isTestMode = import.meta.env.VITE_TEST_MODE === "true";
  
  if (!isTestMode) return null;
  
  return (
    <div className="fixed top-4 right-4 z-50 bg-yellow-500 text-black px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
      <FlaskConical className="w-4 h-4" />
      <span className="font-semibold">🧪 TEST MODE</span>
    </div>
  );
};
