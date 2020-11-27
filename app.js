var express = require('express')
var bodyParser = require('body-parser');
var cors = require('cors')
var app = express()

var index = require('./routes/index')

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

app.use('/', index)

app.use(function (req, res, next) {
  res.status(404).send('Sorry cant find that!')
})

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(4000, function(){
    console.log('Server is listening on port 3000!')
})