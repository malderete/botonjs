/*jslint node: true nomen: true stupid: true */

'use strict';
var _ = require('underscore');


var BARDOS = [
    "muchachooo hay que tener cuidadín",
    "VIRGEN!",
    "que ágil",
    "que tipo de mierda",
    "me hacés mierda...",
    "go home, you are drunk"
];

var SPECIFIC_BARDOS = {
    "BOTON": "Vos sos un botón! https://www.youtube.com/watch?v=Kjwra1vXhEg",
    "UN": "ULTRA NEEEERD http://cdn.memegenerator.net/instances/400x/23940800.jpg",
    "AHH": "AHHHHHHHHHHHHHHHHHHHHHHHHHHHH!!!! http://bit.ly/PJpxN4",
    "LP": "LA HAS LIADO PARDA!! http://www.youtube.com/watch?v=ICQrvG6jfOA",
    "BUE": "¯\_(ツ)_/¯",
    "ECFD": "http://imgur.com/BjcW8",
    "V": "VIRGEEEEEEN!!! http://www.virginmedia.com/images/40-Year-Old-Virgin-poster-590x350.jpg",
    "LTA": "LA TENÉS ADENTRO! http://www.memegenerator.es/imagenes/memes/0/1185384.jpg",
    "FU": "OH MY, YOU'RE ALL FUC*ED UP!!! http://i.imgur.com/RW5SZ97.gif"
};


function randomBard(bot, chan, user) {
    var phrase = _.sample(BARDOS),
        reply = user + ' ' + phrase;
    bot.say(chan, reply);
}

function specificBard(bot, chan, user, bardKey) {
    var reply = null;
    bardKey = bardKey.toUpperCase();
    if (Object.keys(SPECIFIC_BARDOS).indexOf(bardKey) > -1) {
        reply = user + ' ' + SPECIFIC_BARDOS[bardKey];
        bot.say(chan, reply);
    } else {
        bot.logger.error(bardKey + ' is not valid!');
    }
}

function bard(user, chan, args) {
    var bot = this,
        length = args.length,
        bard = null;

    if (length === 0) {
        // @bardo
        randomBard(bot, chan, user);
        return;
    }
    
    if (length >=1) {
        user = args[0];
        if (length === 1) {
            // @bardo malderete
           randomBard(bot, chan, user);
        } else if (length === 2) {
            // @bardo malderete AHH
            bard = args[1];
            specificBard(bot, chan, user, bard);
        }
    }
}

function setupPlugin(bot) {
    bot.registerCommand(['bardo', 'quilombo', 'putea'], bard, 'Makes the bot talk dirty');
}

/**
 * Expose `setupPlugin(bot)`.
 */
module.exports = setupPlugin;
