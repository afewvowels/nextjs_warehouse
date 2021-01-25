const withPlugins = require('next-compose-plugins')
const withImages = require('next-images')
const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

module.exports = withPlugins([
  [withImages],
  [withPWA, {
    pwa: {
      dest: 'public',
      runtimeCaching,
    }
  }]
])