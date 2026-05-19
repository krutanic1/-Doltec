const path = require('path');
const Module = require('module');
const originalRequire = Module.prototype.require;
Module.prototype.require = function (request) {
  if (request === './db' || request === '../db') {
    return { connectDB: async () => Promise.resolve(), mongoose: { modelNames: () => [] } };
  }
  return originalRequire.apply(this, arguments);
};
const root = process.cwd();
const modulesToTest = [
  './controllers/authController',
  './controllers/leadController',
  './controllers/inquiryController',
  './routes/leadRoutes',
  './routes/inquiryRoutes',
  './routes/authRoutes',
  './routes/propertyRoutes',
].map(m => path.resolve(root, m));
for (const mod of modulesToTest) {
  try {
    require(mod);
    console.log(`Imported: ${path.relative(root, mod)}`);
  } catch (err) {
    console.error(`Failed import: ${path.relative(root, mod)}`, err && err.message);
    process.exitCode = 2;
  }
}
console.log('Import smoke test completed');
