#!/usr/bin/env node

'use strict';

const log = require('@backtrack/core/dist/utils/log').default;
const directories = require('./directories');
const backtrackInit = require('./backtrack-init');
const npmInstall = require('./npm-install');

async function updateAll() {
    log.info('updating:', directories.join(' '));

    try {
        await npmInstall();
        await backtrackInit();
    } catch (error) {
        log.error(error);
    }
}

updateAll();
