const withPlugins = require('next-compose-plugins')
const withImages = require('next-images')
const withPWA = require('next-pwa')

module.exports = withPlugins([
  [withImages],
  [withPWA, {
    pwa: {
      dest: 'public'
    }
  }]
])