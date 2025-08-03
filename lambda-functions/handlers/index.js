const getProperty = require('./get-property');
const getProperties = require('./get-properties');

module.exports = {
  getProperty: getProperty.handler,
  getProperties: getProperties.handler
};