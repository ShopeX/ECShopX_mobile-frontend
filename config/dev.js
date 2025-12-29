// 处理 ECONNRESET 错误，避免进程崩溃
// 这个错误通常发生在 webpack watch 模式下连接被重置时
if (!process.listenerCount('uncaughtException')) {
  process.on('uncaughtException', (err) => {
    if (err.code === 'ECONNRESET' || err.message?.includes('ECONNRESET')) {
      console.warn('⚠️  连接重置错误已忽略:', err.message)
      return
    }
    throw err
  })
}

if (!process.listenerCount('unhandledRejection')) {
  process.on('unhandledRejection', (reason, promise) => {
    if (reason && typeof reason === 'object' && 'code' in reason && reason.code === 'ECONNRESET') {
      console.warn('⚠️  连接重置错误已忽略:', reason.message || reason)
      return
    }
    console.error('未处理的 Promise 拒绝:', reason)
  })
}

module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {},
  weapp: {},
  h5: {
    devServer: {
      // 处理连接重置错误，避免进程崩溃
      client: {
        overlay: {
          errors: true,
          warnings: false
        }
      }
    },
    webpackChain: (chain, webpack) => {
      // 添加错误处理插件
      chain.plugin('handle-errors').use(
        class {
          apply(compiler) {
            compiler.hooks.afterPlugins.tap('HandleErrors', () => {
              // 在插件初始化后设置错误处理
              if (!process.listenerCount('uncaughtException')) {
                process.on('uncaughtException', (err) => {
                  if (err.code === 'ECONNRESET' || err.message?.includes('ECONNRESET')) {
                    console.warn('⚠️  连接重置错误已忽略:', err.message)
                    return
                  }
                  throw err
                })
              }
              if (!process.listenerCount('unhandledRejection')) {
                process.on('unhandledRejection', (reason, promise) => {
                  if (
                    reason &&
                    typeof reason === 'object' &&
                    'code' in reason &&
                    reason.code === 'ECONNRESET'
                  ) {
                    console.warn('⚠️  连接重置错误已忽略:', reason.message || reason)
                    return
                  }
                  console.error('未处理的 Promise 拒绝:', reason)
                })
              }
            })
          }
        }
      )
    }
  },
  mini: {
    webpackChain: (chain, webpack) => {
      chain.merge({
        plugin: {
          install: {
            plugin: require('terser-webpack-plugin'),
            args: [
              {
                terserOptions: {
                  compress: true, // 默认使用terser压缩
                  // mangle: false,
                  keep_classnames: true, // 不改变class名称
                  keep_fnames: true // 不改变函数名称
                }
              }
            ]
          }
        }
      })

      // 添加错误处理插件
      chain.plugin('handle-errors').use(
        class {
          apply(compiler) {
            compiler.hooks.done.tap('HandleErrors', () => {
              // 在编译完成后设置错误处理
              if (!process.listenerCount('uncaughtException')) {
                process.on('uncaughtException', (err) => {
                  if (err.code === 'ECONNRESET' || err.message?.includes('ECONNRESET')) {
                    console.warn('⚠️  连接重置错误已忽略:', err.message)
                    return
                  }
                  throw err
                })
              }
              if (!process.listenerCount('unhandledRejection')) {
                process.on('unhandledRejection', (reason, promise) => {
                  if (
                    reason &&
                    typeof reason === 'object' &&
                    'code' in reason &&
                    reason.code === 'ECONNRESET'
                  ) {
                    console.warn('⚠️  连接重置错误已忽略:', reason.message || reason)
                    return
                  }
                  console.error('未处理的 Promise 拒绝:', reason)
                })
              }
            })
          }
        }
      )
    }
  }
}
