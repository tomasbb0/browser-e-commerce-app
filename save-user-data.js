const { Client } = require('pg');

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { email, subscription, savedResults, quizzesTaken } = JSON.parse(event.body);

  if (!email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Email is required' })
    };
  }

  // Connect to Neon database
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();

    // Update or insert user data
    const result = await client.query(
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

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        message: 'User data saved successfully'
      })
    };

  } catch (error) {
    console.error('Database error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save user data' })
    };
  } finally {
    await client.end();
  }
};
