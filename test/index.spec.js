const fs = require("fs");
const sinon = require("sinon");
const expect = require("expect");
const config = require("../lib/index");

describe("kc-config", () => {
  let filename;
  let backupEnv;
  let readStub;
  let readErr;
  let readData;

  beforeEach(() => {
    filename = "filename";
    backupEnv = process.env;
    process.env = {};
    readErr = {
      code: null
    };
    readData = {};
    readCallback = (f, enc, cb) => {
      cb(readErr, readData);
    };
    readStub = sinon.stub(fs, "readFile").callsFake(readCallback);
  });

  afterEach(() => {
    readStub.restore();
    process.env = backupEnv;
  });

  describe("Create", () => {
    it("should fail (404) if the file is not found", (done) => {
      filename = "no file";
      readErr.code = "ENOENT";
      config.Create(filename, (err, settings) => {
        expect(err).toBe(404);
        done();
      });
    });
    it("should fail (500) if the file cannot be read", (done) => {
      filename = "bad file";
      readErr.code = "BAD";
      config.Create(filename, (err, settings) => {
        expect(err).toBe(500);
        done();
      });
    });
    it("should succeed if the file can be read", (done) => {
      readErr = null;
      readData = sampleFile();
      config.Create(filename, (err, settings) => {
        expect(err).toBe(null);
        done();
      });
    });
    it("should succeed even if there are comments", (done) => {
      readErr = null;
      readData = sampleFile();
      config.Create(filename, (err, settings) => {
        expect(err).toBe(null);
        done();
      });
    });
  });

  describe("Get", () => {

    beforeEach(() => {
      readErr = null;
      readData = sampleFile();
    });

    it("should return the default if the key is not found", (done) => {
      config.Create(filename, (err, settings) => {
        expect(err).toBe(null);
        const data = settings.Get("NO SUCH KEY", "default");
        expect(data).toBe("default");
        done();
      });
    });
    it("should return the value if the key is found", (done) => {
      config.Create(filename, (err, settings) => {
        expect(err).toBe(null);
        const data = settings.Get("MODE", "default");
        expect(data).toBe("Production");
        done();
      });
    });
    it("should return the complete value even if it has embedded equals sign(s)", (done) => {
      config.Create(filename, (err, settings) => {
        expect(err).toBe(null);
        const data = settings.Get("EMBEDDED", "default");
        expect(data).toBe("This has an = embedded within it.");
        done();
      });
    });
    it("should return the environment value if it exists", (done) => {
      process.env.BANNER = "test banner";
      config.Create(filename, (err, settings) => {
        expect(err).toBe(null);
        const data = settings.Get("BANNER", "default");
        expect(data).toBe("test banner");
        done();
      });
    });
    it("should treat key names as uppercase for file-based entries", (done) => {
      config.Create(filename, (err, settings) => {
        expect(err).toBe(null);
        const data = settings.Get("embeDDed", "default");
        expect(data).toBe("This has an = embedded within it.");
        done();
      });
    });
    it("should treat key names as their original case for environment entries", (done) => {
      process.env.NOTFOUND = "incorrectly cased key";
      config.Create(filename, (err, settings) => {
        expect(err).toBe(null);
        const data = settings.Get("notfound", "default");
        expect(data).toBe("default");
        done();
      });
    });
  });

  describe("Clear", () => {

    beforeEach(() => {
      readErr = null;
      readData = sampleFile();
    });

    it("should clear out all keys", (done) => {
      config.Create(filename, (err, settings) => {
        expect(err).toBe(null);
        let data = settings.Get("BANNER", "default");
        expect(data).toBe("Version 1.");
        settings.Clear();
        data = settings.Get("BANNER", "default");
        expect(data).toBe("default");
        done();
      });
    });
  });
});

const sampleFile = () => {
  return `
MODE        = Production
DB_CONN     = my-long-winded-connection-string:27017
 PAGE_SIZE   =   10
embedded = This has an = embedded within it.
lower       = 5
this has no key-value information

# Shows at the top of the web page.
   BANNER      = Version 1.
`;
};

const sampleFile2 = () => {
  return `
MODE        = Production 2
BANNER      = Version 2.
`;
};
