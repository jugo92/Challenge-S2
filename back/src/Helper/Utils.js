function isPasswordExpired(passwordChangeDate, maxAgeInDays) {
  const currentDate = new Date();
  const expirationDate = new Date(passwordChangeDate);
  expirationDate.setDate(expirationDate.getDate() + maxAgeInDays);
  return currentDate > expirationDate;
}

module.exports = {
  isPasswordExpired,
};
