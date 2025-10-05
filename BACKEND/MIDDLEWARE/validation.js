import { body, validationResult } from 'express-validator';

// Middleware to run the validation checks
export const validateContactForm = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required.')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long.'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message cannot be empty.')
    .isLength({ min: 10 })
    .withMessage('Message must be at least 10 characters long.'),
];

// Middleware to handle the result of the validation
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
