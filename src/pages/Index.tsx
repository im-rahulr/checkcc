
import { useState, useEffect } from 'react';
import { Play, Pause, Users, Lock, Code, ShoppingCart, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import TimerInterface from '@/components/TimerInterface';
import GlobalCommunity from '@/components/GlobalCommunity';
import TopNavigation from '@/components/TopNavigation';

const Index = () => {
  const [isWorking, setIsWorking] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [currentUser] = useState({
    id: 1,
    name: "Alex Chen",
    avatar: "/placeholder.svg",
    initials: "AC"
  });

  const [sessionData] = useState({
    daysLocked: 0,
    onlineUsers: 4
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWorking) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorking]);

  const handleWorkToggle = () => {
    setIsWorking(!isWorking);
    if (!isWorking) {
      setSeconds(0);
    }
    console.log(`${isWorking ? 'Stopping' : 'Starting'} work session for ${currentUser.name}`);
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden"
         style={{
           backgroundImage: `url('/lovable-uploads/b918fb64-1e04-4a90-ab61-9487052412ca.png')`
         }}>
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top Navigation */}
        <TopNavigation 
          currentUser={currentUser}
          daysLocked={sessionData.daysLocked}
          onlineUsers={sessionData.onlineUsers}
        />

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-4xl">
            {/* Central Timer Interface */}
            <TimerInterface 
              isWorking={isWorking}
              seconds={seconds}
              onToggle={handleWorkToggle}
            />

            {/* Category Tabs */}
            <div className="flex justify-center mt-8 space-x-1">
              <Button 
                variant="ghost" 
                className="bg-blue-600/80 text-white hover:bg-blue-500/80 px-6 py-2 rounded-full"
              >
                <Code className="w-4 h-4 mr-2" />
                Code
              </Button>
              <Button 
                variant="ghost" 
                className="bg-gray-700/60 text-gray-300 hover:bg-gray-600/60 px-6 py-2 rounded-full"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Market
              </Button>
              <Button 
                variant="ghost" 
                className="bg-gray-700/60 text-gray-300 hover:bg-gray-600/60 px-6 py-2 rounded-full"
              >
                <Palette className="w-4 h-4 mr-2" />
                Design
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side Panel - Global Community */}
        <GlobalCommunity />
      </div>
    </div>
  );
};

export default Index;
