const fetchPrice = require('./price');
const { sendEmail, isEmailValidated } = require('./email');

module.exports = {
  fetchPrice,
  sendEmail,
  isEmailValidated,
};
