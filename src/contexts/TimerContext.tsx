import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTimerSessions } from '@/hooks/useTimerSessions';
import { toast } from '@/components/ui/use-toast';

interface TimerContextType {
  isWorking: boolean;
  seconds: number;
  currentSessionId: string | null;
  onToggle: () => void;
  onReset: () => void;
  onComplete: () => void;
  formatTime: (totalSeconds: number) => string;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

interface TimerProviderProps {
  children: ReactNode;
}

export const TimerProvider: React.FC<TimerProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { createSession, endSession } = useTimerSessions();
  const [isWorking, setIsWorking] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Timer logic - runs when isWorking is true
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isWorking) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorking]);

  // Load timer state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('timerState');
    if (savedState) {
      try {
        const { isWorking: savedIsWorking, seconds: savedSeconds, currentSessionId: savedSessionId, timestamp } = JSON.parse(savedState);
        
        // Calculate elapsed time since last save
        const now = Date.now();
        const elapsed = Math.floor((now - timestamp) / 1000);
        
        if (savedIsWorking && savedSessionId) {
          setIsWorking(true);
          setSeconds(savedSeconds + elapsed);
          setCurrentSessionId(savedSessionId);
        } else {
          setSeconds(savedSeconds);
          setCurrentSessionId(savedSessionId);
        }
      } catch (error) {
        console.error('Error loading timer state:', error);
      }
    }
  }, []);

  // Save timer state to localStorage whenever it changes
  useEffect(() => {
    const timerState = {
      isWorking,
      seconds,
      currentSessionId,
      timestamp: Date.now()
    };
    localStorage.setItem('timerState', JSON.stringify(timerState));
  }, [isWorking, seconds, currentSessionId]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleWorkToggle = async () => {
    if (!isWorking) {
      // Starting a new session
      const session = await createSession();
      if (session) {
        setCurrentSessionId(session.id);
        setIsWorking(true);
        setSeconds(0);
        console.log(`Starting work session for ${user?.email}`);
        toast({
          title: 'Timer Started',
          description: 'Focus session has begun. Good luck!',
        });
      }
    } else {
      // Pausing current session
      setIsWorking(false);
      console.log(`Pausing work session for ${user?.email}`);
      toast({
        title: 'Timer Paused',
        description: 'Take a break when you need it.',
      });
    }
  };

  const handleReset = () => {
    setIsWorking(false);
    setSeconds(0);
    setCurrentSessionId(null);
    localStorage.removeItem('timerState');
    toast({
      title: 'Timer Reset',
      description: 'Timer has been reset to zero.',
    });
  };

  const handleComplete = async () => {
    if (currentSessionId && seconds > 0) {
      const durationMinutes = Math.floor(seconds / 60);
      await endSession(currentSessionId, durationMinutes);
      
      // Reset timer after completing session
      setIsWorking(false);
      setSeconds(0);
      setCurrentSessionId(null);
      localStorage.removeItem('timerState');
    }
  };

  const value: TimerContextType = {
    isWorking,
    seconds,
    currentSessionId,
    onToggle: handleWorkToggle,
    onReset: handleReset,
    onComplete: handleComplete,
    formatTime,
  };

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};
