// Providers index - exports all providers

// الـ Providers الجديدة مع دعم الروابط المباشرة
const vidsrcPro = require('./vidsrc-pro');
const vidsrcToPro = require('./vidsrc-to-pro');
const embedApi = require('./embed-api');

// الـ Providers القديمة (fallback)
const vidsrc = require('./vidsrc');
const vidsrcTo = require('./vidsrc-to');
const twoEmbed = require('./2embed');
const superEmbed = require('./superembed');
const moviesApi = require('./moviesapi');

// ترتيب الأولوية: الـ providers الجديدة أولاً
module.exports = [
    vidsrcPro,
    vidsrcToPro,
    embedApi,
    vidsrc,
    vidsrcTo,
    twoEmbed,
    superEmbed,
    moviesApi
];
