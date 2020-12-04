const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();
const API_KEY = process.env.API_KEY;

router.get('/', async(req, res) => {
   
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

module.exports = router;


// sequelize model:create --name favorite --attributes firstName:string,lastName:string,age:integer,email:strin