module.exports = {
  publicPath: './',
  configureWebpack: {
    resolve: {
      alias: {
        "src": "@"
      }
    }
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/assets/scss/variable.scss";
          @import "@/assets/scss/mixin.scss";
        `
      }
    }
  }
}