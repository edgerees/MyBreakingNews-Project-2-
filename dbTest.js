const db = require('./models');

db.article.create({
  title: 'this article',
  description: 'hello',
  urlToImage: 'todo.png'
}).then(function(art) {
  console.log('Created: ', art.title)
})

db.article.findAll().then(function(art) {
  console.log('Found: ', art.title)
})




