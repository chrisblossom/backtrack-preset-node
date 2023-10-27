'use strict';

const readPkg = require('read-pkg');
const semver = require('semver');

const pkg = readPkg.sync({ normalize: false }) || {};
const engines = pkg.engines || {};
const node = engines.node || '18.12.0';
const nodeVersion = semver.coerce(node).raw;

module.exports = nodeVersion;
