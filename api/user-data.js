const { Client } = require('pg');

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { email } = JSON.parse(event.body);

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

    // Query user data
    const result = await client.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      // Create new user if doesn't exist
      const insertResult = await client.query(
        `INSERT INTO users (email, subscription, saved_results, quizzes_taken, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW())
         RETURNING *`,
        [email, 'free', JSON.stringify([]), 0]
      );

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: insertResult.rows[0].subscription,
          savedResults: [],
          quizzesTaken: 0
        })
      };
    }

    const user = result.rows[0];
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscription: user.subscription,
        savedResults: user.saved_results || [],
        quizzesTaken: user.quizzes_taken || 0
      })
    };

  } catch (error) {
    console.error('Database error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to load user data' })
    };
  } finally {
    await client.end();
  }
};
