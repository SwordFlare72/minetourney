import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (!user) return null;

    const matches = await ctx.db
      .query("matchParticipants")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return {
      ...user,
      totalMatches: user.totalMatches || 0,
      totalWins: user.totalWins || 0,
      matchHistory: matches.length,
    };
  },
});

export const updateProfile = mutation({
  args: {
    username: v.optional(v.string()),
    minecraftUsername: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const updates: any = {};
    if (args.username !== undefined) updates.username = args.username;
    if (args.minecraftUsername !== undefined) updates.minecraftUsername = args.minecraftUsername;

    await ctx.db.patch(userId, updates);
    return { success: true };
  },
});
