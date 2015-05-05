/*jslint node: true nomen: true stupid: true */

'use strict';

var _ = require('underscore');
var request = require('request');
var getenv = require('getenv');

var API_URL = 'http://api.giphy.com/v1/gifs/search',
    API_KEY = getenv('GIPHY_API_KEY'),
    HELP = 'Get some cool gifs from giphy.com',
    LIMIT = 5;

function search(user, channel, args) {
    var bot = this,
        argsLength = args.length,
        options = null,
        query = null,
        gif = null,
        result = null;

    if (argsLength < 1) {
        bot.say(chan, user + ' I can\'t imagine your mind dude');
        return;
    }

    query = args.join(' ');
    options = {
        'url': API_URL,
        'qs': {
            'q': query,
            'api_key': API_KEY,
            'limit': LIMIT
        }
    };

    request(options, function searchCallback(error, response, body) {
        if (!error && response.statusCode === 200) {
            // get a random gif from response
            gif = _.sample(JSON.parse(body).data);
            result = gif.images.fixed_height.url
        } else {
            console.log('Could not retrieve any gifs from giphy');
        }

        if (result !== null) {
            bot.say(channel, result);
        } else {
            bot.say(channel, 'No result for: ' + query);
        }
    });
}

function setupPlugin(bot) {
    bot.registerCommand(['gif', 'image', 'gifs'], search, HELP);
}

/**
 * Expose `setupPlugin(bot)`.
 */
module.exports = setupPlugin;
