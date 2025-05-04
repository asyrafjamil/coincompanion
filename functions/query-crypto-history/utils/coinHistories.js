const microtime = require('microtime');

const CryptoPriceHistory = require('../models/CryptoPriceHistory');

const getCoinHistoriesDesc = async ({ email, coin, price }) => {
  try {
    const coinHistoriesDesc = await CryptoPriceHistory.query('email')
      .eq(email)
      .sort('descending')
      .limit(20)
      .exec();

    // Append the latest queried coin by user when the lambda is executed
    await CryptoPriceHistory.create({
      email,
      timestamp: microtime.now(),
      coin,
      price: Number(price),
    });

    return coinHistoriesDesc;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getCoinHistoriesAsc = async (email) => {
  try {
    return CryptoPriceHistory.query('email').eq(email).sort('ascending').exec();
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = {
  getCoinHistoriesDesc,
  getCoinHistoriesAsc,
};
