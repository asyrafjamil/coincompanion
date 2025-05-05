const microtime = require('microtime');

const {
  getCoinHistoriesDesc,
  getCoinHistoriesAsc,
  analyseCryptoTrend,
  constructHistoriesPayload,
} = require('./utils');

/**
▄▖          ▄▖      ▗     ▖▖▘  ▗         ▄▖  ▘    
▌▌▌▌█▌▛▘▌▌  ▌ ▛▘▌▌▛▌▜▘▛▌  ▙▌▌▛▘▜▘▛▌▛▘▌▌  ▙▌▛▘▌▛▘█▌
█▌▙▌▙▖▌ ▙▌  ▙▖▌ ▙▌▙▌▐▖▙▌  ▌▌▌▄▌▐▖▙▌▌ ▙▌  ▌ ▌ ▌▙▖▙▖
 ▘      ▄▌      ▄▌▌                  ▄▌              

* Purpose
* AWS Lambda handler for retrieving a user's cryptocurrency price search history.
 *
 * Purpose
 * This Lambda is triggered via an internal HTTP GET request through API Gateway at the `/internal/price/history` path.
 * It is designed to be called internally by the GetCryptoPrice Lambda or admin tooling, not directly by public clients.
 *
 * It queries a DynamoDB table (`crypto-price-history-v2`) to fetch historical price searches based on the provided
 * user email and coin name, optionally filtering by price.
 *
 * Trigger
 * This Lambda is invoked via AWS API Gateway:
 * - Method: GET
 * - Path: `/internal/price/history`
 * - Required Query Params:
 *   - email: The user's email address.
 *   - coin: The CoinGecko coin ID (e.g., "bitcoin", "ethereum").
 *   - price: The latest price used for context or matching (e.g., for analytics or trend detection).
 *
 * Permissions
 * This function uses an IAM role with read and write access to the `crypto-price-history` DynamoDB table.
 *
 * DynamoDB Schema
 * - Partition Key: email (String)
 * - Sort Key: timestamp (Number)
 *
 */
exports.lambdaHandler = async (event) => {
  try {
    const { email, coin, price } = event.queryStringParameters;
    const currentTimestamp = microtime.now();

    const coinHistoriesDesc = await getCoinHistoriesDesc({
      email,
      coin,
      price,
      timestamp: currentTimestamp,
    });

    // Handle edge case when there isnt sufficient amount for analytics
    if (Array.isArray(coinHistoriesDesc) && !coinHistoriesDesc.length) {
      return {
        statusCode: 200,
        body: JSON.stringify([
          constructHistoriesPayload({
            coin,
            latestPrice: price,
            timestamp: currentTimestamp,
          }),
        ]),
      };
    }

    // Sort in ascending to help with oldest to latest trend
    const coinHistoriesAsc = await getCoinHistoriesAsc(email);

    const histories = analyseCryptoTrend(coinHistoriesAsc);

    return {
      statusCode: 200,
      body: JSON.stringify(histories),
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
