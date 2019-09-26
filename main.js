const express = require('express')
const fs = require('fs');
const path = require('path');
const imageThumbnail = require('image-thumbnail');

const app = express();
const rootdir = './images/';
const baseurl = 'http://localhost:3000/';
const options = { width: 200, height: 200, responseType: 'buffer' };

app.get('/', function (req, res) {
  res.send('Hello, I am PhotographyServer.');
})

app.get('/list', function (req, res) {
  var param = path.resolve(rootdir);
  fs.stat(param, function (err, stats) {
    if (stats.isDirectory()) {      
      var data = [];
      fs.readdir(param, function (err, file) {
        file.forEach((e) => {
          if (fs.statSync(__dirname + rootdir.substr(1, rootdir.length - 1) + e).isFile() && e.toUpperCase().indexOf('.JPG') > 0)
          {
            var item = {};
            item.filename = e;
            item.url = baseurl + 'original/' + item.filename;
            item.thumbnail = baseurl + 'thumbnail/' + item.filename;
            data.push(item);
          }
        });
        res.send(JSON.stringify(data));
      });
    } else {
      //如果不是目录，打印文件信息
      res.send(JSON.stringify(data));
      console.log(param);
    }
  })  
})

app.get('/original/*', function (req, res) {
  // console.log(req.params);
  var filename = req.params["0"];
  res.sendFile( __dirname + rootdir.substr(1, rootdir.length - 1) + filename );
  console.log("Request for " + filename + " received.");
})

app.get('/thumbnail/*', function (req, res) {
  var filename = req.params["0"];
  imageThumbnail(__dirname + rootdir.substr(1, rootdir.length - 1) + filename, options)
    .then(thumbnail => {
      res.end(thumbnail);
    })
    .catch(err => console.error(err));

  // res.sendFile( __dirname + rootdir.substr(1, rootdir.length - 1) + filename );
  // console.log("Request for " + filename + " received.");
})

var server = app.listen(3000, function() {
  console.log('Express server listening on port ' + server.address().port);
});
