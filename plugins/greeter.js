/*jslint node: true nomen: true stupid: true */

'use strict';

function greeter(channel, nick) {
    var bot = this,
        my_nick = this.config.nick,
        greet =  nick + ' Buenas!';

    if (nick === my_nick) {
        greet = 'Hola! Que tal todo?';
    }
    setTimeout(function () {
        bot.say(channel, greet);
    }, 2300);
    return;
}

function setupPlugin(bot) {
    bot.on(bot.events.JOIN, greeter);
}

/**
 * Expose `setupPlugin(bot)`.
 */
module.exports = setupPlugin;
