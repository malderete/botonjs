/*jslint node: true nomen: true stupid: true */

'use strict';

var request = require("request");
var _ = require('underscore');


var YOUTUBE_URL = 'http://gdata.youtube.com/feeds/api/videos',
    MAX_RESULTS = 10;


function search(user, chan, args) {
    var bot = this,
        argsLength = args.length,
        query = null,
        options = null,
        JSONResponse = null,
        video = null,
        results = [];

    if (argsLength < 1) {
        bot.say(chan, user + ' I can not read your mind!');
        return;
    }

    // @youtube <somethingPart1> <somethingPart2>
    query = args.join(' ');
    options = {
        'url': YOUTUBE_URL,
        'qs': {
            'q': query,
            'orderBy': 'relevance',
            'alt': 'json',
            'max-results': MAX_RESULTS
        }
    };
    request(options, function searchCallback(error, response, body) {
        if (!error && response.statusCode === 200) {
            JSONResponse = JSON.parse(body);
            // get a random video and collect the valid links
            video = _.sample(JSONResponse.feed.entry);
            video.link.forEach(function iter(link) {
                if ((link.rel === 'alternate') && (link.type === 'text/html')) {
                    results.push(link.href);
                }
            });
        }

        if (results.length) {
            bot.say(chan, results.join('\n'));
        } else {
            bot.say(chan, 'No result for: ' + query);
        }
    });
}

function setupPlugin(bot) {
    bot.registerCommand('youtube', search, 'Make the bot search on YouTube');
}

/**
 * Expose `setupPlugin(bot)`.
 */
module.exports = setupPlugin;
