const { Pool } = require('pg');

/**
 * API endpoint to fetch user data from the database
 * 
 * @description Retrieves user information including subscription status, saved quiz results,
 * and total quizzes taken. Creates a new user record if one doesn't exist.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - User's email address
 * @param {Object} res - Express response object
 * 
 * @returns {Object} JSON response containing:
 *   - subscription {string} - User's subscription tier ('free' or 'premium')
 *   - savedResults {Array} - Array of saved quiz results
 *   - quizzesTaken {number} - Total number of quizzes completed
 * 
 * @example
 * // Request
 * POST /api/user-data
 * { "email": "user@example.com" }
 * 
 * // Response
 * {
 *   "subscription": "free",
 *   "savedResults": [],
 *   "quizzesTaken": 0
 * }
 */
module.exports = async (req, res) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Connect to Neon database
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Query user data
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      // Create new user if doesn't exist
      const insertResult = await pool.query(
        `INSERT INTO users (email, subscription, saved_results, quizzes_taken, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW())
         RETURNING *`,
        [email, 'free', JSON.stringify([]), 0]
      );

      return res.status(200).json({
        subscription: insertResult.rows[0].subscription,
        savedResults: [],
        quizzesTaken: 0
      });
    }

    const user = result.rows[0];
    
    return res.status(200).json({
      subscription: user.subscription,
      savedResults: user.saved_results || [],
      quizzesTaken: user.quizzes_taken || 0
    });

  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Failed to load user data' });
  } finally {
    await pool.end();
  }
};
