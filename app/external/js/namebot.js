var botui = new BotUI('flixbot');

function greeting() {
    botui.message
        .bot({
            delay: 1000,
            content: 'Hi! I am Flix Bot. <br> What is your name?'
        })
        .then(function () {
            return botui.action.text({
                delay: 1000,
                action: {
                    value: ''
                }
            })
        });
}

greeting();