/*jslint node: true nomen: true stupid: true */

'use strict';

var request = require("request"),
    _ = require('underscore'),
    getenv = require('getenv');


var YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search/',
    YOUTUBE_VIDEO_URL = 'https://www.youtube.com/watch?v=<videoId>',
    YOUTUBE_API_KEY = getenv('YOUTUBE_API_KEY'),
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
        'url': YOUTUBE_API_URL,
        'qs': {
            'part': 'snippet',
            'type': 'video',
            'order': 'relevance',
            'key': YOUTUBE_API_KEY,
            'q': query,
            'maxResults': MAX_RESULTS
        }
    };
    request(options, function searchCallback(error, response, body) {
        if (!error && response.statusCode === 200) {
            JSONResponse = JSON.parse(body);
            // get a random video and collect the link
            video = _.sample(JSONResponse.items);
            if (video) {
                results.push(YOUTUBE_VIDEO_URL.replace('<videoId>', video.id.videoId));
            }
        }

        if (results.length) {
            bot.say(chan, 'Check this out! ' + results.join('\n'));
        } else {
            bot.say(chan, 'No results found for: ' + query);
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
