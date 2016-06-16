var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var app = express();

var PORT = process.env.PORT || 3000;
var url = 'mongodb://localhost:27017/test';
var dbclient = mongodb.MongoClient;

app.use(bodyParser.json());
app.use(express.static('webapp'));

if (process.env.VCAP_SERVICES) {
	json = JSON.parse(process.env.VCAP_SERVICES);
	url = json.mongodb[0].credentials.uri;
}

dbclient.connect(url, function(err, db) {
  if (err == null) {
  	console.log("Connected correctly to server.");
  	db.close();	
  } else {
  	console.log("Error connecting: " + err);
  }  
});

var insertDocument = function(db, body, callback) {
   db.collection('products').insertOne( body, 
   	function(err, result) {
	    if (err == null) {
	    	console.log("Inserted a document into the products collection. Result: %j", result);
	    	callback();
	    } else {
	    	console.error("Error during insert: " + err);
	    	callback("Error: " + err);	
	    }
  });
};

var findProducts = function(db, callback) {
   db.collection('products').find( ).toArray(function(error, response) {
     callback(error, response);
   });
};


app.get('/products', function (req, res) {
  dbclient.connect(url, function(err, db) {
  	if (err != null) {
    	console.log("Error connecting:  " + err);
    } 
  	findProducts(db, function(err, result) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(result);  
      }
      db.close();
  	});
  });
});

app.post('/products', function (req, res){
	console.log(req.body);
	dbclient.connect(url, function(err, db) {
  	if (err != null) {
    	console.log("Error connecting:  " + err);
    } 
  	insertDocument(db, req.body, function(err) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send();  
      }
      db.close();
  	});
  });
});


app.listen(PORT, function () {
  console.log('Server running on http://localhost:' + PORT);
});

