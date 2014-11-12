/*jslint node: true nomen: true stupid: true */

// @imdb the matrix

//The Matrix (Andy Wachowski, Lana Wachowski) 1999 rating: 8.7 (904,215 votes)
//A computer hacker learns from mysterious rebels about the true nature of his reality and his role in
//the war against its controllers.
//http://ia.media-imdb.com/images/M/MV5BMTkxNDYxOTA4M15BMl5BanBnXkFtZTgwNTk0NzQxMTE@._V1_SX300.jpg

'use strict';

var request = require('request');


var API_URL = 'http://www.omdbapi.com/',
    HELP = 'Returns information from IMDB, usage: @imdb <title>',
    REPLY_TPL = '<Title> (<Director>) <Year> rating: <imdbRating> (<imdbVotes> votes)\n <Plot>\n <Poster>';


function fetch(user, chan, args) {
    var bot = this,
        argsLength = args.length,
        query = null,
        options = null,
        omdbData = null,
        reply = null;

    if (argsLength < 1) {
        bot.say(chan, user + ' Are you trying to do an Inception?');
        return;
    }

    // @imdb <somethingPart1> <somethingPart2>
    query = args.join(' ');
    options = {
        'url': API_URL,
        'qs': {
            't': query,
            'r': 'json'
        }
    };
    request(options, function searchCallback(error, response, body) {
        if (!error && response.statusCode === 200) {
            omdbData = JSON.parse(body);

            if (omdbData.Response === 'False') {
                bot.say(chan, omdbData.Error);
                return;
            }

            reply = REPLY_TPL;
            ['Title', 'Director', 'Year', 'imdbRating', 'imdbVotes', 'Plot', 'Poster'].forEach(function (key) {
                reply = reply.replace('<' + key + '>', omdbData[key]);
            });
            bot.say(chan, reply);
        } else {
            bot.say(chan, 'The service is unavailable!');
        }
    });
}

function setupPlugin(bot) {
    bot.registerCommand('imdb', fetch, HELP);
}

/**
 * Expose `setupPlugin(bot)`.
 */
module.exports = setupPlugin;
