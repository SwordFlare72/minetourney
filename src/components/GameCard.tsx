import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { Link } from "react-router";

interface GameCardProps {
  game: {
    _id: string;
    name: string;
    description: string;
    image: string;
    icon: string;
    minPlayers: number;
    maxPlayers: number;
  };
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <Link to={`/game/${game._id}`} className="cursor-pointer">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Card className="overflow-hidden border-2 hover:border-primary transition-colors">
          <div className="relative h-40 overflow-hidden">
            <img
              src={game.image}
              alt={game.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{game.icon}</span>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {game.name}
                </h3>
              </div>
            </div>
          </div>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-3">
              {game.description}
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {game.minPlayers}-{game.maxPlayers} Players
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
