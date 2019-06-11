const fs = require('fs');
const handlebars = require('handlebars');
const Languages = require('./languages.json');

fs.readFile('docker-compose.hbs', 'utf-8', function(error, source) {
  const template = handlebars.compile(source);
  const yml = template(Languages);
  fs.writeFileSync('./docker-compose.yml', yml);
});
