module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
  },
  weapp: {},
  h5: {},
  plugins: {
    csso: {
      enable: true,
      config: {
        restructure: false,
      },
    },
  },
}