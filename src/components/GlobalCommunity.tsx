import { useState } from "react";
import { X, Users, Code, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      category: "Code",
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
      category: "Code",
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
      category: "Code",
    },
  ];

  if (!isVisible) return null;

  return (
    <div
      className="fixed top-4 right-4 w-80 backdrop-blur-md bg-black/30 rounded-xl border border-white/10"
      data-oid="n03a8cr"
    >
      <div className="p-4" data-oid="m_y7.u3">
        {/* Header */}
        <div
          className="flex items-center justify-between mb-4"
          data-oid="4m-uxhm"
        >
          <div className="flex items-center space-x-2" data-oid="4u_pf9b">
            <Users className="w-5 h-5 text-white/80" data-oid="8vceeik" />
            <h3 className="text-white font-semibold" data-oid="z1-puhb">
              Global Community
            </h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(false)}
            className="text-white/60 hover:text-white hover:bg-white/10 h-6 w-6"
            data-oid="v6obiwq"
          >
            <X className="w-4 h-4" data-oid="zj2v0hh" />
          </Button>
        </div>

        <p className="text-white/60 text-sm mb-4" data-oid="k1o1eij">
          4 active now
        </p>

        {/* Tabs */}
        <Tabs defaultValue="online" className="w-full" data-oid="r2hll5c">
          <TabsList
            className="grid w-full grid-cols-2 bg-white/10 border-0"
            data-oid="xpzufdk"
          >
            <TabsTrigger
              value="online"
              className="text-white/80 data-[state=active]:bg-white/20 data-[state=active]:text-white"
              data-oid="4r.r.am"
            >
              Online Now
            </TabsTrigger>
            <TabsTrigger
              value="top"
              className="text-white/80 data-[state=active]:bg-white/20 data-[state=active]:text-white"
              data-oid="5vahwqm"
            >
              Top Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="online" className="mt-4" data-oid="vm5la_o">
            <div className="space-y-3" data-oid="es5x74q">
              {topUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors"
                  data-oid="ql6jp79"
                >
                  <div
                    className="flex items-center justify-between"
                    data-oid="pkis.bl"
                  >
                    <div
                      className="flex items-center space-x-3"
                      data-oid="xoza6dm"
                    >
                      <div className="relative" data-oid="lt7a_ei">
                        <Avatar className="h-8 w-8" data-oid="rijuhul">
                          <AvatarImage src={user.avatar} data-oid="et3_trx" />
                          <AvatarFallback
                            className="bg-purple-500 text-white text-xs"
                            data-oid="m2fyx4e"
                          >
                            {user.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className="absolute -top-1 -right-1"
                          data-oid="gxkd_8k"
                        >
                          <Badge
                            className="bg-orange-500 text-white text-xs px-1 py-0 h-5 min-w-0"
                            data-oid="cll7tmr"
                          >
                            🔥 {user.streak}
                          </Badge>
                        </div>
                      </div>
                      <div data-oid="6anqrjf">
                        <p
                          className="text-white font-medium text-sm"
                          data-oid="ac18zo1"
                        >
                          {user.name}
                        </p>
                        <p className="text-white/60 text-xs" data-oid="2cer4dv">
                          {user.time} active
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 ml-11" data-oid="-06qya4">
                    <div
                      className="flex items-center justify-between"
                      data-oid="rcnugys"
                    >
                      <div
                        className="flex items-center space-x-2"
                        data-oid="o5qv_ya"
                      >
                        <span
                          className="text-white/60 text-xs"
                          data-oid="dsx:h1o"
                        >
                          {user.project}
                        </span>
                        {user.project !== "No Project" && (
                          <ExternalLink
                            className="w-3 h-3 text-white/40"
                            data-oid="dl2e.g2"
                          />
                        )}
                      </div>
                    </div>
                    <div
                      className="flex items-center space-x-1 mt-1"
                      data-oid="s:n.e7x"
                    >
                      <Code
                        className="w-3 h-3 text-blue-400"
                        data-oid="79sox-y"
                      />
                      <span
                        className="text-blue-400 text-xs"
                        data-oid="d5z.j22"
                      >
                        {user.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="top" className="mt-4" data-oid="84lh7i-">
            <div className="space-y-3" data-oid="l-9r1hn">
              {topUsers.map((user, index) => (
                <div
                  key={user.id}
                  className="bg-white/5 rounded-lg p-3"
                  data-oid="sgqbl42"
                >
                  <div
                    className="flex items-center justify-between"
                    data-oid="n100wq2"
                  >
                    <div
                      className="flex items-center space-x-3"
                      data-oid="e1nanev"
                    >
                      <div
                        className="text-white/60 font-bold"
                        data-oid="2efp3by"
                      >
                        #{index + 1}
                      </div>
                      <Avatar className="h-8 w-8" data-oid="92:uop8">
                        <AvatarImage src={user.avatar} data-oid="ss0gx20" />
                        <AvatarFallback
                          className="bg-purple-500 text-white text-xs"
                          data-oid="mrr24fl"
                        >
                          {user.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div data-oid="r1hp57m">
                        <p
                          className="text-white font-medium text-sm"
                          data-oid="aaurzko"
                        >
                          {user.name}
                        </p>
                        <p className="text-white/60 text-xs" data-oid="d.qs0jn">
                          {user.time} total
                        </p>
                      </div>
                    </div>
                    <Badge
                      className="bg-orange-500 text-white text-xs"
                      data-oid="gvoy43x"
                    >
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
