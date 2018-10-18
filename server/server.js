var express = require('express');
var request = require('request');
var server = express();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

var port = process.env.PORT || 8080;

server.use(bodyParser.json()); // support json encoded bodies
server.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


// a sample dummy request object with sample url to fetch info about 
var dummyRequest = {
    method: "GET",
    url: "https://api.themoviedb.org/3/movie/550",
    qs: { api_key: "b9ba76892aceca8cadef96bae5ca959b", page: "1" },
    headers: {
        //authorization: "Bearer <<access_token>>",
        "content-type": "application/json;charset=utf-8"
    },
    body: {},
    json: true
};

// sample server api
server.get('/dummy', function (req, res) {
    // code to request moviedbapi
    //data from dialogflow i.e. moviename
    request(dummyRequest, function(error, response, body) {
        if (error) throw error;
        //log to check if result is received. this result is supposed to be sent to dialogflow via res.send()
        //console.log(body);
        res.send(response);        
    });
});

//GET request for getting trending movies from theMovieDb API
var trendingRequest = {
    method: "GET",
    url: "https://api.themoviedb.org/3/trending/movie/week",
    qs: { api_key: "b9ba76892aceca8cadef96bae5ca959b", page: "1" },
    headers: {
        //authorization: "Bearer <<access_token>>",
        "content-type": "application/json;charset=utf-8"
    },
    body: {},
    json: true
};

// api to call theMovieDb api to get list of trending movies
server.get('/trending', function (req, res) {
    request(trendingRequest, function(error, response, body) {
        if (error) throw error;
        results = body.results;
        output = [];    
        results.forEach(item => {
            output.push(item.original_title);
        });
        result = {};
        result.trendingMoviesList = output;
        res.send(result);    
    });
});

server.use(function(req, res, next) {
    res.status(404).send("Sorry, not found");
});

server.listen(port, function () {
    console.log('server listening on port ' + port);
    console.log('Press CTRL + C to stop server');
});