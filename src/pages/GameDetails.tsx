import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import MatchCard from "@/components/MatchCard";
import { motion } from "framer-motion";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";

export default function GameDetails() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const game = useQuery(
    api.games.get,
    gameId ? { gameId: gameId as Id<"games"> } : "skip"
  );
  const matches = useQuery(
    api.matches.listByGame,
    gameId ? { gameId: gameId as Id<"games"> } : "skip"
  );
  const joinMatch = useMutation(api.matches.joinMatch);

  const handleJoinMatch = async (matchId: Id<"matches">) => {
    try {
      await joinMatch({ matchId });
      toast.success("Successfully joined the match!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to join match");
    }
  };

  if (!game || !matches) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-background">
      <div className="max-w-lg mx-auto">
        {/* Header with Game Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-48 overflow-hidden"
        >
          <img
            src={game.image}
            alt={game.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 bg-background/80 backdrop-blur cursor-pointer"
            onClick={() => navigate("/home")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{game.icon}</span>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  {game.name}
                </h1>
                <p className="text-sm text-white/80">{game.description}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Matches List */}
        <div className="p-4">
          <h2 className="text-xl font-bold tracking-tight mb-4">
            Available Matches
          </h2>
          <div className="space-y-4">
            {matches.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No matches available for this game
                </p>
              </div>
            ) : (
              matches.map((match) => (
                <MatchCard
                  key={match._id}
                  match={match}
                  onJoin={handleJoinMatch}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
