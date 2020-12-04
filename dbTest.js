const db = require('./models');

db.article.create({
  title: 'United States'
}).then(function(art) {
  console.log('Created: ', art.name)
})

db.article.findAll().then(function(art) {
  console.log('Found: ', art.name)
})