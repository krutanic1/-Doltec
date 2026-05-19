const app = require('../server');

function listRoutes() {
  const routes = [];
  app._router.stack.forEach(layer => {
    if (layer.route) {
      const methods = Object.keys(layer.route.methods).join(',').toUpperCase();
      routes.push({ path: layer.route.path, methods });
    } else if (layer.name === 'router' && layer.handle && layer.handle.stack) {
      layer.handle.stack.forEach(r => {
        if (r.route) {
          const methods = Object.keys(r.route.methods).join(',').toUpperCase();
          routes.push({ path: r.route.path, methods });
        }
      });
    }
  });
  console.log(JSON.stringify(routes, null, 2));
}

// Delay to allow server startup
setTimeout(listRoutes, 1000);
