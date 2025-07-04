import { Plus, Lock, Users, Home, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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

const TopNavigation = ({
  currentUser,
  daysLocked,
  onlineUsers,
}: TopNavigationProps) => {
  return (
    <div
      className="flex items-center justify-between p-4 backdrop-blur-sm"
      data-oid="xleo0go"
    >
      {/* Left Side */}
      <div className="flex items-center space-x-4" data-oid="vnzjoq.">
        <Button
          variant="ghost"
          className="text-white/80 hover:text-white hover:bg-white/10"
          data-oid="id0tsy."
        >
          <Plus className="w-4 h-4 mr-2" data-oid="hiyi7w6" />
          Create Your First Project
        </Button>
      </div>

      {/* Center */}
      <div
        className="flex items-center space-x-2 text-white/80"
        data-oid="s31zfe3"
      >
        <Lock className="w-4 h-4" data-oid="l4.s94x" />
        <span className="text-sm" data-oid="x-ql_ul">
          Days Locked In:
        </span>
        <Badge
          variant="secondary"
          className="bg-white/20 text-white border-0"
          data-oid=".yv9ihv"
        >
          {daysLocked}
        </Badge>
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-3" data-oid="5zh35le">
        <Button
          variant="ghost"
          size="icon"
          className="text-white/60 hover:text-white hover:bg-white/10"
          data-oid="3:x.o80"
        >
          <div className="w-4 h-4 bg-white/60 rounded" data-oid="05l0k-q"></div>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-white/60 hover:text-white hover:bg-white/10"
          data-oid="lceww5b"
        >
          <Music className="w-4 h-4" data-oid="jbfwpxt" />
        </Button>
        <Button
          variant="ghost"
          className="text-white/80 hover:text-white hover:bg-white/10"
          data-oid="7rbtt48"
        >
          <Home className="w-4 h-4 mr-2" data-oid="-cd50m5" />
          My Room
        </Button>
        <div
          className="flex items-center space-x-2 text-white/80"
          data-oid="l9l:v1u"
        >
          <Users className="w-4 h-4" data-oid="mfyd30-" />
          <span className="text-sm" data-oid="rfshk7e">
            {onlineUsers} online
          </span>
        </div>
        <Avatar className="h-8 w-8 ring-2 ring-red-500" data-oid="nxd9euo">
          <AvatarImage src={currentUser.avatar} data-oid=".venk.3" />
          <AvatarFallback
            className="bg-red-500 text-white text-sm"
            data-oid="o7t9e_t"
          >
            R
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default TopNavigation;
