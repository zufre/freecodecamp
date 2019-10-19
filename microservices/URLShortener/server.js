'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
const bodyParser = require('body-parser');
const validURL = require('valid-url');
const dns = require('dns');
var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGOLAB_URI);

app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.urlencoded({extended: false}));

const schema = mongoose.Schema({url: {type: String}});
const urlmodel = mongoose.model('urlmodel', schema);

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});
app.get('/new/*', (req, res) => {
  console.log("GET");
  console.log(req.params[0])
    urlmodel.findById(req.params[0], (err, data) => {
      if (err) console.log("err findById")
      if (data) {
        console.log("redirecting...");
        console.log(data.url);
        res.redirect(data.url);
      }
      else {
        res.send("short url not found")  
      }
    })
})

app.post('/api/shorturl/new', (req, res) => {
  console.log('POST')
  
  if (!validURL.isUri(req.body.url)) res.send({err: "invalid url"})
  // urlmodel.deleteMany((err,data) => {console.log("remove all")});
  urlmodel.findOne({url: req.body.url}, (err, data) => {
    if (err) console.log("error posting");
    if (data) {
      console.log("finding");
      console.log(data);
      res.send({original_url:data.url, short_url: data._id})
    }
    else {
      console.log("not finding");
      var newUrl = new urlmodel({url: req.body.url});
      newUrl.save((err, data) => {
        if (err) throw err;
        console.log("saving "+data)
      })
    }
  });

})
app.listen(port, function () {
  console.log('Node.js listening ...');
});
