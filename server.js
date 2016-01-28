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
            var project         = new Project();
            project.name        = req.body.name;
            project.builder     = req.body.builder;
            project.type        = req.body.type;
            project.status      = req.body.status;
            project.area        = req.body.area;
            project.sqft        = Number(req.body.sqft);
            project.cost        = Number(req.body.cost);
            project.totalunits  = Number(req.body.totalunits);
            project.completionyear= Number(req.body.completionyear);
            project.numfloors   = Number(req.body.numfloors);
            project.numunits    = Number(req.body.numunits);
            project.location    = [Number(req.body.longitude), Number(req.body.latitude)];
            project.BHK         = Number(req.body.BHK);
            project.totalcost   = project.sqft*project.cost;
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
            var sqft1   = req.query.sqft1 ? Number(req.query.sqft1) : 0;
            var sqft2   = req.query.sqft2 ? Number(req.query.sqft2) : 100000;
            var minbudget = req.query.minbudget ? Number(req.query.minbudget) : 0;
            var maxbudget = req.query.maxbudget ? Number(req.query.maxbudget) : 100000000;
            var oneBHKchecked   = req.query.oneBHK ? (req.query.oneBHK == "true") : false;
            var twoBHKchecked   = req.query.twoBHK ? (req.query.twoBHK == "true") : false;
            var threeBHKchecked   = req.query.threeBHK ? (req.query.threeBHK == "true") : false;
            var fourBHKchecked   = req.query.fourBHK ? (req.query.fourBHK == "true") : false;
            var BHKs = [];
            if(oneBHKchecked===true){
                BHKs.push(1);
            }
            if(twoBHKchecked===true){
                BHKs.push(2);
            }
            if(threeBHKchecked===true){
                BHKs.push(3);
            }
            if(fourBHKchecked===true){
                BHKs.push(4);
            }

            Project.aggregate(
                { $match: {$and:[
                                {builder:   new RegExp('\.*' + builder + '\.*', "i")},
                                {name:      new RegExp('\.*' + project + '\.*', "i")},
                                {sqft:      {$gt: sqft1}},
                                {sqft:      {$lt: sqft2}},
                                {totalcost: {$gt: minbudget}},
                                {totalcost: {$lt: maxbudget}},
                                {BHK :      {$in: BHKs}}
                            ]}
                },
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

            project.name        = req.body.name ? req.body.name: project.name;
            project.builder     = req.body.builder ? req.body.builder:project.builder;
            project.type        = req.body.type ? req.body.type: project.type;
            project.status      = req.body.status ? req.body.status: project.status;
            project.area        = req.body.area ? req.body.area: project.area;
            project.sqft        = req.body.sqft ? Number(req.body.sqft): project.sqft;
            project.cost        = req.body.cost ? Number(req.body.cost): project.cost;
            project.completionyear= req.body.completionyear ? Number(req.body.completionyear): project.completionyear;
            project.totalunits  = req.body.totalunits ? Number(req.body.totalunits) : project.totalunits;
            project.numfloors   = req.body.numfloors ? Number(req.body.numfloors): project.numfloors;
            project.numunits    = req.body.numunits ? Number(req.body.numunits): project.numunits;
            var longitude = req.body.longitude ? Number(req.body.longitude): project.location[0];
            var latitude  = req.body.latitude ? Number(req.body.latitude): project.location[1];
            project.location = [longitude, latitude];
            project.BHK         = req.body.BHK ? Number(req.body.BHK) : project.BHK;
            project.totalcost   = project.sqft*project.cost;

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
