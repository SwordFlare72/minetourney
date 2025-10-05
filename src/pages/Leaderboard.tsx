import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { Loader2, Trophy, Medal } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";

export default function Leaderboard() {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const topPlayers = useQuery(api.leaderboard.getTopPlayers);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (index === 1) return <Medal className="h-5 w-5 text-gray-400" />;
    if (index === 2) return <Medal className="h-5 w-5 text-amber-700" />;
    return null;
  };

  return (
    <div className="min-h-screen pb-20 bg-background">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border"
        >
          <div className="p-4">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Leaderboard</h1>
                <p className="text-sm text-muted-foreground">Top players</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Leaderboard List */}
        <div className="p-4 space-y-3">
          {!topPlayers ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : topPlayers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No players yet</p>
            </div>
          ) : (
            topPlayers.map((player, index) => (
              <motion.div
                key={player._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={index < 3 ? "border-2 border-primary" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8">
                        {getRankIcon(index) || (
                          <span className="font-bold text-muted-foreground">
                            {index + 1}
                          </span>
                        )}
                      </div>
                      <Avatar>
                        <AvatarFallback>
                          {player.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold">{player.username}</p>
                        {player.minecraftUsername && (
                          <p className="text-xs text-muted-foreground">
                            @{player.minecraftUsername}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{player.totalWins}</p>
                        <p className="text-xs text-muted-foreground">wins</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">
                          {player.winRate.toFixed(1)}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          win rate
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
