Real-estate backend module

Integration
- Require and mount `BACKEND/src/real-estate/routes/realEstateRoutes.js` into your main Express app.

Example (in your `server.js` or `app.js`):

```js
const realEstateRoutes = require('./src/real-estate/routes/realEstateRoutes');
app.use(realEstateRoutes);
```
