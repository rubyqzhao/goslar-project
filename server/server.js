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
        console.log()
        if (results.length != 0) {
            id = results[0].id;
            //console.log("calling callback with id" + id);
            callback(id);
        }
    });
}

function getIdMessage(id, movie) {
    message = "ID for " + movie + " is " + id;
    return message;
}

function getRating(movie, callback) {
    console.log(JSON.stringify(reviewRequest));
    reviewRequest.qs.query = movie;
    request(reviewRequest, function (error, response, body) {
        if (error) throw error;
        result = body.results[0].vote_average;
        console.log("Result: " + result);
        callback(result);
    });
}

function getRatingMessage(movie, rating) {
    rating = parseFloat(rating);
    if (rating < 5) {
        message = "I would not bother watching " + movie + ". It is rated " + rating;
    }
    else if (rating >= 5 && rating < 7) {
        message = movie + " is average. It's rated " + rating;
    }
    else if (rating >= 7 && rating < 9) {
        message = movie + " is a pretty good movie! It's rated " + rating + "!";
    }
    else if (rating >= 9) {
        message = "How have you not seen " + movie + " yet!? It's rated " + rating + "!!!";
    }
    else {
        message = "Sorry, I didn't get any results for that movie.";
    }
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
            getRating(movie, function (ratingResult) {
                message = getRatingMessage(movie, ratingResult);
                result.fulfillmentMessages[0].text.text[0] = message;
                res.json(result);
            });
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
});

//GET request for getting review of the movie from theMovieDb API
var reviewRequest = {
    method: "GET",
    url: "https://api.themoviedb.org/3/search/movie",
    qs: {api_key: "b9ba76892aceca8cadef96bae5ca959b", page: "1", qs: ""},
    headers: {
        //authorization: "Bearer <<access_token>>",
        "content-type": "application/json;charset=utf-8"
    },
    body: {},
    json: true
};

// API to call theMovieDb api to get review of the movie

server.use(function (req, res, next) {
    res.status(404).send("Sorry, not found");
});

server.listen(port, function () {
    console.log('server listening on port ' + port);
    console.log('Press CTRL + C to stop server');
}); 