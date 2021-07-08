const {WebpackManifestPlugin} = require('webpack-manifest-plugin')
const nodeExternals = require('webpack-node-externals');
const webpack =require('webpack');

module.exports = {
    chainWebpack:webpackConfig => {
        webpackConfig.module.rule('vue').uses.delete('cache-loader')
        webpackConfig.module.rule('js').uses.delete('cache-loader')
        webpackConfig.module.rule('ts').uses.delete('cache-loader')
        webpackConfig.module.rule('tsx').uses.delete('cache-loader')

        if(!process.env.SSR){
            webpackConfig.entry('app').clear().add('./src/entry-client.js')
            return
        }

        webpackConfig.entry('app').clear().add('./src/entry-server.js')

        webpackConfig.target('node')
        webpackConfig.output.libraryTarget('commonjs2')

        webpackConfig.plugin('mainfest').use(new WebpackManifestPlugin({fileName:'ssr-manifest.json'}))
        webpackConfig.externals(nodeExternals({allowlist:/\.(css|vue)/}))

        webpackConfig.optimization.splitChunks(false).minimize(false)
        webpackConfig.plugins.delete('preload')
        webpackConfig.plugins.delete('prefetch')
        webpackConfig.plugins.delete('progress')
        webpackConfig.plugins.delete('friendly-errors')
    
        webpackConfig.plugin('limit').use(
          new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
          })
        )
    }
}