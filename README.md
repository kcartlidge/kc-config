# kc-config

Very simple, fast and easy to use config loader. Gets from file(s), overridden by environment.

## What it is.

An extremely easy to use configuration loader that follows simple priority rules for each setting.

* Environment variables take priority.
* Check a specified config file next.
* Drop back to a specified default.

## How to use it.

The idea is that you should be specific about things that must change for your running environment, but also degrade to more general defaults whose values are shared across multiple environments.

For example your database connection strings and secret keys might be in AWS environment variables (if you run an EC2 instance), whereas a standard list page size could be in a config file for all environments and then overridden by an environment variable if needed.

## Code example.

Further usage is detailed below this code example.

``` javascript
const path = require("path");
const config = require("kc-config");

config.Create(path.join(__dirname, "./sample.env"), (err, settings) => {
  if (err !== null) {
    console.log("Error", err);
  } else {
    const connectionString = settings.Get("DB_CONN", "");
    console.log("DB_CONN =", connectionString);
  };
});
```

## Configuration file format.

The file is expected to follow an extremely simple format and layout. Setting names ideally should be in capitals (but see the note about casing below), and values are trimmed but otherwise untouched.

```
MODE        = Production
DB_CONN     = my-long-winded-connection-string:27017
PAGE_SIZE   = 10
EMBEDDED    = This has an embedded = which works fine.

# Shows at the top of the web page.
BANNER      = Version 2 has been released!
```

Your setting name is first. This is followed by one or more whitespace characters (which are ignored), then an equals delimiter. The remainder of the line forms the value, which has leading/trailing whitespace removed and can include equals too.

Lining up (as per the example above) is entirely optional, as are comments - which are lines that start with a hash symbol.

## Usage.

See the ```example``` folder for a full example, runnable from the top level using ```npm start```.
A single set of configuration values is maintained which can be built up and cleared down as required.

### Create(filename, callback)

Loads in a file to the current collection. If some have already been loaded this will append new settings and overwrite existing ones. The callback will be given two parameters, an error code and a ```settings``` object.

``` javascript
config.Create("./sample.env", (err, settings) => {});
```

The ```settings``` object then has the following:

### Get(key, defaultValue)

Gets the value from the environment, falling back on a config file then to the default.
``` javascript
const data := config.Get("KEY", "Default Value");
```

### Clear()

Removes any existing configuration values so the next ```Create``` will start again.

``` javascript
config.Clear();
```

## A note about casing.

Requests via ```Get``` always treat the Key as uppercase.

Entries in config files have their keys made uppercase when loaded, so consistency is assured. Environment variables do *not* have their keys treated as uppercase - you should use uppercase key names in your environment. As it happens, that's what most developers do anyway.

## Caching.

Environment variables are *not* cached and will always reflect current values. Configuration file settings *are* cached and will always reflect the value at launch.
As file settings are cached, performance is not impacted by where the setting comes from.

## Loading and reloading.

As ```Create``` returns a ```settings``` objecy you can call it as often as you like; each time you will get a new instance with the latest file entries. You can also call ```Clear``` to start fresh at any time.

Copyright: **K Cartlidge** | License: **MIT**
