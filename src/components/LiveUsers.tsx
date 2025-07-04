import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Circle } from "lucide-react";

const LiveUsers = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Alex Chen",
      avatar: "/placeholder.svg",
      initials: "AC",
      status: "working",
      sessionTime: "2h 15m",
      currentTask: "Frontend Development",
    },
    {
      id: 2,
      name: "Sarah Wilson",
      avatar: "/placeholder.svg",
      initials: "SW",
      status: "working",
      sessionTime: "1h 42m",
      currentTask: "API Documentation",
    },
    {
      id: 3,
      name: "Marcus Johnson",
      avatar: "/placeholder.svg",
      initials: "MJ",
      status: "idle",
      sessionTime: "45m",
      currentTask: "Code Review",
    },
    {
      id: 4,
      name: "Emma Davis",
      avatar: "/placeholder.svg",
      initials: "ED",
      status: "working",
      sessionTime: "3h 8m",
      currentTask: "Database Design",
    },
    {
      id: 5,
      name: "Ryan Park",
      avatar: "/placeholder.svg",
      initials: "RP",
      status: "break",
      sessionTime: "1h 23m",
      currentTask: "Testing",
    },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user.status === "working") {
            // Randomly update session time
            const minutes = Math.floor(Math.random() * 5) + 1;
            const currentMinutes = parseInt(
              user.sessionTime.split("h ")[1]?.split("m")[0] || "0",
            );
            const hours = parseInt(user.sessionTime.split("h")[0]);
            const newMinutes = currentMinutes + minutes;
            const newHours = newMinutes >= 60 ? hours + 1 : hours;
            const finalMinutes =
              newMinutes >= 60 ? newMinutes - 60 : newMinutes;

            return {
              ...user,
              sessionTime: `${newHours}h ${finalMinutes}m`,
            };
          }
          return user;
        }),
      );
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "working":
        return "text-green-500";
      case "idle":
        return "text-yellow-500";
      case "break":
        return "text-orange-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "working":
        return (
          <Badge
            className="bg-green-100 text-green-800 hover:bg-green-100"
            data-oid="4vggcq5"
          >
            Active
          </Badge>
        );
      case "idle":
        return (
          <Badge
            className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
            data-oid="4kd1t3:"
          >
            Idle
          </Badge>
        );
      case "break":
        return (
          <Badge
            className="bg-orange-100 text-orange-800 hover:bg-orange-100"
            data-oid="4:fdpx6"
          >
            Break
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" data-oid="x62:3sx">
            Offline
          </Badge>
        );
    }
  };

  const activeUsers = users.filter((user) => user.status === "working").length;

  return (
    <Card className="animate-fade-in" data-oid="eqqq64k">
      <CardHeader data-oid="gktzjna">
        <CardTitle
          className="flex items-center justify-between"
          data-oid="4z0y5hq"
        >
          <span data-oid="14dd3cv">Live Activity</span>
          <div className="flex items-center gap-2" data-oid="1s2hctl">
            <Circle
              className="h-3 w-3 text-green-500 fill-current animate-pulse"
              data-oid="tmf-qh5"
            />
            <span
              className="text-sm font-normal text-gray-600"
              data-oid="csebth2"
            >
              {activeUsers} active
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4" data-oid="21o094h">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            data-oid="epzps.r"
          >
            <div className="flex items-center space-x-3" data-oid="rx_sti0">
              <div className="relative" data-oid="-_ahtye">
                <Avatar className="h-10 w-10" data-oid="gy_jqi2">
                  <AvatarImage src={user.avatar} data-oid="rdlw-ih" />
                  <AvatarFallback
                    className="bg-blue-500 text-white text-sm"
                    data-oid="dxgjm:5"
                  >
                    {user.initials}
                  </AvatarFallback>
                </Avatar>
                <Circle
                  className={`absolute -bottom-1 -right-1 h-4 w-4 ${getStatusColor(user.status)} fill-current bg-white rounded-full p-0.5`}
                  data-oid="fgje6il"
                />
              </div>
              <div data-oid="mctt:1x">
                <p className="font-medium text-gray-900" data-oid="_5mdnob">
                  {user.name}
                </p>
                <p className="text-sm text-gray-500" data-oid="iv311_2">
                  {user.currentTask}
                </p>
              </div>
            </div>
            <div className="text-right space-y-1" data-oid="3tqt25y">
              {getStatusBadge(user.status)}
              <p className="text-xs text-gray-500" data-oid="gj0efcy">
                {user.sessionTime}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default LiveUsers;
