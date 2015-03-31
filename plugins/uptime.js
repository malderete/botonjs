/*jslint node: true nomen: true stupid: true */

'use strict';
var moment = require('moment');

var startupDate = null;

function uptime(nick, chan, args) {
    //if private msg chan === nick
    var sinceDate = moment(startupDate).fromNow();
    this.say(chan, "I've been running since " + sinceDate);
}

function setupPlugin(bot) {
    startupDate = new Date();
    bot.registerCommand('uptime', uptime, "Tells the bot's uptime");
}

/**
 * Expose `setupPlugin(bot)`.
 */
module.exports = setupPlugin;
