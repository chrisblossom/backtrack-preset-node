#!/usr/bin/env node

'use strict';

const directories = require('./directories');
const path = require('path');
const execa = require('execa');
const del = require('del');
const log = require('@backtrack/core/dist/utils/log').default;

async function backtrackInit() {
    for await (const dir of directories) {
        const fullPath = path.resolve(__dirname, dir);

        log.info(`${dir}: backtrack init`);

        try {
            await execa('backtrack', ['init'], {
                cwd: fullPath,
                env: { FORCE_COLOR: true },
                // https://nodejs.org/api/child_process.html#child_process_options_stdio
                stdio: [
                    // stdin - forward keyboard input
                    process.stdin,
                    // stdout
                    'inherit',
                    // stderr
                    'inherit',
                ],
            });
        } catch (error) {
            log.error('*********************');
            log.error('backtrack init failed');
            log.error('*********************');

            throw error;
        }
    }

    const backups = await del(['**/*-backup-*', '!*/node_modules/**/*'], { dryRun: true, cwd: __dirname, root: __dirname });
    backups.forEach((file) => {
        const relativeRemoved = path.relative(__dirname, file);

        log.warn('backup file found:',relativeRemoved);
    });
}

if (require.main === module) {
    backtrackInit().catch(error => {
        log.error(error);
    });
}

module.exports = backtrackInit;
