'use strict';

const readDirDeep = require('read-dir-deep');

const directories = readDirDeep.sync('.', {
    deep: false,
    onlyDirectories: true,
    markDirectories: false,
});

module.exports = directories;
