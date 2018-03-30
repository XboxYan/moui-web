const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');
module.exports = function override(config, env) {
  config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);
  config = rewireLess.withLoaderOptions({
    modifyVars: {
      "@primary-color": "royalblue",
      "@icon-url": "'/assets/fonts/iconfont/iconfont'"
    },
  })(config, env);
  //console.log(''+process.env.NODE_ENV)
  // do stuff with the webpack config...
  return config;
};