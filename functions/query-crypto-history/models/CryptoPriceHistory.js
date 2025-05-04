const dynamoose = require('dynamoose');

const cryptoPriceHistory = dynamoose.model(
  'crypto-price-history-v2',
  new dynamoose.Schema(
    {
      email: {
        type: String,
        hashKey: true,
      },
      timestamp: {
        type: Number,
        rangeKey: true,
      },
      coin: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: 'usd',
      },
    },
    {
      saveUnknown: false,
      timestamps: false,
    }
  ),
  {
    create: true,
    waitForActive: true,
  }
);
try {
  module.exports = cryptoPriceHistory;
} catch (e) {
  console.log(e);
}
