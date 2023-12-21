const { createProxyMiddleware } = require('http-proxy-middleware');

console.log('Proxy setup loaded');

module.exports = function(app) {
  app.use(
    '/gateway', // This is the api endpoint for the first URL
    createProxyMiddleware({
      target: 'https://currencyv8-cbem0hbz.uc.gateway.dev', // The first backend URL
      changeOrigin: true,
      pathRewrite: {
        '^/gateway': '', // Rewrite the path; remove '/api1' prefix when forwarding to the backend
      },
    })
  );
  
 
};
