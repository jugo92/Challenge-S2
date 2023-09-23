const User = require("./auth/dbUser");
User.sync().then(() => {
  console.log(" db sync ok");
});
