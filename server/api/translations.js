var request = require('request');

// request object to fetch data about translated languages
var transLangRequest = {
    method: "GET",
    url: "",
    qs: {
        api_key: "b9ba76892aceca8cadef96bae5ca959b",
        page: "1"
    },
    headers: {
        //authorization: "Bearer <<access_token>>",
        "content-type": "application/json;charset=utf-8"
    },
    body: {},
    json: true
};

// function to create a displayable message for translated languages
function getTransLangMsg(transLang) {
    str = "This movie has been translated into the following languages:";
    for (var i = 0; i < transLang.length; i++) {
        str += "\n" + transLang[i];
    }
    return str;
}

// function to call movieDB API to get translated languages
function getTransLang(movie, callback) {
    transLangRequest.url = "https://api.themoviedb.org/3/movie/" + movie;
    request(transLangRequest, function (error, response, body) {
        if (error) throw error;
        langs = body.spoken_languages;
        output = [];
        langs.forEach(item => {
            output.push(item.name);
        });

        if (output.length > 0) {
            callback(output);
        }
    });
}

exports.getTransLang = getTransLang;
exports.getTransLangMsg = getTransLangMsg;