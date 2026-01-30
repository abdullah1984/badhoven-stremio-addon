// Providers index - exports all providers

const vidsrc = require('./vidsrc');
const vidsrcTo = require('./vidsrc-to');
const twoEmbed = require('./2embed');
const superEmbed = require('./superembed');
const moviesApi = require('./moviesapi');

module.exports = [
    vidsrc,
    vidsrcTo,
    twoEmbed,
    superEmbed,
    moviesApi
];
