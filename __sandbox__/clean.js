#!/usr/bin/env node

'use strict';

const path = require('path');
const del = require('del');
const log = require('@backtrack/core/dist/utils/log').default;

async function clean() {
    const patterns = ['*/node_modules', '*/package-lock.json'];

    try {
        const removed = await del(patterns, { dryRun: false, cwd: __dirname, root: __dirname });

        removed.forEach((file) => {
            const relativeRemoved = path.relative(__dirname, file);

            log.info(relativeRemoved, 'removed');
        });
    } catch (error) {
        log.error('************');
        log.error('clean failed');
        log.error('************');

        throw error;
    }
}

if (require.main === module) {
    clean().catch(error => {
        log.error(error);
    });
}

module.exports = clean;
