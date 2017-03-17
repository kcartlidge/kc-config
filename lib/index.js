const fs = require("fs");

let values = {};

module.exports = {
  Create: (filename, callback) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) {
        return callback(err.code === "ENOENT" ? 404 : 500, null);
      }
      const lines = data.split(/\r\n|\r|\n/);
      lines.forEach((line) => {
        line = line.trim();
        if (line.length > 1) {
          if (!line.startsWith("#")) {
            const eq = line.indexOf("=");
            if (eq > -1) {
              const key = line.substring(0, eq).trim().toUpperCase();
              const val = line.substring(eq + 1).trim();
              values[key] = val;
            }
          }
        }
      });
      callback(err);
    });
  },

  Get: (key, defaultValue, callback) => {
    key = key;
    val = defaultValue;
    const upperKey = key.toUpperCase();
    if (values[upperKey]) {
      val = values[upperKey];
    }
    if (process.env[key]) {
      val = process.env[key];
    }
    callback(null, val);
  },

  Clear: (callback) => {
    values = {};
    callback(null, values);
  },
};
