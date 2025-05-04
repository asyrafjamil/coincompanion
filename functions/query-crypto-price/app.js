const { fetchPrice, sendEmail, isEmailValidated } = require('./utils');

/**
▄▖          ▄▖      ▗     ▄▖  ▘    
▌▌▌▌█▌▛▘▌▌  ▌ ▛▘▌▌▛▌▜▘▛▌  ▙▌▛▘▌▛▘█▌
█▌▙▌▙▖▌ ▙▌  ▙▖▌ ▙▌▙▌▐▖▙▌  ▌ ▌ ▌▙▖▙▖
 ▘      ▄▌      ▄▌▌                

* Purpose
 * This Lambda is triggered via an HTTP GET request through API Gateway at the `/price` path.
 * 
 * 1. Fetch the current price of a given cryptocurrency from the CoinGecko API.
 * 2. Retrieve the user's search history and analytics by calling an internal API defined
 *    by the environment variable and send via email.
 *
 * Trigger
 * This Lambda is invoked via AWS API Gateway:
 * - **Method:** GET
 * - **Path:** `/price`
 * - **Required Query Params:**
 *   - `email`: User's email address (used for history lookup).
 *   - `coin`: The CoinGecko ID of the cryptocurrency (e.g., "bitcoin", "ethereum").
 * 
 * Integrated AWS Service(s)
 * 1. AWS SES
 *
 */
exports.lambdaHandler = async (event) => {
  try {
    const { coin: coinId, email } = event.queryStringParameters || {};
    if (!isEmailValidated(email))
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: `Email is not validated`,
        }),
      };

    if (!coinId)
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: `'coin' is required in the query parameter`,
        }),
      };

    const sanitizedCoinId = coinId.toLowerCase();

    const coinHistories = await fetchPrice(sanitizedCoinId, email);
    if (!coinHistories)
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: `The coin ${sanitizedCoinId} you have entered is not found`,
        }),
      };

    await sendEmail(email, coinHistories);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: coinHistories }),
    };
  } catch (err) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        status: 'error',
        message: err.message,
      }),
    };
  }
};
