/*jslint node: true nomen: true stupid: true */
'use strict';

var IRCBot = require('./bot.js');
var Settings = require('./settings.js');

/* Bot inicialization */
var options = {
    //bot related
    loadPlugins: Settings.loadPlugins || true,
    // IRC library related
    debug: Settings.debug || false,
    floodProtection: true, //make it default in the bot
    userName: Settings.userName || 'PlatonJS',
    realName: Settings.realName || 'PlatonJS',
    channels: Settings.channels
};

var bot = new IRCBot.IRCBot(Settings.server, Settings.nickName, options);

/* Process SIGNAL handlers */
process.on('SIGINT', function exit() {
    function quit() {
        process.exit(0);
    }
    // Schedule the quit after the disconnect
    // seems to be a workaround some IRC bug...
    process.nextTick(quit);
    bot._client.disconnect('Un deploy me llama');
});

