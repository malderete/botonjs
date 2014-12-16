/*jslint node: true nomen: true stupid: true */

'use strict';

var _ = require('underscore');
var request = require('request');
var getenv = require('getenv');

var API_URL = 'http://api.tumblr.com/v2/blog/kingjamesprogramming.tumblr.com/posts/text',
    API_KEY = getenv('TUMBLR_API_KEY'),
    HELP = 'Predicates the programming religion taking a random post from kingjamesprogramming.tumblr.com',
    sentences = [];

function predicate(user, channel, args) {
    var bot = this,
        sentence = _.sample(sentences);

    bot.say(channel, sentence);
}

function loadPosts() {
    var options = {
        'url': API_URL,
        'qs': {
            'filter': 'text',
            'api_key': API_KEY,
        }
    };

    request(options, function loadPostsCallback(error, response, body) {
        if (!error && response.statusCode === 200) {
            sentences = _.map(JSON.parse(body).response.posts, function parse(post) { return post.body });
        } else {
            console.log('could not retrieve posts from KJP');
        }
    });
}

function setupPlugin(bot) {
    loadPosts();
    bot.registerCommand('predicate', predicate, HELP);
}


/**
 * Expose `setupPlugin(bot)`.
 */
module.exports = setupPlugin;
