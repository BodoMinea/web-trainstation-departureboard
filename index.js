var exec = require('child_process').exec,
    cheerio = require('cheerio'),
    cheerioTableparser = require('cheerio-tableparser'),express = require('express'),
	app = express(),
	http = require('http').Server(app),
	io = require('socket.io')(http),
	data = [], output = [], newArray, stid;

app.use('/static', express.static('app/public'));

app.get('/board/:id*', function(req, res){
    res.sendFile(__dirname + '/app/view/board.html');
    stid = req.params['id'];
    console.log('Board active '+Date()+' '+stid);
      cmd = 'phantomjs station.js '+stid;

  exec(cmd, function(error, stdout, stderr) {
    $ = cheerio.load(stdout);
    cheerioTableparser($);
    data = $("table").parsetable(true, true, true);
    if (data.length != 0) { newArray = data[0].map(function(col, i) { 
        return data.map(function(row) { 
          return row[i] 
        })
      });
    newArray.shift();
    output = [];
    for (var i = 0; i < newArray.length; i++) {
      output.push({train: newArray[i][1], type: newArray[i][0], operator: newArray[i][2], from: newArray[i][3], to: newArray[i][7], arrive: newArray[i][5], depart: newArray[i][6], line: newArray[i][8], delay: newArray[i][4]});
    } }
    io.emit('name',req.query['name']);
    io.emit('data',JSON.parse(JSON.stringify(output)));
  });
});

setInterval(function() {
 // update every 15 mins
 console.log('Updating board '+Date()+' '+stid);
      cmd = 'phantomjs station.js '+stid;

  exec(cmd, function(error, stdout, stderr) {
    $ = cheerio.load(stdout);
    cheerioTableparser($);
    data = $("table").parsetable(true, true, true);
    if (data.length != 0) { newArray = data[0].map(function(col, i) { 
        return data.map(function(row) { 
          return row[i] 
        })
      });
    newArray.shift();
    output = [];
    for (var i = 0; i < newArray.length; i++) {
      output.push({train: newArray[i][1], type: newArray[i][0], operator: newArray[i][2], from: newArray[i][3], to: newArray[i][7], arrive: newArray[i][5], depart: newArray[i][6], line: newArray[i][8], delay: newArray[i][4]});
    } }
    io.emit('data',JSON.parse(JSON.stringify(output)));
  });
}, 15 * 60 * 1000);

http.listen(9090, function(){
  console.log('HTTP Board server active *:9090 ' + Date());
});