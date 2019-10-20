//https://boiled-gatsby.glitch.me

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// API endpoint
app.get("/api/timestamp/:date_string?", function (req, res) {
  
  let date = req.params.date_string;
  let unixDate;
  let utcDate;
  
  if (date === undefined) {
    unixDate = new Date().getTime();
    utcDate = new Date().toUTCString();
  }
  else if (new Date(date) && new Date(date) != "Invalid Date") {
    unixDate = new Date(date).getTime();
    utcDate = new Date(date).toUTCString();
  }
  
    
  else if (Number.isInteger(parseInt(date, 10))) {
    unixDate = date;
    utcDate = new Date(parseInt(date, 10)).toUTCString();
  }
  else if (unixDate || utcDate  != "Invalid Date") {
    res.json({error: "Invalid Date"});
    return;
  }
  
  res.json({unix: unixDate, utc: utcDate});
  
});



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
