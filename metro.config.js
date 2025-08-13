// const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config')
const {getDefaultConfig} = require('expo/metro-config')
const {mergeConfig} = require('@react-native/metro-config')

const defaultConfig = getDefaultConfig(__dirname)
const {assetExts, sourceExts} = defaultConfig.resolver

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    useESM: true,
  },
  resolver: {
    sourceExts: [...sourceExts, 'cjs'],
    unstable_enablePackageExports: true,
  },
}

module.exports = mergeConfig(defaultConfig, config)
