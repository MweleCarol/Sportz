/**
 * A higher-order function that returns a middleware for Zod validation.
 * @param {ZodSchema} schema - The schema to validate against.
 * @param {string} source - Where the data lives ('body', 'query', or 'params').
 */
export const validate = (schema, source = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[source]);

  if (!result.success) {
    return res.status(400).json({ 
      error: `Invalid ${source} data.`, 
      details: result.error.issues 
    });
  }

  // Replace the data with the parsed/transformed version (e.g., strings to numbers)
  req[source] = result.data; 
  next();
};