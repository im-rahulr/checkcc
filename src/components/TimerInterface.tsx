import React from "react";
import { Play, Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
interface TimerInterfaceProps {
  isWorking: boolean;
  seconds: number;
  onToggle: () => void;
}
const TimerInterface = ({
  isWorking,
  seconds,
  onToggle
}: TimerInterfaceProps) => {
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(totalSeconds % 3600 / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  return <div data-oid="8-d5j.p" className="backdrop-blur-sm bg-black/20 rounded-lg py-6 text-center max-w-md mx-auto px-0">
      {/* Ready to lock in? Text */}
      <div className="mb-4" data-oid="vopblin">
        <p className="text-white/90 text-lg" data-oid="5gvdtke">
          Ready to lock in on your idea?
        </p>
      </div>

      {/* Timer Display */}
      <div className="mb-6" data-oid="zuzm-ks">
        <div className="text-6xl md:text-7xl font-mono font-bold text-white tracking-widest" data-oid="93csmm7">
          {formatTime(seconds)}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center space-x-4 mb-6" data-oid="puolput">
        {/* Play Button */}
        <Button onClick={onToggle} size="lg" className="h-14 w-14 rounded-full bg-green-500/90 hover:bg-green-400/90 text-white border-0 shadow-lg" data-oid="eaov.6q">
          <Play className="h-6 w-6 ml-1" data-oid="vk2w3tv" />
        </Button>

        {/* Check/Confirm Button */}
        <Button variant="ghost" size="icon" className="h-14 w-14 rounded-full bg-blue-500/80 hover:bg-blue-400/80 text-white" data-oid="lq:x3jg">
          <Check className="h-6 w-6" data-oid="b0c73s8" />
        </Button>

        {/* Timer Toggle Switch */}
        <div className="flex items-center" data-oid="w1:k:jo">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-gray-500/50 hover:bg-gray-400/50 text-white" data-oid="-7q.72b">
            <RotateCcw className="h-5 w-5" data-oid="69x3q:5" />
          </Button>
          <div className="ml-2 w-12 h-6 bg-gray-600/50 rounded-full p-1 flex items-center" data-oid="h1ljg7n">
            <div className="w-4 h-4 rounded-full bg-white ml-auto" data-oid="7:2dihg"></div>
          </div>
        </div>
      </div>

      {/* Category Tabs - Moved from Index.tsx */}
      
    </div>;
};
export default TimerInterface;