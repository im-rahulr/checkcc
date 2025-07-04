
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TimerInterfaceProps {
  isWorking: boolean;
  seconds: number;
  onToggle: () => void;
}

const TimerInterface = ({ isWorking, seconds, onToggle }: TimerInterfaceProps) => {
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-center">
      {/* Ready to lock in? Text */}
      <div className="mb-8">
        <p className="text-white/80 text-lg mb-6">Ready to lock in?</p>
      </div>

      {/* Timer Display */}
      <div className="mb-8">
        <div className="text-6xl md:text-7xl font-mono font-bold text-white mb-6 tracking-wider">
          {formatTime(seconds)}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center space-x-4">
        {/* Play/Pause Button */}
        <Button
          onClick={onToggle}
          size="lg"
          className={`h-16 w-16 rounded-full ${
            isWorking 
              ? 'bg-red-500/80 hover:bg-red-400/80' 
              : 'bg-green-500/80 hover:bg-green-400/80'
          } text-white border-0 shadow-lg backdrop-blur-sm`}
        >
          {isWorking ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6 ml-1" />
          )}
        </Button>

        {/* Reset Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white backdrop-blur-sm"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>

        {/* Settings Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white backdrop-blur-sm"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default TimerInterface;
