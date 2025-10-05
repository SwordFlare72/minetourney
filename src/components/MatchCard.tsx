import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Clock, Users, Trophy, Coins } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

interface MatchCardProps {
  match: {
    _id: Id<"matches">;
    title: string;
    status: "upcoming" | "live" | "completed" | "cancelled";
    entryFee: number;
    prizePool: number;
    maxPlayers: number;
    currentPlayers: number;
    startTime: number;
  };
  onJoin?: (matchId: Id<"matches">) => void;
}

export default function MatchCard({ match, onJoin }: MatchCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-green-500";
      case "upcoming":
        return "bg-blue-500";
      case "completed":
        return "bg-gray-500";
      default:
        return "bg-gray-400";
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = timestamp - now.getTime();

    if (diff < 0) return "Started";
    if (diff < 60 * 60 * 1000) {
      return `${Math.floor(diff / (60 * 1000))}m`;
    }
    if (diff < 24 * 60 * 60 * 1000) {
      return `${Math.floor(diff / (60 * 60 * 1000))}h`;
    }
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-2 hover:border-primary transition-colors">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-bold text-lg tracking-tight mb-1">
                {match.title}
              </h3>
              <Badge
                className={`${getStatusColor(match.status)} text-white`}
              >
                {match.status.toUpperCase()}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Coins className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-muted-foreground text-xs">Entry Fee</p>
                <p className="font-semibold">{match.entryFee} coins</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-muted-foreground text-xs">Prize Pool</p>
                <p className="font-semibold">{match.prizePool} coins</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-muted-foreground text-xs">Players</p>
                <p className="font-semibold">
                  {match.currentPlayers}/{match.maxPlayers}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-muted-foreground text-xs">Starts In</p>
                <p className="font-semibold">{formatTime(match.startTime)}</p>
              </div>
            </div>
          </div>

          {match.status === "upcoming" && onJoin && (
            <Button
              onClick={() => onJoin(match._id)}
              className="w-full cursor-pointer"
              disabled={match.currentPlayers >= match.maxPlayers}
            >
              {match.currentPlayers >= match.maxPlayers ? "Full" : "Join Match"}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
