import React, { useState } from "react";
import { Play, Pause, Check, RotateCcw, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useTimerSessions } from "@/hooks/useTimerSessions";
interface TimerInterfaceProps {
  isWorking: boolean;
  seconds: number;
  onToggle: () => void;
  onReset: () => void;
  onComplete: () => void;
}
const TimerInterface = ({
  isWorking,
  seconds,
  onToggle,
  onReset,
  onComplete
}: TimerInterfaceProps) => {
  const {
    user,
    signOut
  } = useAuth();
  const {
    totalMinutes
  } = useTimerSessions();
  const [showBreModes, setShowBreModes] = useState(false);
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(totalSeconds % 3600 / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  const formatTotalTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  return <div className="backdrop-blur-md bg-black/30 rounded-2xl py-4 text-center max-w-lg mx-auto px-6 border border-white/10">
      {/* Ready to lock in? Text */}
      <div className="mb-3">
        <p className="text-white/90 text-base font-medium">
          Ready to lock in on your idea?
        </p>
      </div>

      {/* Timer Display */}
      <div className="mb-4">
        <div className="text-4xl md:text-5xl font-mono font-bold text-white tracking-wider">
          {formatTime(seconds)}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center space-x-3 mb-3">
        {/* Play/Pause Button */}
        <Button
          onClick={onToggle}
          size="lg"
          className="h-12 w-12 rounded-full bg-green-500 hover:bg-green-400 text-white border-0 shadow-lg transition-all duration-200 hover:scale-105"
        >
          {isWorking ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
        </Button>

        {/* Complete Session Button */}
        <Button
          onClick={onComplete}
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full bg-blue-500 hover:bg-blue-400 text-white transition-all duration-200 hover:scale-105"
          disabled={seconds === 0}
        >
          <Check className="h-4 w-4" />
        </Button>

        {/* Reset Button */}
        <Button
          onClick={onReset}
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full bg-gray-600 hover:bg-gray-500 text-white transition-all duration-200 hover:scale-105"
          disabled={seconds === 0}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        {/* Break Mode Toggle */}
        <div className="flex items-center">
          <div
            onClick={() => setShowBreModes(!showBreModes)}
            className={`w-10 h-5 rounded-full p-0.5 flex items-center cursor-pointer transition-all duration-200 ${
              showBreModes
                ? 'bg-purple-500 hover:bg-purple-400'
                : 'bg-gray-600/70 hover:bg-gray-500/70'
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${showBreModes ? 'transform translate-x-5' : ''}`}></div>
          </div>
        </div>
      </div>

      {/* Break mode options (placeholder for future feature) */}
      {showBreModes && <div className="text-white/70 text-xs">
          Break modes coming soon...
        </div>}
    </div>;
};
export default TimerInterface;