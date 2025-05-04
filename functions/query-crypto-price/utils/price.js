const axios = require('axios');

const COINGECKO_PRICE_URL = 'https://api.coingecko.com/api/v3/simple/price';

const fetchPrice = async (ids, email) => {
  try {
    const coinPriceCoinGecko = await axios.get(COINGECKO_PRICE_URL, {
      params: {
        vs_currencies: 'usd', // currency is set default to USD
        ids,
      },
    });

    if (coinPriceCoinGecko && Object.keys(coinPriceCoinGecko.data).length === 0)
      return null;

    const currentPrice = coinPriceCoinGecko.data[ids]['usd'];

    const coinHistories = await axios.get(
      process.env.COINCOMPANION_PRICE_HISTORY_URL,
      {
        params: {
          coin: ids,
          email,
          price: currentPrice,
        },
      }
    );

    if (coinHistories && Object.keys(coinHistories.data).length === 0)
      return null;

    return coinHistories.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

module.exports = fetchPrice;
