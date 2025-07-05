
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
  onComplete,
}: TimerInterfaceProps) => {
  const { user, signOut } = useAuth();
  const { totalMinutes } = useTimerSessions();
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

  return (
    <div className="backdrop-blur-sm bg-black/20 rounded-lg py-6 text-center max-w-md mx-auto px-6">
      {/* Header with user info and logout */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-left">
          <p className="text-white/90 text-sm">Welcome back</p>
          <p className="text-white font-medium">
            {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Focus Master'}
          </p>
          <p className="text-white/70 text-xs">
            Total: {formatTotalTime(totalMinutes)}
          </p>
        </div>
        <Button
          onClick={handleLogout}
          variant="ghost"
          size="icon"
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>

      {/* Ready to lock in? Text */}
      <div className="mb-4">
        <p className="text-white/90 text-lg">
          Ready to lock in on your idea?
        </p>
      </div>

      {/* Timer Display */}
      <div className="mb-6">
        <div className="text-6xl md:text-7xl font-mono font-bold text-white tracking-widest">
          {formatTime(seconds)}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        {/* Play/Pause Button */}
        <Button 
          onClick={onToggle} 
          size="lg" 
          className="h-14 w-14 rounded-full bg-green-500/90 hover:bg-green-400/90 text-white border-0 shadow-lg"
        >
          {isWorking ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6 ml-1" />
          )}
        </Button>

        {/* Complete Session Button */}
        <Button 
          onClick={onComplete}
          variant="ghost" 
          size="icon" 
          className="h-14 w-14 rounded-full bg-blue-500/80 hover:bg-blue-400/80 text-white"
          disabled={seconds === 0}
        >
          <Check className="h-6 w-6" />
        </Button>

        {/* Reset Button */}
        <Button 
          onClick={onReset}
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 rounded-full bg-gray-500/50 hover:bg-gray-400/50 text-white"
          disabled={seconds === 0}
        >
          <RotateCcw className="h-5 w-5" />
        </Button>

        {/* Break Mode Toggle */}
        <div className="flex items-center">
          <div 
            onClick={() => setShowBreModes(!showBreModes)}
            className="ml-2 w-12 h-6 bg-gray-600/50 rounded-full p-1 flex items-center cursor-pointer hover:bg-gray-500/50 transition-colors"
          >
            <div 
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                showBreModes ? 'transform translate-x-6' : ''
              }`}
            ></div>
          </div>
        </div>
      </div>

      {/* Break mode options (placeholder for future feature) */}
      {showBreModes && (
        <div className="text-white/70 text-sm">
          Break modes coming soon...
        </div>
      )}
    </div>
  );
};

export default TimerInterface;
