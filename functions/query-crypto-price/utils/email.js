const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const validator = require('email-validator');

const isEmailValidated = (email) => {
  return validator.validate(email);
};

const sendEmail = async (email, coinHistories) => {
  try {
    const emailHtml = _generateEmailHtml(coinHistories);
    const client = new SESClient({ region: 'ap-southeast-2' });
    const input = {
      Source: process.env.EMAIL_SENDER, // required
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: 'Your Crypto Price Update',
        },
        Body: {
          Html: {
            Data: emailHtml,
          },
        },
      },
    };
    const command = new SendEmailCommand(input);

    await client.send(command);
  } catch (err) {
    console.log('Error when sending email', err);
    return err;
  }
};

const _generateEmailHtml = (coinHistories) => {
  const insights = coinHistories
    .map(_generateCoinHtmlSection)
    .join('<hr style="margin:30px 0;">');

  return `
    <html>
      <body style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h1 style="text-align:center;">Your Crypto Insights</h1>
        ${insights}
        <p style="text-align:center;">Thanks for using <strong>CoinCompanion</strong>! 🚀</p>
      </body>
    </html>
  `;
};

const _generateCoinHtmlSection = ({
  coin,
  latestPrice,
  fetchedAt,
  oldestPrice = null,
  change = null,
  changePercent = null,
  trend = null,
}) => {
  if (!oldestPrice) {
    return `
      <div>
        <h2>${coin.toUpperCase()}</h2>
        <p>We’ve just started tracking this coin for you.</p>
        <p><strong>Current Price:</strong> ${latestPrice} USD</p>
        <p><strong>Price as of:</strong> ${fetchedAt} USD</p>
        <p><em>Give it some time and we’ll generate insights soon!</em></p>
      </div>
    `;
  }

  const suggestion = trend.includes('Up')
    ? '🔥 The price is going up — might be a good time to consider buying!'
    : trend.includes('Down')
    ? '📉 Price is dropping — maybe wait a bit before making your move.'
    : '😐 No major changes — feel free to hold or watch for the next trend.';

  return `
    <div>
      <h2>${coin.toUpperCase()}</h2>
      <ul style="list-style:none; padding:0;">
        <li><strong>🕒 Oldest Price:</strong> ${oldestPrice} USD</li>
        <li><strong>📈 Latest Price:</strong> ${latestPrice} USD</li>
        <li><strong>📅 Price as of:</strong> ${fetchedAt}</li>
        <li><strong>💸 Change:</strong> ${
          change >= 0 ? '+' : ''
        }${change.toFixed(2)} USD</li>
        <li><strong>📊 Percent Change:</strong> ${changePercent}</li>
        <li><strong>📍 Trend:</strong> ${trend}</li>
      </ul>
      <p><em>${suggestion}</em></p>
    </div>
  `;
};

module.exports = { isEmailValidated, sendEmail };
