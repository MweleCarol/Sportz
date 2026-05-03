import { eq, desc } from 'drizzle-orm';
import { db } from '../Config/db/db.js';
import { commentary } from '../Config/db/schema.js';

export class CommentaryService {
  /**
   * Retrieves commentary for a specific match.
   */
  static async getByMatchId(matchId, limit) {
    return await db
      .select()
      .from(commentary)
      .where(eq(commentary.matchId, matchId))
      .orderBy(desc(commentary.createdAt))  
      .limit(limit);
  }

  /**
   * Creates a commentary entry and broadcasts it to the specific match room.
   */
  static async createCommentary(matchId, commentaryData, broadcastFn) {
    const [newCommentary] = await db
      .insert(commentary)
      .values({
        matchId,
        ...commentaryData,
      })
      .returning();  

    if (broadcastFn) {
      try {
        // Only notify users subscribed to THIS specific match ID
        broadcastFn(matchId, newCommentary);  
      } catch (error) {
        console.error('CommentaryService: Broadcast failed', error);
      }
    }

    return newCommentary;
  }
}