const path = require("path");
const config = require("../lib/index");

config.Create(path.join(__dirname, "./sample.env"), (err, settings) => {
  if (err !== null) {
    console.log("Error", err);
  } else {
    const connectionString = settings.Get("DB_CONN", "");
    console.log("DB_CONN =", connectionString);
  };
});
