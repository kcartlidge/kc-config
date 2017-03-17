const path = require("path");
const config = require("../lib/index");

config.Create(path.join(__dirname, "./sample.env"), (err, data) => {
  if (err !== null) {
    console.log("Error", err);
  } else {
    config.Get("DB_CONN", "", (err, data) => {
      console.log("DB_CONN =", data);
    });
  };
});
