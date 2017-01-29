var proxy = require('http-proxy-middleware');

var apiProxy = proxy('/v2', {
  target: 'http://localhost:7090',
  changeOrigin: true   // for vhosted sites
});

module.exports = {
  server: {
    middleware: {
      1: apiProxy
    }
  },
   port: 7000,
};
