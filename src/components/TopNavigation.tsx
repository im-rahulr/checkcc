
import { Plus, Lock, Users, Home, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface TopNavigationProps {
  currentUser: {
    id: number;
    name: string;
    avatar: string;
    initials: string;
  };
  daysLocked: number;
  onlineUsers: number;
}

const TopNavigation = ({ currentUser, daysLocked, onlineUsers }: TopNavigationProps) => {
  return (
    <div className="flex items-center justify-between p-4 backdrop-blur-sm">
      {/* Left Side */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          className="text-white/80 hover:text-white hover:bg-white/10"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Your First Project
        </Button>
      </div>

      {/* Center */}
      <div className="flex items-center space-x-2 text-white/80">
        <Lock className="w-4 h-4" />
        <span className="text-sm">Days Locked In:</span>
        <Badge variant="secondary" className="bg-white/20 text-white border-0">
          {daysLocked}
        </Badge>
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/10">
          <div className="w-4 h-4 bg-white/60 rounded"></div>
        </Button>
        <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/10">
          <Music className="w-4 h-4" />
        </Button>
        <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
          <Home className="w-4 h-4 mr-2" />
          My Room
        </Button>
        <div className="flex items-center space-x-2 text-white/80">
          <Users className="w-4 h-4" />
          <span className="text-sm">{onlineUsers} online</span>
        </div>
        <Avatar className="h-8 w-8 ring-2 ring-red-500">
          <AvatarImage src={currentUser.avatar} />
          <AvatarFallback className="bg-red-500 text-white text-sm">
            R
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default TopNavigation;
