Real-estate frontend module

How to use
- Import `FRONTEND/src/real-estate/pages/Listing.jsx` and `PropertyDetail.jsx` into your app routes.

Example React Router (vite app):

```jsx
import Listing from './real-estate/pages/Listing';
import PropertyDetail from './real-estate/pages/PropertyDetail';

<Route path="/real-estate" element={<Listing/>} />
<Route path="/real-estate/property/:slug" element={<PropertyDetail/>} />
```
