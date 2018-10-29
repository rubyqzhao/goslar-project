var express = require('express');
var request = require('request');
var server = express();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

var port = process.env.PORT || 8080;

server.use(bodyParser.json()); // support json encoded bodies
server.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

var getIdRequest = {
// a sample request object with url to fetch id for movie in query param

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
        if (results.length != 0) {
            id = results[0].id;
            callback(id);
        }
    });
}

function getIdMessage(id, movie) {
    message = "ID for " + movie + " is " + id;
    return message;
}

function getReleaseInfo(id, callback) {
    var urlString = "https://api.themoviedb.org/3/movie/"+id+"/release_dates";
    releaseInfoRequest.url = urlString;
    request(releaseInfoRequest, function (error, response, body) {
        if (error) throw error;
        var releaseDate;
        for (var i = 0; i < response.body.results.length; i++) {
            if (body.results[i]['iso_3166_1'] === "US") {
                releaseDate = response.body.results[i]['release_dates'][0].release_date;
            }
        }
        callback(releaseDate);
    });
}

function getReleaseInfoMessage(movie, releaseInfo) {
    console.log("Movie name: "+ movie);
    message = movie + " was released on " + releaseInfo;
    return message;
}

// sample server api
server.post('/webhook', function (req, res) {
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
            getMovieId(movie, function (id) {
                getReleaseInfo(id, function (releaseInfoResult) {
                    message = getReleaseInfoMessage(movie, releaseInfoResult);
                    result.fulfillmentMessages[0].text.text[0] = message;
                    res.json(result);
                });
            });
            break;

        case "NeedAlternativeTitles":
            break;

        default:
            res.json(result);
    }
});

//GET request for getting review of the movie from theMovieDb API
var releaseInfoRequest = {
    method: "GET",
    url: "https://api.themoviedb.org/3/movie/id/release_dates",
    qs: {api_key: "b9ba76892aceca8cadef96bae5ca959b", page: "1"},
    headers: {
        //authorization: "Bearer <<access_token>>",
        "content-type": "application/json;charset=utf-8"
    },
    body: {},
    json: true
};

// API to call theMovieDb api to get review of the movie
server.get('/reviews', function (req, res) {
    request(reviewRequest, function (error, response, body) {
        if (error) throw error;
        result = body.results[0].content;
        res.send(result);
    });
});
server.use(function (req, res, next) {
    res.status(404).send("Sorry, not found");
});

server.listen(port, function () {
    console.log('server listening on port ' + port);
    console.log('Press CTRL + C to stop server');
}); 