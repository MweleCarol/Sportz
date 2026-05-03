import { MatchService } from '../Services/matchService.js';

const MAX_LIMIT = 100; 

export class MatchController {
  /**
   * Handles GET requests to list matches.
   */
  static async getAll(req, res) {
    try {
      // The data is already validated by middleware at this point
      const { limit = 50 } = req.query;
      const safeLimit = Math.min(limit, MAX_LIMIT);

      const matches = await MatchService.getAllMatches(safeLimit);
      
      res.status(200).json({ data: matches });
    } catch (error) {
      console.error('MatchController.getAll error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * Handles POST requests to create a new match.
   */
  static async create(req, res) {
    try {
      // Extract the broadcast function from the Express app instance
      const broadcastFn = res.app.locals.broadcastMatchCreated;

      // Pass the validated body and the broadcast side-effect to the Service
      const newMatch = await MatchService.createMatch(req.body, broadcastFn);

      res.status(201).json({ data: newMatch });
    } catch (error) {
      console.error('MatchController.create error:', error);
      res.status(500).json({ error: 'Failed to create match' });
    }
  }
}