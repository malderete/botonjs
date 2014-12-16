botonjs
=======

Simple and extensible IRC Bot on Node!

Installation
------------
```bash
git clone git@github.com:malderete/botonjs.git
cd botonjs
#create settings.js (you can use settings.js.example as base)
npm install
```

Settings
--------
settings.js
```javascript
module.exports = {
    server: 'irc.freenode.org',
    nickName: 'BotonJS',
    loadPlugins: true,
    debug: true,
    logLevel: 'info',
    userName: 'BotonJS',
    realName: 'BotonJS',
    channels: ['#channel1', '#channel2']
};
```

Configuration
-------------
The main configuration file is settings.js, you can find an example in the source code.
Some features are handled by environment variables, this approach allows the bot to change in runtime.
For Plugin's configuration, its highly recommended to use environment variables to control the plugins behavior.

Environment Variables
---------------------
BLACKLISTED_NICKS: Comma separated values. Each value is a nicks which the bot is going to ignore.

Run
---
```bash
# Set your environment first
node index.js
```

Plugins
-------
TODO
