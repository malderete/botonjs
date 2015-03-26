/*jslint node: true nomen: true stupid: true */

'use strict';
var util = require('util');
function nickServIdentify() {
    var pluginSettings = this.pluginsSettings.freenode,
        password = '';
    if (pluginSettings) {
        password = pluginSettings.password;
        this.say('NickServ', 'identify ' + password);
    }
}

function nickServNotice(nick, to, text, message) {
    if (nick === 'NickServ') {
        if (text.indexOf("Invalid password") > -1) {
            this.logger.info("Invalid password!");
        } else if (text.indexOf("You are now identified") > -1) {
            this.logger.info("Successfully identified!");
        }
    }
}

function setupPlugin(bot) {
    bot.on(bot.events.REGISTERED, nickServIdentify);
    bot.on(bot.events.NOTICE, nickServNotice);
}

/**
 * Expose `setupPlugin(bot)`.
 */
module.exports = setupPlugin;
