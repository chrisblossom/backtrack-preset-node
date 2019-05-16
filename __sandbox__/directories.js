'use strict';

const { readDirDeepSync } = require('read-dir-deep');

const directories = readDirDeepSync('.', {
    deep: false,
    onlyDirectories: true,
    markDirectories: false,
});

module.exports = directories;
