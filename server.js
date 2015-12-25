var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/builders');

var bodyParser = require('body-parser');
var winston = require('winston');
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

winston.add(
    winston.transports.File, {
      filename: 'server.log',
      level: 'info',
      json: true,
      eol: 'n',
      timestamp: true
    }
);

var port = process.env.PORT || 8080;

var router = express.Router();

router.get('/', function(req, res){
       res.sendfile('./public/index.html');
});

var Project = require('./models/project')

app.use('/', router);
app.listen(port);
