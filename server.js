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

router.route('/api/projects')
      .post(function(req, res) {
            var project     = new Project();

            project.name    = req.body.name;
            project.builder = req.body.builder;
            project.type    = req.body.type;
            project.status  = req.body.status;
            project.area    = req.body.area;
            project.completionyear = Number(req.body.completionyear);
            project.numfloors= Number(req.body.numfloors);
            project.numunits= Number(req.body.numunits);
            project.cost    = Number(req.body.cost);
            project.sqft1   = Number(req.body.sqft1);
            project.sqft2   = Number(req.body.sqft2);
            project.location= [Number(req.body.longitude), Number(req.body.latitude)];
            project.oneBHK  = req.body.oneBHK;
            project.twoBHK  = req.body.twoBHK;
            project.threeBHK= req.body.threeBHK;
            project.fourBHK = req.body.fourBHK;
            project.numoneBHK   = Number(req.body.numoneBHK);
            project.numtwoBHK   = Number(req.body.numtwoBHK);
            project.numthreeBHK = Number(req.body.numthreeBHK);
            project.numfourBHK  = Number(req.body.numfourBHK);

            project.save(function(err) {
                  if (err){
                      res.send(err);
                  }
                  res.json({ message: 'Project created!' });
            });
        })
      .get(function(req, res) {
            var builder = req.query.builder ? req.query.builder : '';
            var project = req.query.project ? req.query.project : '';
            var sqft1   = req.query.sqft1 ? req.query.sqft1 : 0;
            var sqft2   = req.query.sqft2 ? req.query.sqft2 : 100000;
            var oneBHK  = req.query.oneBHK ? req.query.oneBHK : false;
            var twoBHK  = req.query.twoBHK ? req.query.twoBHK : false;
            var threeBHK= req.query.threeBHK ? req.query.threeBHK : false;
            var fourBHK = req.query.fourBHK ? req.query.fourBHK : false;

            Project.find( { $and: [
                            {'builder':     new RegExp('\.*' + builder + '\.*', "i")},
                            {'name':        new RegExp('\.*' + project + '\.*', "i")},
                            {'sqft1':       {$gt : sqft1}},
                            {'sqft2':       {$lt: sqft2}},
                            { $or: [
                                {$and: [{oneBHK: true},{'oneBHK':oneBHK}]},
                                {$and: [{twoBHK: true},{'twoBHK':twoBHK}]},
                                {$and: [{threeBHK: true},{'threeBHK':threeBHK}]},
                                {$and: [{fourBHK: true},{'fourBHK':fourBHK}]},
                            ]}
                            ]},
                            function(err, projects) {

                                    if (err){
                                        res.send(err);
                                    }

                                    res.json(projects);
                            });
        });

router.route('/api/projects/:project_id')
      .get(function(req, res){
        Project.findById(req.params.project_id, function(err, project){
            if(err)
                res.send(err);

          res.json(project);
        });
       })
      .put(function(req, res) {
        Project.findById(req.params.project_id, function(err, project) {
            if (err)
                res.send(err);

        project.name = req.body.name;

        project.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Project updated!' });
        });
        });
      })
       .delete(function(req, res) {
               Project.remove({_id: req.params.project_id}, function(err, project) {
                    if (err)
                        res.send(err);

                    res.json({ message: 'Successfully deleted' });
                });
      });

var Project = require('./models/project')

app.use('/', router);
app.listen(port);
