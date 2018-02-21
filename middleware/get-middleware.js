// GET request middleware

// not currently using
// can require this file and use it
// EX: var middleware = require('./get-middleware'); 
// insert into middleware position of request: middleware.transformGetDateTime

module.exports = {
  // transform date/time request to JS
  transformGetDateTime: function (req, res, next) {
    console.log('middleware working!!', res);
    next();
  }
};