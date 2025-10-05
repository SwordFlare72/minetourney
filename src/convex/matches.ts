import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const listByGame = query({
  args: { gameId: v.id("games") },
  handler: async (ctx, args) => {
    const matches = await ctx.db
      .query("matches")
      .withIndex("by_game", (q) => q.eq("gameId", args.gameId))
      .order("desc")
      .collect();

    return matches;
  },
});

export const get = query({
  args: { matchId: v.id("matches") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.matchId);
  },
});

export const joinMatch = mutation({
  args: { matchId: v.id("matches") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const match = await ctx.db.get(args.matchId);
    if (!match) throw new Error("Match not found");

    if (match.status !== "upcoming") {
      throw new Error("Cannot join this match");
    }

    if (match.currentPlayers >= match.maxPlayers) {
      throw new Error("Match is full");
    }

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const walletBalance = user.walletBalance || 0;
    if (walletBalance < match.entryFee) {
      throw new Error("Insufficient balance");
    }

    // Check if already joined
    const existing = await ctx.db
      .query("matchParticipants")
      .withIndex("by_match_and_user", (q) =>
        q.eq("matchId", args.matchId).eq("userId", userId)
      )
      .first();

    if (existing) {
      throw new Error("Already joined this match");
    }

    // Deduct entry fee
    await ctx.db.patch(userId, {
      walletBalance: walletBalance - match.entryFee,
    });

    // Create transaction
    await ctx.db.insert("transactions", {
      userId,
      type: "match_entry",
      amount: -match.entryFee,
      description: `Entry fee for ${match.title}`,
      matchId: args.matchId,
      status: "completed",
    });

    // Add participant
    await ctx.db.insert("matchParticipants", {
      matchId: args.matchId,
      userId,
    });

    // Update match player count
    await ctx.db.patch(args.matchId, {
      currentPlayers: match.currentPlayers + 1,
    });

    return { success: true };
  },
});

export const getParticipants = query({
  args: { matchId: v.id("matches") },
  handler: async (ctx, args) => {
    const participants = await ctx.db
      .query("matchParticipants")
      .withIndex("by_match", (q) => q.eq("matchId", args.matchId))
      .collect();

    const participantsWithUsers = await Promise.all(
      participants.map(async (p) => {
        const user = await ctx.db.get(p.userId);
        return { ...p, user };
      })
    );

    return participantsWithUsers;
  },
});
