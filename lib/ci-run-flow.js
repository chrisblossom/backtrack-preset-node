#!/usr/bin/env node

'use strict';

const execSync = require('child_process').execSync;
const os = require('os');

/**
 * Do not test flow in Windows
 * Flow is not consistent in Windows
 */
if (os.platform() === 'win32') {
    // eslint-disable-next-line no-console
    console.log('Windows found. Skipping flow...');

    return;
}

const command = 'flow check';

/**
 * Throw will exit
 */
execSync(command, {
    stdio: 'inherit',
});
