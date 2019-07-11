#!/usr/bin/env node

'use strict';

const path = require('path');
const execa = require('execa');
const log = require('@backtrack/core/dist/utils/log').default;
const clean = require('./clean');
const directories = require('./directories');

async function npmInstall() {
    await clean();

    const pending = directories.map(async (dir) => {
        const fullPath = path.resolve(__dirname, dir);

        log.info(dir, 'npm install');

        await execa('npm', ['--package-lock=false', 'install'], {
            cwd: fullPath,
            env: { FORCE_COLOR: true },
            // https://nodejs.org/api/child_process.html#child_process_options_stdio
            stdio: [
                // stdin - forward keyboard input
                process.stdin,
                // stdout
                'pipe',
                // stderr
                'inherit',
            ],
        });
    });

    try {
        await Promise.all(pending);
    } catch (error) {
        log.error('******************');
        log.error('npm install failed');
        log.error('******************');

        throw error;
    }

    log.info('**********************************');
    log.info('npm install completed successfully');
    log.info('**********************************');
}

if (require.main === module) {
    npmInstall().catch(error => {
        log.error(error);
    });
}

module.exports = npmInstall;
