import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import GameCard from "@/components/GameCard";
import { motion } from "framer-motion";

export default function Home() {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const games = useQuery(api.games.list);

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
              <img src="/logo.svg" alt="Logo" className="h-10 w-10" />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Minecraft Tournaments
                </h1>
                <p className="text-sm text-muted-foreground">
                  Choose your game mode
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Games Grid */}
        <div className="p-4 space-y-4">
          {!games ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : games.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No games available</p>
            </div>
          ) : (
            games.map((game, index) => (
              <motion.div
                key={game._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GameCard game={game} />
              </motion.div>
            ))
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
