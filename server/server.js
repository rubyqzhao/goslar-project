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

// function to call theMovieDb api to get list of trending movies
function getTrendingMovies(callback){
    request(trendingRequest, function(error, response, body) {
        if (error) throw error;
        results = body.results;
        output = [];    
        results.forEach(item => {
            output.push(item.original_title);
        });
        if (output.length > 0){
            callback(output);
        }
    });
};

function getTrendingMessage(trendingMovies){
    // this function creats proper messsage to show trending movies.
    ans = "Here is a list of top 5 trending movies : </br>";
    list = "";
    for(var i = 0;i < 5;i++){
        list += "" + [i+1] + ". " + trendingMovies[i] + "</br>";
    }
    ans += list;
    return ans;
}

function getIdMessage(id, movie) {
    message = "ID for " + movie + " is " + id;
    return message;
}

function getReleaseInfo(id, callback) {
    var urlString = "https://api.themoviedb.org/3/movie/" + id + "/release_dates";
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
    var releaseDate = new Date(releaseInfo);
    var monthNames = [
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ];
    const date = releaseDate.getDate();
    const month = releaseDate.getMonth();
    const year = releaseDate.getFullYear();
    message = movie + " was released on " + date + " " + monthNames[month - 1] + " " + year;
    return message;
}

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

// function to call movieDB API to get alternative movie titles
function getAltTitles(movie, callback) {
    altTitleRequest.url = "https://api.themoviedb.org/3/movie/" + movie + "/alternative_titles";
    request(altTitleRequest, function(error, response, body) {
        if (error) throw error;
        titles = body.titles;
        output = [];
        titles.forEach(item => {
            output.push(item.title);
            output.push(item.iso_3166_1);
        });

        if(output.length > 0) {
            callback(output);
        }
    });
}

// function to create a displayable message for alternative titles
function getAltTitleMsg(altTitles){
    str = "Some alternative titles include:";
    for(var i = 0; i < 3; i++) {
        str += "\n" +  altTitles[2*i] + " (" + altTitles[2*i+1] + ")";
    }
    return str;
}

// request object to fetch data about alternative movie titles
var altTitleRequest = {
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

var getPrimaryInfoRequest = {
    method: "GET",
    url: "https://api.themoviedb.org/3/movie/",
    qs: { api_key: "b9ba76892aceca8cadef96bae5ca959b", page: "1"},
    headers: {
        //authorization: "Bearer <<access_token>>",
        "content-type": "application/json;charset=utf-8"
    },
    body: {},
    json: true
};

function getPrimaryInfoMsg(body, movie, callback){
    //console.log(body);
    var msg = "Here is some info for " + movie + "</br></br>";
    if(body.genres && body.genres.length > 0){
        var genres = "Genres : ";
        body.genres.forEach(element => {
            genres = genres + " " + element.name;
        });
        msg += genres + "</br></br>";
    }
    
    var overview = "";
    
    overview = body.overview;
    if(body.overview){
        msg += "Overview: \"" + overview + "\"</br>";
    }
    callback(msg);
}


function getPrimaryInfo(id, movie, callback){
    getPrimaryInfoRequest.url = "https://api.themoviedb.org/3/movie/" + id;
    request(getPrimaryInfoRequest, function(error, response, body) {
        console.log(response);
        if (error)
            throw error;
        else
            callback(body);
    });
}

// sample server api
server.post('/webhook', function (req, res) {
    var body, movie, intent, id, result;
    body = req.body;
    movie = body.queryResult.parameters.movie;
    intent = body.queryResult.intent.displayName;
    id = undefined;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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
    if(intent !== "NeedTrending" && (!movie || movie.length < 1)){
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
                getTrendingMovies(function(trendingMovies){
                    message = getTrendingMessage(trendingMovies);
                    result.fulfillmentMessages[0].text.text[0] = message;
                    res.json(result);
                });
                break;
    
            case "NeedRating":
                getRating(movie, function (ratingResult) {
                    message = getRatingMessage(movie, ratingResult);
                    result.fulfillmentMessages[0].text.text[0] = message;
                    res.json(result);
                });
                break;
    
            case "NeedPrimaryInfo":
                //console.log(movie);
                getMovieId(movie, function(id){
                    //console.log(id);
                    getPrimaryInfo(id, movie, function(data){
                        getPrimaryInfoMsg(data, movie, function(msg){
                            result.fulfillmentMessages[0].text.text[0] = msg;
                            res.json(result);
                        });
                    });
                });
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
                getMovieId(movie, function(id) {
                    getAltTitles(id, function(altTitle){
                        msg = getAltTitleMsg(altTitle);
                        result.fulfillmentMessages[0].text.text[0] = msg;
                        res.json(result);
                    });
                });
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