var express = require('express');
var request = require('request');
var server = express();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

var port = process.env.PORT || 8080;

server.use(bodyParser.json()); // support json encoded bodies
server.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


// a sample request object with url to fetch id for movie in query param
var getIdRequest = {
    method: "GET",
    url: "https://api.themoviedb.org/3/search/movie",
    qs: { api_key: "b9ba76892aceca8cadef96bae5ca959b", page: "1", query: ""},
    headers: {
        //authorization: "Bearer <<access_token>>",
        "content-type": "application/json;charset=utf-8"
    },
    body: {},
    json: true
};

function getMovieId(movie, callback){
    id = undefined;
    // this line will add movie param to request 
    getIdRequest.qs.query = movie;
    request(getIdRequest, function(error, response, body) {
        if (error) throw error;
        results = body.results;
        console.log();
        if (results.length != 0){
            id = results[0].id;
            //console.log("calling callback with id" + id);
            callback(id);
        }
    });
}

function getIdMessage(id, movie){
    message = "ID for " + movie + " is " + id;
    return message;
}

// function to call movieDB API to get movie details
function getdetails(movie, callback){
    detailsRequest.url = "https://api.themoviedb.org/3/movie/" + movie + "/details";
    request(detailsTitleRequest, function(error, response, body) {
        if (error) throw error;
        dbTitles = body.titles;
        output = [];
        dbTitles.forEach(item => {
            output.push(item.title);
        });
        if(output.length > 0) {
            callback(output);
        }
    });
}

// function to create a displayable message for details
function get
TitleMsg(details){
    str = "details include:";
    for(var i = 0; i < details.length; i++){
        str += "\n" +  details[i];
    }
    return str;
}

// request object to fetch data about movie details
var detailRequest = {
    method: "GET",
    url: "",
    qs: { api_key: "b9ba76892aceca8cadef96bae5ca959b", page: "1" },
    headers: {
        //authorization: "Bearer <<access_token>>",
        "content-type": "application/json;charset=utf-8"
    },
    body: {},
    json: true
};

//API call to request MovieDB detail info
server.get('/details', function (req, res) {
    request(detailsRequest, function(error, response, body) {

    });
});

// sample server api
server.post('/webhook', function (req, res) {
    body = req.body;
    movie = body.queryResult.parameters.movie;
    intent = body.queryResult.intent.displayName;
    id = undefined;

    result = {
        "fulfillmentText" : "",
        "fulfillmentMessages": [{
            "text": {
                "text": [
                    ""
                ]
            }
        }],
        "source":""
    };

    switch(intent) {
        case "NeedId":
            getMovieId(movie, function(id){
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

        case "Needdetails":
            getdetails(movie, function(details){
                msg = getdetails(details);
                result.fulfillmentMessages[0].text.text[0] = msg;
                res.json(result);
            });
            break;
        
        default:
            res.json(result);
    }    
});

server.use(function(req, res, next) {
    res.status(404).send("Sorry, not found");
});

server.listen(port, function () {
    console.log('server listening on port ' + port);
    console.log('Press CTRL + C to stop server');
});
