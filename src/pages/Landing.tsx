import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { Loader2, Swords, Trophy, Users, Zap } from "lucide-react";

export default function Landing() {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/home");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-8"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="flex justify-center"
          >
            <div className="relative">
              <img
                src="./logo.svg"
                alt="Minecraft Tournaments"
                className="h-24 w-24 md:h-32 md:w-32"
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-primary/20 rounded-full"
              />
            </div>
          </motion.div>

          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Minecraft Tournaments
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Compete in epic Minecraft battles, climb the leaderboard, and win amazing prizes!
            </p>
          </div>

          {/* CTA Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              className="text-lg px-8 py-6 cursor-pointer"
              onClick={handleGetStarted}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : isAuthenticated ? (
                "Go to Dashboard"
              ) : (
                "Get Started"
              )}
            </Button>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20"
        >
          {[
            {
              icon: Swords,
              title: "Multiple Game Modes",
              description: "Bedwars, Skywars, UHC, and more!",
              color: "text-red-500",
            },
            {
              icon: Trophy,
              title: "Compete & Win",
              description: "Join tournaments and earn rewards",
              color: "text-yellow-500",
            },
            {
              icon: Users,
              title: "Global Leaderboard",
              description: "Climb the ranks and prove your skills",
              color: "text-blue-500",
            },
            {
              icon: Zap,
              title: "Real-time Matches",
              description: "Live tournaments happening now",
              color: "text-green-500",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-card border-2 border-border rounded-lg p-6 text-center space-y-3"
            >
              <div className="flex justify-center">
                <feature.icon className={`h-12 w-12 ${feature.color}`} />
              </div>
              <h3 className="font-bold text-lg tracking-tight">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Game Modes Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center space-y-8"
        >
          <h2 className="text-3xl font-bold tracking-tight">Popular Game Modes</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Bedwars",
                emoji: "🛏️",
                image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80",
              },
              {
                name: "Skywars",
                emoji: "☁️",
                image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80",
              },
              {
                name: "UHC",
                emoji: "⚔️",
                image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
              },
            ].map((game, index) => (
              <motion.div
                key={game.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative overflow-hidden rounded-lg border-2 border-border h-48 cursor-pointer"
              >
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{game.emoji}</span>
                    <span className="text-white font-bold text-xl">
                      {game.name}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}