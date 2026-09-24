require('dotenv').config({path: './.env'});
require('mongoose').connect(process.env.DATABASE_URL)
  .then(() => require('./models/Property').updateMany(
    { isAdminPost: true }, 
    { $set: { 'filters.intent': 'BUY' } }
  ))
  .then(r => console.log(r))
  .catch(console.error)
  .finally(() => process.exit(0));
