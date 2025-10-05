import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getBalance = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    return user?.walletBalance || 0;
  },
});

export const getTransactions = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(50);

    return transactions;
  },
});

export const addFunds = mutation({
  args: { amount: v.number() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    if (args.amount <= 0) {
      throw new Error("Amount must be positive");
    }

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const currentBalance = user.walletBalance || 0;
    await ctx.db.patch(userId, {
      walletBalance: currentBalance + args.amount,
    });

    await ctx.db.insert("transactions", {
      userId,
      type: "deposit",
      amount: args.amount,
      description: "Wallet deposit",
      status: "completed",
    });

    return { success: true, newBalance: currentBalance + args.amount };
  },
});
