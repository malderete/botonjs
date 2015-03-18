/*jslint node: true nomen: true stupid: true */

// @man fs,net
// The documentation for fs is here: https://nodejs.org/api/fs.html
// The documentation for net is here: https://nodejs.org/api/net.html

'use strict';

var request = require('request');


var API_URL = 'https://nodejs.org/api/<module>.html',
    HELP = 'Respond with the link to the NodeJS docs of the module.',
    REPLY_FOUND = "The docs for <module> is here: <url>",
    REPLY_NOTFOUND = "I don't know where the docs for <module> are.";

function parseModuleNames(args) {
    var moduleNames = [];
    args.forEach(function iter(arg) {
        arg.split(',').forEach(function iterInner(futureArg) {
            futureArg = futureArg.trim(', ');
            if (futureArg) {
                moduleNames.push(futureArg);
            }
        });
    });
    return moduleNames;
}

function man(user, chan, args) {
    var bot = this,
        argsLength = args.length,
        url = null,
        options = null,
        reply = null;

    if (argsLength < 1) {
        bot.say(chan, user + ' What are you looking for?');
        return;
    }

    parseModuleNames(args).forEach(function fetch(moduleName) {
        url = API_URL.replace('<module>', moduleName);
        // The autoCallable function is required to
        // dont track the reference to url instead of that
        // use a copy.
        (function autoCallable(url) {
            options = {'url': url};
            request(options, function searchCallback(error, response, body) {
                if (!error) {
                    if (response.statusCode === 200) {
                        reply = REPLY_FOUND.replace('<module>', moduleName);
                        reply = reply.replace('<url>', url);
                    } else {
                        reply = REPLY_NOTFOUND.replace('<module>', moduleName);
                    }
                    bot.say(chan, reply);
                }
            });
        })(url);
    });
}

function setupPlugin(bot) {
    bot.registerCommand('man', man, HELP);
}

/**
 * Expose `setupPlugin(bot)`.
 */
module.exports = setupPlugin;
