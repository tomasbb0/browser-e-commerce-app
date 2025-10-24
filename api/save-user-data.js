const { Pool } = require('pg');

module.exports = async (req, res) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, subscription, savedResults, quizzesTaken } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Connect to Neon database
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Update or insert user data
    const result = await pool.query(
      `INSERT INTO users (email, subscription, saved_results, quizzes_taken, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       ON CONFLICT (email)
       DO UPDATE SET
         subscription = $2,
         saved_results = $3,
         quizzes_taken = $4,
         updated_at = NOW()
       RETURNING *`,
      [email, subscription, JSON.stringify(savedResults), quizzesTaken]
    );

    return res.status(200).json({
      success: true,
      message: 'User data saved successfully'
    });

  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Failed to save user data' });
  } finally {
    await pool.end();
  }
};

