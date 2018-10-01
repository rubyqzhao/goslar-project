var botui = new BotUI('flixbot');
var username = '';

function greeting() {
    botui.message
        .bot({
            delay: 1000,
            loading: true,
            content: 'Hi! I am Flix Bot. <br> What is your name?'
        }).then(function () {
            getName();
    })
}

function getName() {
    botui.action.text({
        action: {
            placeholder: "Your name"
        }
    }).then(function (res) {
        username = res.value;
        botui.message.add({
            delay: 1000,
            loading: true,
            content: "Hello " + username + ", how can I help you?"
        })
    }).then(function () {
        getQuery();
    })
}

function getQuery() {
    botui.action.text({
        action: {

        }
    }).then(function (res) {
        botui.message.add({
            delay: 1000,
            loading: true,
            content: "I'm sorry " + username + ", I don't know how to help with that."
        })
        }).then(function () {
            botui.message.add({
                delay:1000,
                content: "Can I help you with something else?"
            })
            getQuery();
    })
}

greeting();