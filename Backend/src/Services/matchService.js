import { desc } from 'drizzle-orm';
import { db } from '../Config/db/db.js'; // Assuming db.js moved to Config
import { matches } from '../Config/db/schema.js'; // Assuming schema.js moved to Config
import { getMatchStatus } from '../utils/match-status.js';

export class MatchService {
  /**
   * Fetches a list of matches ordered by creation date.
   * @param {number} limit - The maximum number of matches to return.
   */
  static async getAllMatches(limit) {
    return await db
      .select()
      .from(matches)
      .orderBy(desc(matches.createdAt))
      .limit(limit);
  }

  /**
   * Creates a new match and triggers a real-time broadcast.
   * @param {Object} matchData - The validated match data from the controller.
   * @param {Function} broadcastFn - The function used to alert WebSocket clients.
   */
  static async createMatch(matchData, broadcastFn) {
    const { startTime, endTime, homeScore, awayScore } = matchData;

    const [newMatch] = await db.insert(matches).values({
      ...matchData,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      homeScore: homeScore ?? 0,
      awayScore: awayScore ?? 0,
      status: getMatchStatus(startTime, endTime),
    }).returning();

    // Trigger side-effect: Notify subscribers
    if (broadcastFn) {
      try {
        broadcastFn(newMatch);
      } catch (error) {
        console.error('MatchService: Broadcast failed', error);
      }
    }

    return newMatch;
  }
}