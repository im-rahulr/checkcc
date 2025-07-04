
import { useState, useEffect } from 'react';
import { Play, Pause, Users, Clock, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import ContributionGraph from '@/components/ContributionGraph';
import LiveUsers from '@/components/LiveUsers';
import SessionTimer from '@/components/SessionTimer';

const Index = () => {
  const [isWorking, setIsWorking] = useState(false);
  const [currentUser] = useState({
    id: 1,
    name: "Alex Chen",
    avatar: "/placeholder.svg",
    initials: "AC"
  });

  const [sessionData, setSessionData] = useState({
    todayHours: 3.5,
    weekHours: 24.5,
    monthHours: 98.2,
    totalSessions: 47
  });

  const handleWorkToggle = () => {
    setIsWorking(!isWorking);
    console.log(`${isWorking ? 'Stopping' : 'Starting'} work session for ${currentUser.name}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Project Workspace</h1>
            <p className="text-gray-600">Collaborate and track your team's productivity</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback className="bg-blue-500 text-white text-sm">
                  {currentUser.initials}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-gray-700">{currentUser.name}</span>
            </div>
          </div>
        </div>

        {/* Main Action Card */}
        <Card className="border-2 border-dashed border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-8">
            <div className="flex flex-col items-center space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                  {isWorking ? "You're in the zone! 🚀" : "Ready to start working?"}
                </h2>
                <p className="text-gray-600">
                  {isWorking 
                    ? "Your session is being tracked. Keep up the great work!" 
                    : "Click the button below to begin tracking your work session"
                  }
                </p>
              </div>

              <Button
                onClick={handleWorkToggle}
                size="lg"
                className={`h-16 px-8 text-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isWorking 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isWorking ? (
                  <>
                    <Pause className="mr-2 h-6 w-6" />
                    Stop Working
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-6 w-6" />
                    Start Working
                  </>
                )}
              </Button>

              {isWorking && <SessionTimer />}
            </div>
          </CardContent>
        </Card>

        {/* Stats and Live Users Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Stats */}
          <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Today</p>
                    <p className="text-2xl font-bold text-gray-900">{sessionData.todayHours}h</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">This Week</p>
                    <p className="text-2xl font-bold text-gray-900">{sessionData.weekHours}h</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">This Month</p>
                    <p className="text-2xl font-bold text-gray-900">{sessionData.monthHours}h</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Sessions</p>
                    <p className="text-2xl font-bold text-gray-900">{sessionData.totalSessions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Users */}
          <LiveUsers />
        </div>

        {/* Contribution Graphs */}
        <ContributionGraph />
      </div>
    </div>
  );
};

export default Index;
