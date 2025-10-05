import { mutation } from "./_generated/server";

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if games already exist
    const existingGames = await ctx.db.query("games").first();
    if (existingGames) {
      return { message: "Data already seeded" };
    }

    // Create games
    const bedwars = await ctx.db.insert("games", {
      name: "Bedwars",
      description: "Protect your bed and destroy enemy beds to win!",
      image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80",
      icon: "🛏️",
      isActive: true,
      minPlayers: 2,
      maxPlayers: 16,
    });

    const skywars = await ctx.db.insert("games", {
      name: "Skywars",
      description: "Battle on floating islands in the sky!",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80",
      icon: "☁️",
      isActive: true,
      minPlayers: 2,
      maxPlayers: 12,
    });

    const uhc = await ctx.db.insert("games", {
      name: "UHC",
      description: "Ultra Hardcore survival mode - no regeneration!",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
      icon: "⚔️",
      isActive: true,
      minPlayers: 2,
      maxPlayers: 100,
    });

    const buildBattle = await ctx.db.insert("games", {
      name: "Build Battle",
      description: "Show off your building skills!",
      image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&q=80",
      icon: "🏗️",
      isActive: true,
      minPlayers: 2,
      maxPlayers: 8,
    });

    // Create sample matches
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    await ctx.db.insert("matches", {
      gameId: bedwars,
      title: "Bedwars Solo Championship",
      status: "upcoming",
      entryFee: 100,
      prizePool: 1500,
      maxPlayers: 16,
      currentPlayers: 8,
      startTime: now + oneHour,
    });

    await ctx.db.insert("matches", {
      gameId: bedwars,
      title: "Bedwars Team Battle",
      status: "live",
      entryFee: 50,
      prizePool: 800,
      maxPlayers: 16,
      currentPlayers: 16,
      startTime: now - oneHour / 2,
    });

    await ctx.db.insert("matches", {
      gameId: skywars,
      title: "Skywars Mega Tournament",
      status: "upcoming",
      entryFee: 75,
      prizePool: 1000,
      maxPlayers: 12,
      currentPlayers: 5,
      startTime: now + oneHour * 2,
    });

    await ctx.db.insert("matches", {
      gameId: uhc,
      title: "UHC Survival Challenge",
      status: "upcoming",
      entryFee: 200,
      prizePool: 5000,
      maxPlayers: 100,
      currentPlayers: 45,
      startTime: now + oneHour * 3,
    });

    return { message: "Data seeded successfully" };
  },
});
