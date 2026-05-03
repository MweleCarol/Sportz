import { CommentaryService } from '../Services/commentaryService.js';

const MAX_LIMIT = 100;

export class CommentaryController {
  /**
   * Handles GET requests for commentary tied to a specific match.
   */
  static async getByMatch(req, res) {
    try {
      const { id: matchId } = req.params;
      const { limit = 10 } = req.query;
      const safeLimit = Math.min(limit, MAX_LIMIT);

      const results = await CommentaryService.getByMatchId(matchId, safeLimit);
      res.status(200).json({ data: results });
    } catch (error) {
      console.error('CommentaryController.getByMatch error:', error);
      res.status(500).json({ error: 'Failed to fetch commentary.' });
    }
  }

  /**
   * Handles POST requests to create new commentary and broadcast it.
   */
  static async create(req, res) {
    try {
      const { id: matchId } = req.params;
      // Access the broadcast function defined in index.js via app.locals
      const broadcastFn = res.app.locals.broadcastCommentary;

      const result = await CommentaryService.createCommentary(
        matchId, 
        req.body, 
        broadcastFn
      );

      res.status(201).json({ data: result });
    } catch (error) {
      console.error('CommentaryController.create error:', error);
      res.status(500).json({ error: 'Failed to create commentary.' });
    }
  }
}