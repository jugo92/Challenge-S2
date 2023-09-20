const User = require("./dbUser");
User.sync().then(() => {
  console.log(" db sync ok");
});
