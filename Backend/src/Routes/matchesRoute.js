import { Router } from 'express';
import { MatchController } from '../Controller/matchController.js';
import { validate } from '../Middleware/validation/validate.js'; 
// Change this line to match your filename: validateMatches.js
import { createMatchSchema, listMatchesQuerySchema } from '../Middleware/validation/validateMatches.js';

export const matchRouter = Router();

/**
 * Route: GET /matches
 * Responsibility: List all matches with optional pagination.
 */
matchRouter.get('/', 
  validate(listMatchesQuerySchema, 'query'), // Guard: Check query params before reaching controller
  MatchController.getAll                      // Executor: Run the business logic
);

/**
 * Route: POST /matches
 * Responsibility: Create a new match record.
 */
matchRouter.post('/', 
  validate(createMatchSchema, 'body'),      // Guard: Check request body before reaching controller
  MatchController.create                    // Executor: Run the business logic
);