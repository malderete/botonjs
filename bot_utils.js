'use strict';

var botUtils = {
    isChannel: function (str) {
        return (str.trim()[0] === '#');
    },
};


module.exports = botUtils;
