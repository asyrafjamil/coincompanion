const constructHistoriesPayload = ({
  coin,
  latestPrice,
  oldestPrice = null,
  change = null,
  changePercent = null,
}) => {
  if (!oldestPrice)
    return {
      coin,
      latestPrice,
      trend: 'Not enough data to generate insights.',
    };

  return {
    coin,
    oldestPrice,
    latestPrice,
    change,
    changePercent: `${changePercent}%`,
    trend: change > 0 ? '📈 Up' : change < 0 ? '📉 Down' : '⏸️ No change',
  };
};

module.exports = constructHistoriesPayload;
