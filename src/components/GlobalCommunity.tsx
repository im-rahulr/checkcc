
import { useState } from 'react';
import { X, Users, Code, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const GlobalCommunity = () => {
  const [isVisible, setIsVisible] = useState(true);

  const topUsers = [
    {
      id: 1,
      name: "blankform studios",
      avatar: "/placeholder.svg",
      initials: "BS",
      streak: "3x",
      time: "10h 47m",
      status: "active",
      project: "example.com",
      category: "Code"
    },
    {
      id: 2,
      name: "Paulius",
      avatar: "/placeholder.svg",
      initials: "P",
      streak: "2x",
      time: "7h 41m",
      status: "active",
      project: "clockout.gg",
      category: "Code"
    },
    {
      id: 3,
      name: "Rapture godson",
      avatar: "/placeholder.svg",
      initials: "RG",
      streak: "1x",
      time: "5h 11m",
      status: "active",
      project: "No Project",
      category: "Code"
    }
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 w-80 backdrop-blur-md bg-black/30 rounded-xl border border-white/10">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-white/80" />
            <h3 className="text-white font-semibold">Global Community</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(false)}
            className="text-white/60 hover:text-white hover:bg-white/10 h-6 w-6"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-white/60 text-sm mb-4">4 active now</p>

        {/* Tabs */}
        <Tabs defaultValue="online" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 border-0">
            <TabsTrigger 
              value="online" 
              className="text-white/80 data-[state=active]:bg-white/20 data-[state=active]:text-white"
            >
              Online Now
            </TabsTrigger>
            <TabsTrigger 
              value="top" 
              className="text-white/80 data-[state=active]:bg-white/20 data-[state=active]:text-white"
            >
              Top Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="online" className="mt-4">
            <div className="space-y-3">
              {topUsers.map((user) => (
                <div key={user.id} className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-purple-500 text-white text-xs">
                            {user.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -top-1 -right-1">
                          <Badge className="bg-orange-500 text-white text-xs px-1 py-0 h-5 min-w-0">
                            🔥 {user.streak}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{user.name}</p>
                        <p className="text-white/60 text-xs">{user.time} active</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2 ml-11">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-white/60 text-xs">{user.project}</span>
                        {user.project !== "No Project" && (
                          <ExternalLink className="w-3 h-3 text-white/40" />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <Code className="w-3 h-3 text-blue-400" />
                      <span className="text-blue-400 text-xs">{user.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="top" className="mt-4">
            <div className="space-y-3">
              {topUsers.map((user, index) => (
                <div key={user.id} className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-white/60 font-bold">#{index + 1}</div>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-purple-500 text-white text-xs">
                          {user.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white font-medium text-sm">{user.name}</p>
                        <p className="text-white/60 text-xs">{user.time} total</p>
                      </div>
                    </div>
                    <Badge className="bg-orange-500 text-white text-xs">
                      🔥 {user.streak}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GlobalCommunity;
