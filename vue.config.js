const path = require('path')
const version = require('./package.json').version
const fs = require('fs')

const NODE_ENV = process.env.NODE_ENV
let publicPath = '/'
let outputDir = 'dist'
let appFileName = 'Demo'
if (NODE_ENV === 'demo') {
  publicPath = '/workflow-bpmn-modeler/demo/'
  outputDir = 'docs/demo'
  appFileName = 'Demo'
}
if (NODE_ENV === 'cdn') {
  const cdnVersionList = fs.readdirSync('./docs/cdn')
  if (cdnVersionList.includes(version)) {
    throw new Error(`cdn 版本 ${version} 已存在`)
  }
  publicPath = `https://cdn.jsdelivr.net/gh/goldsubmarine/workflow-bpmn-modeler@${version}/docs/cdn/${version}/`
  outputDir = `docs/cdn/${version}`
  appFileName = 'Lib'
}
if (NODE_ENV === 'lib') {
  const libVersionList = fs.readdirSync('./docs/lib')
  if (libVersionList.includes(version)) {
    throw new Error(`lib 版本 ${version} 已存在`)
  }
  publicPath = './'
  outputDir = `docs/lib/${version}`
  appFileName = 'Lib'
}

const resolve = dir => {
  return path.join(__dirname, dir)
}

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        // 配置全局样式变量
      },
      less: {
        // 自定义主题样式
        // modifyVars: {
        //   'primary-color': '#41B883',
        //   'link-color': '#41B883',
        //   'border-radius-base': '2px'
        // }
        // 解决问题主要需要打开这个
        javascriptEnabled: true
      }
    }
  },
  publicPath: publicPath,
  outputDir: outputDir,
  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: false,
  chainWebpack: config => {
    config.resolve.alias
      .set('views', resolve('src/views'))

    config
      .when(NODE_ENV !== 'development' && NODE_ENV !== 'build',
        config => {
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                vue: {
                  name: 'chunk-vue', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?vue(.*)/ // in order to adapt to cnpm
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
  },
  // 设为false打包时不生成.map文件
  productionSourceMap: false,
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  devServer: {
    proxy: 'http://localhost:9527'
  }
}
