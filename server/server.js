var express = require('express');
var request = require('request');
var server = express();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const answerAPI = require('./api/answer.js');
var port = process.env.PORT || 8080;

server.use(bodyParser.json()); // support json encoded bodies
server.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

// a sample request object with url to fetch id for movie in query param
var getIdRequest = {
    method: "GET",
    url: "https://api.themoviedb.org/3/search/movie",
    qs: {api_key: "b9ba76892aceca8cadef96bae5ca959b", page: "1", query: ""},
    headers: {
        //authorization: "Bearer <<access_token>>",
        "content-type": "application/json;charset=utf-8"
    },
    body: {},
    json: true
};

function getMovieId(movie, callback) {
    id = undefined;
    // this line will add movie param to request 
    getIdRequest.qs.query = movie;
    request(getIdRequest, function (error, response, body) {
        if (error) throw error;
        results = body.results;
        if (results.length != 0){
            id = results[0].id;
            callback(id);
        }
    });
}

function getIdMessage(id, movie) {
    message = "ID for " + movie + " is " + id;
    return message;
}


// sample server api
server.post('/webhook', function (req, res) {
    var body, movie, intent, id, result;
    body = req.body;
    movie = body.queryResult.parameters.movie;
    intent = body.queryResult.intent.displayName;
    id = undefined;

    result = {
        "fulfillmentText": "",
        "fulfillmentMessages": [{
            "text": {
                "text": [
                    ""
                ]
            }
        }],
        "source": ""
    };

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    if(!movie || movie.length < 1){
        result.fulfillmentMessages[0].text.text[0] = "Sorry, I don't have any information for this movie";
        res.json(result);
    }else{
        switch (intent) {
            case "NeedId":
                getMovieId(movie, function (id) {
                    message = getIdMessage(id, movie);
                    result.fulfillmentMessages[0].text.text[0] = message;
                    res.json(result);
                });
                break;
    
            case "NeedTrending":
                
                break;
    
            case "NeedRating":
                
                break;
    
            case "NeedPrimaryInfo":
                
                break;
            
            case "NeedReleaseInfo":
                
                break;
    
            case "NeedAlternativeTitles":
                
                break;
    
            default:
                res.json(result);
        }
    }


});

server.post('/answer', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    body = req.body;
    query = body.query;
    answerAPI.getAnswer(query, function(data){
        res.send(data);
    });
});

server.use(function (req, res, next) {
    res.status(404).send("Sorry, not found");
});

server.listen(port, function () {
    console.log('server listening on port ' + port);
    console.log('Press CTRL + C to stop server');
});