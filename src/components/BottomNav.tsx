import { Home, Trophy, Wallet, User, Coins } from "lucide-react";
import { Link, useLocation } from "react-router";
import { motion } from "framer-motion";

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    { path: "/home", icon: Home, label: "Lobby" },
    { path: "/wallet", icon: Coins, label: "Earn" },
    { path: "/leaderboard", icon: Trophy, label: "Leaderboard" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0e27]/95 backdrop-blur-lg border-t border-cyan-400/20 z-50 shadow-lg shadow-cyan-400/10">
      <div className="max-w-lg mx-auto flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center flex-1 relative cursor-pointer"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center"
              >
                <div className={`p-2 rounded-xl transition-all ${
                  isActive 
                    ? "bg-cyan-400/20" 
                    : "bg-transparent"
                }`}>
                  <Icon
                    className={`h-5 w-5 ${
                      isActive ? "text-cyan-400" : "text-white/50"
                    }`}
                  />
                </div>
                <span
                  className={`text-xs mt-1 font-medium ${
                    isActive ? "text-cyan-400" : "text-white/50"
                  }`}
                >
                  {item.label}
                </span>
              </motion.div>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}