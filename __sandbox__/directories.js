'use strict';

const { readDirDeepSync } = require('read-dir-deep');

const directories = readDirDeepSync(__dirname, {
    deep: 1,
    onlyDirectories: true,
    markDirectories: false,
});

module.exports = directories;
