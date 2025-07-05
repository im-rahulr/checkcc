import React, { useState } from "react";
import { Play, Pause, Check, RotateCcw, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTimer } from "@/contexts/TimerContext";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const PersistentTimer = () => {
  const { isWorking, seconds, onToggle, onReset, onComplete, formatTime } = useTimer();
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  // Don't show the timer if no time has been tracked
  if (seconds === 0 && !isWorking) {
    return null;
  }

  // Hide persistent timer on home page (Index page)
  if (location.pathname === '/') {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className={cn(
        "bg-black/80 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl transition-all duration-300 ease-in-out",
        isExpanded ? "px-6 py-4" : "px-4 py-3"
      )}>
        {/* Compact View */}
        {!isExpanded && (
          <div className="flex items-center space-x-3">
            {/* Timer Display */}
            <div className="text-white font-mono font-bold text-lg tracking-wider">
              {formatTime(seconds)}
            </div>
            
            {/* Play/Pause Button */}
            <Button 
              onClick={onToggle} 
              size="sm" 
              className="h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white border-0 shadow-lg transition-all duration-200 hover:scale-105"
            >
              {isWorking ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
            </Button>

            {/* Expand Button */}
            <Button
              onClick={() => setIsExpanded(true)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 rounded-full text-white/70 hover:text-white hover:bg-white/10"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Expanded View */}
        {isExpanded && (
          <div className="space-y-3">
            {/* Header with collapse button */}
            <div className="flex items-center justify-between">
              <div className="text-white/90 text-sm font-medium">Focus Session</div>
              <Button
                onClick={() => setIsExpanded(false)}
                variant="ghost"
                size="sm"
                className="h-6 w-6 rounded-full text-white/70 hover:text-white hover:bg-white/10"
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>

            {/* Timer Display */}
            <div className="text-center">
              <div className="text-white font-mono font-bold text-2xl tracking-widest">
                {formatTime(seconds)}
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-center space-x-2">
              {/* Play/Pause Button */}
              <Button 
                onClick={onToggle} 
                size="sm" 
                className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white border-0 shadow-lg transition-all duration-200 hover:scale-105"
              >
                {isWorking ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
              </Button>

              {/* Complete Session Button */}
              <Button 
                onClick={onComplete} 
                variant="ghost" 
                size="sm" 
                className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white transition-all duration-200 hover:scale-105" 
                disabled={seconds === 0}
              >
                <Check className="h-5 w-5" />
              </Button>

              {/* Reset Button */}
              <Button 
                onClick={onReset} 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 rounded-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-400 hover:to-gray-500 text-white transition-all duration-200 hover:scale-105" 
                disabled={seconds === 0}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            {/* Status indicator */}
            <div className="text-center">
              <div className={cn(
                "inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium",
                isWorking 
                  ? "bg-green-500/20 text-green-300" 
                  : "bg-yellow-500/20 text-yellow-300"
              )}>
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  isWorking ? "bg-green-400 animate-pulse" : "bg-yellow-400"
                )} />
                <span>{isWorking ? "In Progress" : "Paused"}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersistentTimer;
