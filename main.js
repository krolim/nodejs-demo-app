var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var app = express();
var PORT = process.env.PORT || 3000;
var url = 'mongodb://localhost:27017/test';
var dbclient = mongodb.MongoClient;

app.use(bodyParser.json());

console.log(process.env.VCAP_SERVICES);
if (process.env.VCAP_SERVICES) {
	json = JSON.parse(process.env.VCAP_SERVICES);
	console.log(json.mongodb[0]); 
	url = JSON.parse(process.env.VCAP_SERVICES).mongodb[0].credentials.uri;
	console.log(url);
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
   console.log(body);
   //var doc = JSON.parse(body);
   db.collection('products').insertOne( body, 
   	function(err, result) {
	    if (err == null) {
	    	console.log("Inserted a document into the products collection. " + result);
	    	callback("Insert OK");
	    } else {
	    	console.log("Error during insert: " + err);
	    	callback("Error");	
	    }
  });
};

var findProducts = function(db, callback) {
   var result = [];
   var cursor =db.collection('products').find( );
   cursor.each(function(err, doc) {  
      if (doc != null) {
         result.push(doc);
         //console.log(result);
      } else {
         callback(result);
      }
   });
};


app.get('/products', function (req, res) {
  dbclient.connect(url, function(err, db) {
  	if (err != null) {
    	console.log("Error connecting:  " + err);
    } 
  	findProducts(db, function(result) {
  	  res.status(200).send(result);
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
  	insertDocument(db, req.body, function(result) {
  	  res.status(200).send(result);
      db.close();
  	});
  });
});

app.use(express.static('webapp'));

app.listen(PORT, function () {
  console.log('Server running on http://localhost:' + PORT);
});

