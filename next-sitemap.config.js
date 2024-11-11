/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://calendar.wfxu.one',
    generateRobotsTxt: true, // (optional)
    // ...other options
    changefreq: 'daily',
    priority: 0.7,
    sitemapSize: 5000
  }
  