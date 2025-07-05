
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTimerSessions } from '@/hooks/useTimerSessions';
import { useTimer } from '@/contexts/TimerContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, TrendingUp, Target, Award, BarChart3, ArrowLeft, Home, Play, Pause } from 'lucide-react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isToday, isThisWeek, isThisMonth } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import ActivityGraph from '@/components/ActivityGraph';

const UserTime = () => {
  const { user } = useAuth();
  const { sessions, totalMinutes, loading } = useTimerSessions();
  const { isWorking, seconds, formatTime } = useTimer();
  const navigate = useNavigate();
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [todayMinutes, setTodayMinutes] = useState(0);
  const [weekMinutes, setWeekMinutes] = useState(0);
  const [monthMinutes, setMonthMinutes] = useState(0);
  const [averageSession, setAverageSession] = useState(0);
  const [longestSession, setLongestSession] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);

  useEffect(() => {
    if (sessions.length > 0) {
      try {
        calculateStats();
        generateChartData();
      } catch (error) {
        console.error('Error processing session data:', error);
      }
    }
  }, [sessions]);

  const calculateStats = () => {
    const completedSessions = sessions.filter(s => s.end_time && s.duration_minutes);
    
    // Today's minutes
    const todayTotal = completedSessions
      .filter(s => isToday(new Date(s.created_at)))
      .reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
    
    // This week's minutes
    const weekTotal = completedSessions
      .filter(s => isThisWeek(new Date(s.created_at)))
      .reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
    
    // This month's minutes
    const monthTotal = completedSessions
      .filter(s => isThisMonth(new Date(s.created_at)))
      .reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
    
    // Average session
    const avgSession = completedSessions.length > 0 
      ? completedSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) / completedSessions.length
      : 0;
    
    // Longest session
    const longest = completedSessions.reduce((max, s) => 
      Math.max(max, s.duration_minutes || 0), 0);
    
    setTodayMinutes(todayTotal);
    setWeekMinutes(weekTotal);
    setMonthMinutes(monthTotal);
    setAverageSession(Math.round(avgSession));
    setLongestSession(longest);
    setTotalSessions(completedSessions.length);
  };

  const generateChartData = () => {
    const completedSessions = sessions.filter(s => s.end_time && s.duration_minutes);
    
    // Weekly data (last 7 days)
    const weekData = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayMinutes = completedSessions
        .filter(s => {
          const sessionDate = new Date(s.created_at);
          return sessionDate.toDateString() === date.toDateString();
        })
        .reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
      
      weekData.push({
        date: format(date, 'MMM dd'),
        minutes: dayMinutes,
        hours: Math.round(dayMinutes / 60 * 10) / 10
      });
    }
    
    // Monthly data (last 30 days)
    const monthData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayMinutes = completedSessions
        .filter(s => {
          const sessionDate = new Date(s.created_at);
          return sessionDate.toDateString() === date.toDateString();
        })
        .reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
      
      monthData.push({
        date: format(date, 'MM/dd'),
        minutes: dayMinutes,
        hours: Math.round(dayMinutes / 60 * 10) / 10
      });
    }
    
    setWeeklyData(weekData);
    setMonthlyData(monthData);
  };

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getSessionBadge = (minutes: number) => {
    if (minutes >= 120) return { text: 'Epic', color: 'bg-purple-500' };
    if (minutes >= 90) return { text: 'Great', color: 'bg-green-500' };
    if (minutes >= 60) return { text: 'Good', color: 'bg-blue-500' };
    if (minutes >= 30) return { text: 'Nice', color: 'bg-yellow-500' };
    return { text: 'Short', color: 'bg-gray-500' };
  };

  if (loading) {
    return (
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden flex items-center justify-center"
        style={{
          backgroundImage: `url('https://www.baltana.com/files/wallpapers-25/Minimalist-Dark-Wallpaper-1920x1080-65049.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-white text-lg">Loading your time data...</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{
        backgroundImage: `url('https://i.pinimg.com/originals/41/2a/78/412a78098d247e244cd3612296ec2be1.gif')`,
      }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-3xl font-bold text-white">Time Analytics</h1>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {/* Current Session Card */}
          <Card className={`bg-white/10 backdrop-blur-md border-white/20 ${isWorking || seconds > 0 ? 'ring-2 ring-green-400/50' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                {isWorking ? (
                  <Pause className="w-8 h-8 text-green-400 animate-pulse" />
                ) : (
                  <Play className="w-8 h-8 text-orange-400" />
                )}
                <div>
                  <p className="text-white/60 text-sm">Current Session</p>
                  <p className="text-white text-xl font-bold">
                    {seconds > 0 ? formatTime(seconds) : '00:00:00'}
                  </p>
                  {isWorking && (
                    <p className="text-green-400 text-xs">● Active</p>
                  )}
                  {!isWorking && seconds > 0 && (
                    <p className="text-orange-400 text-xs">⏸ Paused</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-white/60 text-sm">Today</p>
                  <p className="text-white text-xl font-bold">{formatMinutes(todayMinutes)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-white/60 text-sm">This Week</p>
                  <p className="text-white text-xl font-bold">{formatMinutes(weekMinutes)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-purple-400" />
                <div>
                  <p className="text-white/60 text-sm">This Month</p>
                  <p className="text-white text-xl font-bold">{formatMinutes(monthMinutes)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-white/60 text-sm">All Time</p>
                  <p className="text-white text-xl font-bold">{formatMinutes(totalMinutes)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white/10 border-white/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/20 text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="sessions" className="data-[state=active]:bg-white/20 text-white">
              Sessions
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white/20 text-white">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Stats */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Performance Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-white/80">Total Sessions</span>
                    <span className="text-white font-bold">{totalSessions}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-white/80">Average Session</span>
                    <span className="text-white font-bold">{formatMinutes(averageSession)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-white/80">Longest Session</span>
                    <span className="text-white font-bold">{formatMinutes(longestSession)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-white/80">Daily Average</span>
                    <span className="text-white font-bold">
                      {formatMinutes(Math.round(totalMinutes / Math.max(1, Math.ceil((Date.now() - new Date(user?.created_at || Date.now()).getTime()) / (1000 * 60 * 60 * 24)))))}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Chart Visualization */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Last 7 Days
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {weeklyData.map((day, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-white/60 text-sm w-16">{day.date}</span>
                        <div className="flex-1 bg-white/10 rounded-full h-6 relative">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (day.minutes / Math.max(1, Math.max(...weeklyData.map(d => d.minutes)))) * 100)}%` }}
                          />
                        </div>
                        <span className="text-white text-sm w-12">{formatMinutes(day.minutes)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Recent Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sessions
                    .filter(s => s.end_time && s.duration_minutes)
                    .slice(0, 20)
                    .map((session) => {
                      const badge = getSessionBadge(session.duration_minutes || 0);
                      return (
                        <div key={session.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-white/60" />
                            <div>
                              <p className="text-white font-medium">
                                {formatMinutes(session.duration_minutes || 0)}
                              </p>
                              <p className="text-white/60 text-sm">
                                {format(new Date(session.created_at), 'MMM dd, yyyy - HH:mm')}
                              </p>
                            </div>
                          </div>
                          <Badge className={`${badge.color} text-white`}>
                            {badge.text}
                          </Badge>
                        </div>
                      );
                    })}
                  {sessions.filter(s => s.end_time && s.duration_minutes).length === 0 && (
                    <p className="text-white/60 text-center py-8">No completed sessions yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Activity Graph */}
            <ActivityGraph sessions={sessions} />

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">30-Day Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {monthlyData.filter((_, index) => index % 3 === 0).map((day, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-white/60 text-sm w-16">{day.date}</span>
                      <div className="flex-1 bg-white/10 rounded-full h-4 relative">
                        <div
                          className="bg-gradient-to-r from-green-500 to-purple-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, (day.minutes / Math.max(1, Math.max(...monthlyData.map(d => d.minutes)))) * 100)}%` }}
                        />
                      </div>
                      <span className="text-white text-sm w-12">{formatMinutes(day.minutes)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserTime;
