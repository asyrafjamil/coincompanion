const analyseCryptoTrend = require('./analytics');
const {
  getCoinHistoriesDesc,
  getCoinHistoriesAsc,
} = require('./coinHistories');
const constructHistoriesPayload = require('./payload');

module.exports = {
  analyseCryptoTrend,
  getCoinHistoriesDesc,
  getCoinHistoriesAsc,
  constructHistoriesPayload,
};
