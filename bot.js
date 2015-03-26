/*jslint node: true nomen: true stupid: true */

'use strict';

var events = require('events');
var fs = require('fs');
var path = require('path');
var util = require('util');

var irc = require('irc');
var Log = require('log');
var getenv = require('getenv');

var botUtils = require('./bot_utils.js');

/* Shortcut to event.EventEmitter */
var EventEmitter = events.EventEmitter;

var CMD_CHAR = '@',
    CMD_HELP = 'help';

var EVENTS = {
    //irc
    REGISTERED: 'registered',
    NOTICE: 'notice',
    JOIN: 'join',
    PART: 'part',
    KICK: 'kick',
    QUIT: 'quit',
    MESSAGE: 'message',
    PRIVATE_MESSAGE: 'pm',
    //customs!
    PUBLIC_MESSAGE: 'public_message',
    TALKED_TO_ME: 'talked_to_me',
};


/**
 * Represents a IRCBot.
 * @constructor
 * @param <String> server
 * @param <String> nickname
 * @param <Object> options
 */
function IRCBot(server, nickname, options) {
    // If the function has been called without 'new'
    if (!(this instanceof IRCBot)) {
        return new IRCBot(server, nickname, options);
    }
    this.commands = [];
    this.commandsNames = [];
    this.DEBUG = options.debug || false;
    this.events = EVENTS;
    /* private variable */
    this._client = new irc.Client(server, nickname, options);

    this.config = this._client.opt;
    this.pluginsSettings = options.pluginsSettings || {};
    this.logger = new Log(options.logLevel || 'info');

    this.setupClientListeners();
    EventEmitter.call(this);

    if (options.loadPlugins || false) {
        this.loadPlugins(__dirname + '/plugins/');
    }
}

// extend the IRCBot class using our EventEmitter class
util.inherits(IRCBot, EventEmitter);

IRCBot.prototype.loadPlugins = function (rootDir) {
    this.logger.info('Loading Plugins...');
    var bot = this,
        pluginsFile = fs.readdirSync(rootDir).sort();

    pluginsFile.forEach(function load(fileName) {
        var ext = path.extname(fileName),
            baseName = path.basename(fileName, ext),
            plugin = null;

        try {
            plugin = require(path.join(rootDir, baseName));
            plugin(bot);
            bot.logger.info('Loaded successfully: ' + baseName);
        } catch (error) {
            bot.logger.error('Error loading the plugin: ' + fileName);
            bot.logger.error(error.stack);
        }
    });
};

IRCBot.prototype.setupClientListeners = function () {
    /*
    Here we use this.<callback>.bind(this)
    because by default EventEmitter pass itself
    as *this* (inside the callback) and we want to pass
    an IRCBot instance as *this*.
    See: http://nodejs.org/api/events.html#events_events
    */
    var self = this, events = [
        EVENTS.REGISTERED,
        EVENTS.NOTICE,
        EVENTS.JOIN,
        EVENTS.PART,
        EVENTS.KICK,
        EVENTS.QUIT,
        'error'
        //EVENTS.PRIVATE_MESSAGE,
    ];
    // Get some events and re-emit them with other context
    events.forEach(function iter(evt) {
        self._client.on(evt, function wrapper() {
            var args = Array.prototype.slice.call(arguments);
            args.unshift(evt);
            self.emit.apply(self, args);
        });
    });
    // special handling for private, change the context
    self._client.on(EVENTS.PRIVATE_MESSAGE, self.handleMessageAdapter.bind(self));
    // special handling for message, change the context
    self._client.on(EVENTS.MESSAGE, self.handleMessageAdapter.bind(self));
};


IRCBot.prototype.handleMessageAdapter = function handleMessageAdapter() {
    var ircClient = this._client,
        my_nick = ircClient.opt.nick,
        blacklistedNicks = null,
        nick = null, to = null,
        text = null, message = null,
        callable = null, cmd_line = null,
        cmd = null, c_args = null;

    // Dispatch based on the number of arguments
    if (arguments.length === 3) {
        // Private Message
        //nick, text, message
        nick = arguments[0];
        to = nick;
        text = arguments[1];
        message = arguments[2];
        callable = this.handlePrivateMessage.bind(this);
    } else {
        // General Message
        //nick, chan, text, message
        nick = arguments[0];
        to = arguments[1];
        text = arguments[2];
        message = arguments[3];
        callable = this.handleGeneralMessage.bind(this);
    }

    // Ignore my messages
    if (nick === my_nick) {
        this.logger.debug('I do not reply to myself!');
        return;
    }

    // Ignore blacklisted nicks
    blacklistedNicks = getenv.array('BLACKLISTED_NICKS', 'string', []);
    if (blacklistedNicks.indexOf(nick) > -1) {
        this.logger.debug('I do not reply to blacklisted nicks!');
        return;
    }

    // Special handling for commands
    if (text[0] === CMD_CHAR) {
        cmd_line = text.split(' ');
        cmd = cmd_line[0].slice(1);
        c_args = cmd_line.slice(1);

        this.handleCommand(nick, to, cmd, c_args);
        return;
    }

    // dispatch some custom logic!
    callable(nick, to, text, message);
    return;
}

/**
 * Special logic for private messages.
 * @param <String> nick
 * @param <String> _
 * @param <String> text
 * @param <Object> IRC library message
 */
IRCBot.prototype.handlePrivateMessage = function handlePrivateMessage(nick, _, text, message) {
    this.emit(EVENTS.PRIVATE_MESSAGE, nick, text, message);
};

/**
 * Special logic for general messages.
 * @param <String> nick
 * @param <String> chan
 * @param <String> text
 * @param <Object> IRC library message
 */
IRCBot.prototype.handleGeneralMessage = function handleGeneralMessage(nick, chan, text, message) {
    var ircClient = this._client,
        my_nick = ircClient.opt.nick;

    if (text.match(my_nick)) {
        if (botUtils.isChannel(chan)) {
            this.emit(EVENTS.TALKED_TO_ME, nick, chan, text, message);
        } else {
            this.logger.info('Is this condition even possible?');
        }
    } else {
        this.emit(EVENTS.PUBLIC_MESSAGE, nick, chan, text, message);
    }
};

/**
 * Handles the command call the plugins if needed
 * @param <String> nick
 * @param <String> to
 * @param <String> cmd
 * @param <Array> cmdArgs
 */
IRCBot.prototype.handleCommand = function handleCommand(nick, to, cmd, cmdArgs) {
    var self = this,
        inPrivate = !botUtils.isChannel(to),
        commandsLength = this.commands.length,
        cmdObj = null,
        helpText = [];

    if (cmd === CMD_HELP) {
        // @help validCmd
        if (this.commandsNames.indexOf(cmdArgs[0]) > -1) {
            // Its not possible to have more than one action for a command!
            helpText = this.commands.filter(function filter(obj) { return (obj.cmd === cmdArgs[0]); });
            helpText = helpText[0];
            if (helpText.help === '') {
                self.say(to, '@' + helpText.cmd + ' has not help, Im not a mind reader!');
            } else {
                self.say(to, 'Help for @' + helpText.cmd + ': ' + helpText.help);
            }
        } else {
            // @help
            // @help invalidCmd
            this.commands.forEach(function helpIter(obj) {
                helpText.push(obj.cmd);
            });
            self.say(to, 'Available commands: ' + helpText.join(', '));
        }
        return;
    }

    if (this.commandsNames.indexOf(cmd) > -1) {
        for(var index=0; index < commandsLength; index++) {
            cmdObj = this.commands[index];
            if (cmdObj.cmd === cmd) {
                if (cmdObj.onlyPrivate) {
                    if (inPrivate) {
                        cmdObj.callback.call(this, nick, to, cmdArgs);
                    } else {
                        this.say(to, 'This command has to be used in private!');
                    }
                } else {
                    cmdObj.callback.call(this, nick, to, cmdArgs);
                }
                // get out of the loop!
                break;
            }
        }
    } else {
        this.say(to, nick + ' I havent seen that command and Im not a wizard yet!');
    }
    return;
};

/**
 * Register a command with the bot
 * @param <String> cmd
 * @param <Function> callback
 * @param <String> help
 * @param <Boolean> onlyPrivate
 */
IRCBot.prototype.registerCommand = function registerCommand(cmd, callback, help, onlyPrivate) {
    var self = this;

    if (help === undefined) {
        help = '';
    }

    if (cmd instanceof Array) {
        // multiples commands for an action
        cmd.forEach(function (oneCmd) {
            if (self.commandsNames.indexOf(oneCmd) < 0) {
                self.commands.push({'cmd': oneCmd, 'callback': callback, 'help': help, 'onlyPrivate': onlyPrivate});
                self.commandsNames.push(oneCmd);
            } else {
                this.logger.info('The command (%s) already exists!', oneCmd);
            }
        });
    } else {
        // single command for an action
        if (this.commandsNames.indexOf(cmd) < 0) {
            this.commands.push({'cmd': cmd, 'callback': callback, 'help': help, 'onlyPrivate': onlyPrivate});
            this.commandsNames.push(cmd);
        } else {
            this.logger.info('The command (%s) already exists!', cmd);
        }
    }
};

/**
 * Proxy the method directly to irc.Client
 */
var clientMethods = [
        'join', 'part', 'say',
        'ctcp', 'action',
        'notice', 'whois',
        'list', 'connect',
        'disconnect'
    ];

clientMethods.forEach(function (name) {
    IRCBot.prototype[name] = function () {
        var args = Array.prototype.slice.call(arguments);
        this._client[name].apply(this._client, args);
    };
});


module.exports = {IRCBot: IRCBot};
