import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables,

    users: defineTable({
      name: v.optional(v.string()),
      image: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      isAnonymous: v.optional(v.boolean()),
      role: v.optional(roleValidator),
      
      // Gaming profile fields
      username: v.optional(v.string()),
      minecraftUsername: v.optional(v.string()),
      totalWins: v.optional(v.number()),
      totalMatches: v.optional(v.number()),
      rank: v.optional(v.string()),
      walletBalance: v.optional(v.number()),
    }).index("email", ["email"]),

    games: defineTable({
      name: v.string(),
      description: v.string(),
      image: v.string(),
      icon: v.string(),
      isActive: v.boolean(),
      minPlayers: v.number(),
      maxPlayers: v.number(),
    }),

    matches: defineTable({
      gameId: v.id("games"),
      title: v.string(),
      status: v.union(
        v.literal("upcoming"),
        v.literal("live"),
        v.literal("completed"),
        v.literal("cancelled")
      ),
      entryFee: v.number(),
      prizePool: v.number(),
      maxPlayers: v.number(),
      currentPlayers: v.number(),
      startTime: v.number(),
      endTime: v.optional(v.number()),
      winnerId: v.optional(v.id("users")),
    })
      .index("by_game", ["gameId"])
      .index("by_status", ["status"]),

    matchParticipants: defineTable({
      matchId: v.id("matches"),
      userId: v.id("users"),
      placement: v.optional(v.number()),
      kills: v.optional(v.number()),
      deaths: v.optional(v.number()),
      score: v.optional(v.number()),
      reward: v.optional(v.number()),
    })
      .index("by_match", ["matchId"])
      .index("by_user", ["userId"])
      .index("by_match_and_user", ["matchId", "userId"]),

    transactions: defineTable({
      userId: v.id("users"),
      type: v.union(
        v.literal("deposit"),
        v.literal("withdrawal"),
        v.literal("match_entry"),
        v.literal("match_reward")
      ),
      amount: v.number(),
      description: v.string(),
      matchId: v.optional(v.id("matches")),
      status: v.union(
        v.literal("pending"),
        v.literal("completed"),
        v.literal("failed")
      ),
    }).index("by_user", ["userId"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;