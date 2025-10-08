import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { Loader2, Lock } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

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
      <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] via-[#1a1147] to-[#2d1b69] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  const activeGames = games?.slice(0, 3) || [];
  const comingSoonGames = [
    { name: "Build Battle", icon: "🏗️" },
    { name: "Survival Games", icon: "🗡️" },
    { name: "TNT Run", icon: "💣" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] via-[#1a1147] to-[#2d1b69] pb-20">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold text-white tracking-tight mb-1">
            🔥 Trending Mode
          </h1>
          <p className="text-white/60 text-sm">Choose your battle arena</p>
        </motion.div>

        {/* Active Games Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {!games ? (
            <div className="col-span-3 flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
            </div>
          ) : (
            activeGames.map((game, index) => (
              <motion.div
                key={game._id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/game/${game._id}`)}
                className="cursor-pointer"
              >
                <Card className="relative overflow-hidden border-2 border-cyan-400/50 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-sm shadow-lg shadow-cyan-400/20 hover:shadow-cyan-400/40 transition-all">
                  <div className="aspect-square p-4 flex flex-col items-center justify-center text-center">
                    <div className="text-4xl mb-2">{game.icon}</div>
                    <h3 className="text-white font-bold text-sm tracking-tight leading-tight">
                      {game.name}
                    </h3>
                    <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Coming Soon Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-white/70 text-sm font-semibold mb-3 uppercase tracking-wider">
            Coming Soon
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {comingSoonGames.map((game, index) => (
              <motion.div
                key={game.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Card className="relative overflow-hidden border-2 border-dashed border-white/20 bg-white/5 backdrop-blur-sm">
                  <div className="aspect-square p-4 flex flex-col items-center justify-center text-center opacity-50">
                    <div className="text-3xl mb-2 grayscale">{game.icon}</div>
                    <h3 className="text-white/60 font-semibold text-xs tracking-tight leading-tight">
                      {game.name}
                    </h3>
                    <Lock className="absolute top-2 right-2 w-3 h-3 text-white/40" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 grid grid-cols-3 gap-3"
        >
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-4 text-center">
            <div className="text-2xl font-bold text-cyan-400">1.2K</div>
            <div className="text-xs text-white/60">Active Players</div>
          </Card>
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">48</div>
            <div className="text-xs text-white/60">Live Matches</div>
          </Card>
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">$5K</div>
            <div className="text-xs text-white/60">Prize Pool</div>
          </Card>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}