const constructHistoriesPayload = ({
  coin,
  latestPrice,
  timestamp,
  oldestPrice = null,
  change = null,
  changePercent = null,
}) => {
  // timestamp is in microseconds, hence need to divide by 1000 for the conversion
  const timeInISOString = new Date(timestamp / 1000).toISOString();

  if (!oldestPrice)
    return {
      coin,
      latestPrice,
      trend: 'Not enough data to generate insights.',
      fetchedAt: timeInISOString,
    };

  return {
    coin,
    oldestPrice,
    latestPrice,
    change,
    changePercent: `${changePercent}%`,
    trend: change > 0 ? '📈 Up' : change < 0 ? '📉 Down' : '⏸️ No change',
    fetchedAt: timeInISOString,
  };
};

module.exports = constructHistoriesPayload;
