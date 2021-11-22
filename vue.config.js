const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const { HashedModuleIdsPlugin } = require('webpack');
const PrerenderSPAPlugin = require('prerender-spa-plugin');
// 类似于 SSR 提前渲染单个页面 
// const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;

const path = require('path');

function resolve() {
   return path.resolve.apply(null, [...arguments]);
}

// cdn预加载使用
const externals = {
   'vue': 'Vue',
   'vue-router': 'VueRouter',
   'vuex': 'Vuex',
   'axios': 'axios',
   "element-ui": "ELEMENT",
   // "vue-qriously": "VueQriously"
}

const cdn = {
   // 开发环境
   dev: {
      css: [
         'https://unpkg.com/element-ui/lib/theme-chalk/index.css'
      ],
      js: []
   },
   // 生产环境
   build: {
      // css: [
      //    'https://unpkg.com/element-ui/lib/theme-chalk/index.css'
      // ],
      js: [
         'https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.min.js',
         'https://cdn.jsdelivr.net/npm/vue-router@3.0.1/dist/vue-router.min.js',
         'https://cdn.jsdelivr.net/npm/vuex@3.0.1/dist/vuex.min.js',
         'https://cdn.jsdelivr.net/npm/axios@0.18.0/dist/axios.min.js',
         'https://cdn.jsdelivr.net/npm/axios@0.18.0/dist/axios.min.js',
         // 'https://cdn.jsdelivr.net/npm/vue-qriously',
         'https://unpkg.com/element-ui/lib/index.js',
      ]
   }
}

module.exports = {
   publicPath: '/',
   chainWebpack: config => {
      // webpack 会默认给commonChunk打进chunk-vendors，所以需要对webpack的配置进行delete
      if (process.env.NODE_ENV === 'production') {
         config.optimization.delete('splitChunks');

         config.plugin('html').tap(args => {
            args[0].cdn = cdn.build
            return args
         });

         // config.externals = externals;
      }
      // config
      //    .plugin('webpack-bundle-analyzer')
      //    .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
   },
   configureWebpack: {
      resolve: {
         alias: {
            'assets': '@/assets',
            'common': '@/common',
            'components': '@/components',
            'views': '@/views',
         }
      },
      plugins: [
         new CompressionWebpackPlugin({
            test: /\.(js|css|svg|woff|ttf|json|html)$/,
            threshold: 10240,
            minRatio: 0.8
         }),
         new HashedModuleIdsPlugin(),
      ],
      optimization: {
         minimizer: [
            new UglifyJsPlugin({
               sourceMap: false,
               uglifyOptions: {
                  output: {
                     comments: false
                  },
                  compress: {
                     drop_console: true,//console
                     drop_debugger: true,
                     pure_funcs: ['console.log']//移除console
                  }
               }
            })
         ],
         splitChunks: {
            chunks: 'all',
            minSize: 30000, // 字节 引入的文件大于30kb才进行分割
            minChunks: 1, // 模块至少使用次数
            maxAsyncRequests: 5, // 同时加载的模块数量最多是5个，只分割出同时引入的前5个文件
            maxInitialRequests: 3, // 首页加载的时候引入的文件最多3个
            automaticNameDelimiter: '~', // 缓存组和生成文件名称之间的连接符
            name: true, // 缓存组里面的filename生效，覆盖默认命名
            cacheGroups: {
               libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: -10,
                  chunks: 'initial'
               },
               commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 2, //  minimum common number
                  priority: 10,
                  reuseExistingChunk: true
               },
            }
         },
         runtimeChunk: {
            name: 'manifest'
         },
      },
      externals
   },
   css: {
      extract: false
   },
   devServer: {
      proxy: {
         '/api': {
            target: 'http://localhost:3000',
            changeOrigin: true,
            ws: true,
            pathRewrite: {
               '^/api': ''
            }
         },
         'm7': {
            target: 'http://m7.music.126.net',
            changeOrigin: true,
            ws: true,
            pathRewrite: {
               '^/m7': ''
            }
         },
         'm701': {
            target: 'http://m701.music.126.net',
            changeOrigin: true,
            ws: true,
            pathRewrite: {
               '^/m701': ''
            }
         },
         'm8': {
            target: 'http://m8.music.126.net',
            changeOrigin: true,
            ws: true,
            pathRewrite: {
               '^/m8': ''
            }
         },
         'm801': {
            target: 'http://m801.music.126.net',
            changeOrigin: true,
            ws: true,
            pathRewrite: {
               '^/m801': ''
            }
         }
      }
   },
}
