import { Router } from 'express';
import { CommentaryController } from '../Controller/commentaryContoller.js'; // Matching your filename typo
import { validate } from '../Middleware/validation/validate.js';
// matchIdParamSchema usually lives with other match validations
import { matchIdParamSchema } from '../Middleware/validation/validateMatches.js'; 
// Use commentary-specific schemas here
import { createCommentarySchema, listCommentaryQuerySchema } from '../Middleware/validation/validateCommentary.js';

export const commentaryRouter = Router({ mergeParams: true });  

commentaryRouter.get('/',
  validate(matchIdParamSchema, 'params'),  
  validate(listCommentaryQuerySchema, 'query'),  
  CommentaryController.getByMatch
);

commentaryRouter.post('/',
  validate(matchIdParamSchema, 'params'),  
  validate(createCommentarySchema, 'body'),  
  CommentaryController.create
);