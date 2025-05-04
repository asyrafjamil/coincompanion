const constructHistoriesPayload = require('./payload');

const analyseCryptoTrend = (coinHistoriesAsc) => {
  const groupedByCoin = coinHistoriesAsc.reduce((result, coinHistoryAsc) => {
    if (!result[coinHistoryAsc.coin]) result[coinHistoryAsc.coin] = [];
    result[coinHistoryAsc.coin].push(coinHistoryAsc);
    return result;
  }, {});

  return Object.entries(groupedByCoin).map(([coin, coinArray]) => {
    const [{ price: oldestPrice }, { price: latestPrice }] = [
      coinArray.at(0), // First item
      coinArray.at(-1), // Last item
    ];

    if (coinArray.length < 2) {
      return constructHistoriesPayload({ coin, latestPrice });
    }

    const change = latestPrice - oldestPrice;
    const changePercent = ((change / oldestPrice) * 100).toFixed(2);

    return constructHistoriesPayload({
      coin,
      oldestPrice,
      latestPrice,
      change,
      changePercent,
    });
  });
};

module.exports = analyseCryptoTrend;
