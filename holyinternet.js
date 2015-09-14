var sys = require('sys')
var exec = require('child_process').exec;
var fs = require('fs');
var express = require('express');
var app = express();
app.use(express.static('public'));
var marker = '--------------------------';



app.get('/pray.to.me', function(req, res){
	console.log('received prayer');
	var primetext = req.query.prayer;
	var command;
  	if (primetext.length == 0)
  	{
  		res.send('');
  	}
  	var log_string = req.ip + ' ' + primetext;
	fs.writeFile("./log", log_string, function(err) {
	    if(err) {
	        return console.log(err);
	    }
	});


   	exec("th sample.lua cv/model.t7 -gpuid -1 -primetext '" + primetext + "'", function(error, stdout, stderr){
		console.log(stdout);
		var index = stdout.indexOf(marker);
		//console.log(index);
		//console.log(primetext);
		if (index > -1)
		{
			stdout = stdout.substring(index + marker.length + 5);
		}
		stdout = stdout.replace(/(\w* \d*:\d*)/g, '\n\n');
		stdout = stdout.replace('¶', '');
		stdout = stdout.replace('[', '');
		stdout = stdout.replace(']', '');
		stdout = stdout.substring(0,stdout.lastIndexOf('.') + 1);
		//stdout = encodeURIComponent(stdout);
		console.log(stdout);
		res.send(stdout);
  	});  		

});

app.listen(3000);

