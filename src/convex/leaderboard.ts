import { query } from "./_generated/server";

export const getTopPlayers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    
    const rankedUsers = users
      .filter((u) => !u.isAnonymous && u.totalMatches && u.totalMatches > 0)
      .map((u) => ({
        _id: u._id,
        username: u.username || u.name || "Anonymous",
        minecraftUsername: u.minecraftUsername,
        totalWins: u.totalWins || 0,
        totalMatches: u.totalMatches || 0,
        winRate: u.totalMatches ? ((u.totalWins || 0) / u.totalMatches) * 100 : 0,
        rank: u.rank || "Unranked",
      }))
      .sort((a, b) => b.totalWins - a.totalWins)
      .slice(0, 100);

    return rankedUsers;
  },
});
