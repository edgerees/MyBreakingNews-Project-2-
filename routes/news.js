const express = require('express');
const router = express.Router();
const axios= require('axios');
const db = require('../models');
require('dotenv').config();
const API_KEY = process.env.API_KEY;

const passport = require('../config/ppConfig');
const methodOverride = require('method-override')
const isLoggedIn = require('../middleware/isLoggedIn');

router.use(methodOverride('_method'))




router.get('/news', async(req, res) => {
   
    try {
        const newsAPI = await axios.get(`http://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`)       
        // console.log(newsAPI.data)
        res.render('news', {articles: newsAPI.data.articles})
    } catch (err) {
        if(err.response) {
            console.log(err.response.data)
            console.log(err.response.status)
            console.log(err.response.headers)
            res.render('news', { articles : null })
        } else if(err.request) {
            res.render('news', { articles : null })
            console.log(err.request)
        } else {
            res.render('news', { articles : null })
            console.error('Error', err.message)
        }
    } 
})

router.post('/', async(req, res) => {
    let search = req.params.search
    try {
        const newsAPI = await axios.get(`https://newsapi.org/v2/everything?q=${search}&apiKey=${API_KEY}`)
        res.render('newsSearch', { articles : newsAPI.data })
        console.log({ articles : newsAPI.data });
    } catch (err) {
        if(err.response) {
            res.render('newsSearch', { articles : null })
            console.log(err.response.data)
            console.log(err.response.status)
            console.log(err.response.headers)
        } else if(err.request) {
            res.render('newsSearch', { articles : null })
            console.log(err.request)
        } else {
            res.render('newsSearch', { articles : null })
            console.error('Error', err.message)
        }
    } 
})

router.get('userArticles', isLoggedIn, (req, res) => {
    db.user.findOne({
      where: { id: req.user.id },
      include: db.article
  
      
    }).then((user) => {
    // db.article.findAll
      if (!user) throw Error()
      db.article.findAll().then((allArticles => {
        let userArticles = allArticles.filter((cat) => {
          return user.articles.map((c) => c.id).includes(cat.id)
      
    })
        res.render('userArticles', {articles: userArticles})
  
      })).catch(err => {
        console.log(err);
        res.status(400).render('main/404')
    })
      
    })
  })
  
  router.post('userArticles', isLoggedIn, (req, res) => {
    db.user.findOne({
      where: { id: req.user.id }
    }).then((user) => {
      db.article.findOrCreate({
        where: {
          article: req.body.articleID
        },
        defaults: {
          title: req.body.Title,
          urlToImage: req.body.UrlToImage
        }
      }).then((articleReport) => {
        const article = articleReport[0]
        article.addUser(user).then(() => {
          res.redirect('userArticles')
  
        }).catch(err => {
          console.log(err);
          res.status(400).render('main/404')
      })
      })
    })
    
  })
  



module.exports = router;

