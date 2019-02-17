'use strict';

const path = require('path');
const copy = require('recursive-copy');
const chokidar = require('chokidar');
const log = require('@backtrack/core/dist/utils/log').default;
const { rootPath, sourcePath, buildPath } = require('@backtrack/core/paths');
const exitHook = require('./utils/exit-hook');

const ignorePatterns = ['!**/__sandbox__/**'];
const copyPatterns = ['**/*.json', ...ignorePatterns];

function copyFiles() {
    const copying = copy(sourcePath, buildPath, {
        overwrite: true,
        dot: true,
        filter: copyPatterns,
    });

    copying.on(copy.events.COPY_FILE_COMPLETE, ({ src, dest }) => {
        const relativeSrc = path.relative(rootPath, src);
        const relativeDest = path.relative(rootPath, dest);

        log.info(`${relativeSrc} -> ${relativeDest}`);
    });

    return copying;
}

function handleUpdatedFile(pathname) {
    const relativeSourcePath = path.relative(sourcePath, pathname);
    const relativeRootPath = path.relative(rootPath, pathname);

    const destPath = path.resolve(buildPath, relativeSourcePath);
    const rootRelativePath = path.relative(rootPath, destPath);

    return copy(pathname, destPath, {
        overwrite: true,
    })
        .then(() => {
            log.info(`${relativeRootPath} -> ${rootRelativePath}`);

            return undefined;
        })
        .catch((error) => {
            log.error(error);

            log.error(`${relativeRootPath} could not be copied`);
        });
}

function copyFilesWatch() {
    const pendingCopy = [];

    return new Promise((resolve) => {
        let isResolved = false;
        const watcher = chokidar.watch(copyPatterns, {
            cwd: sourcePath,
        });

        watcher.on('ready', () => {
            isResolved = true;

            resolve();
        });

        watcher.on('add', (file) => {
            const fullFilePath = path.join(sourcePath, file);

            const result = handleUpdatedFile(fullFilePath);

            if (isResolved === false) {
                pendingCopy.push(result);
            }

            return result;
        });

        watcher.on('change', (file) => {
            const fullFilePath = path.join(sourcePath, file);

            return handleUpdatedFile(fullFilePath);
        });

        exitHook(() => {
            watcher.close();
        });
    }).then(() => {
        return Promise.all(pendingCopy);
    });
}

copyFiles.watch = copyFilesWatch;
module.exports = copyFiles;
