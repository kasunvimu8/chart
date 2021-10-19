import Centrifuge from "centrifuge";

const tagsToReplace = {'&': '&amp;', '<': '&lt;', '>': '&gt;'};
var sub1
function replaceTag(tag) {return tagsToReplace[tag] || tag;}
function safeTagsReplace(str) {return str.replace(/[&<>]/g, replaceTag);}

function unsubscribeToken() {
    sub1.unsubscribe().then(function(result) {
        console.log('successfully unsubscribed');
    }, function(err) {
        console.log("error while unsubscribing");
    });
}

const channel = "chat:index";

const ChartDataProvider = (chartType, symbol, chartDataReceivedCallback) => {
    // const input = document.getElementById("input");
    // const container = document.getElementById('messages');

    const centrifuge = new Centrifuge('wss://stock-api.fnotrader.com/connection/websocket');

    // bind listeners on centrifuge object instance events.
    centrifuge.on('connect', function(ctx){
        drawText('Connected with client ID ' + ctx.client + ' over ' + ctx.transport);
        // input.removeAttribute("disabled");
    });

    centrifuge.on('disconnect', function(ctx){
        drawText('Disconnected: ' + ctx.reason + (ctx.reconnect?", will try to reconnect":", won't try to reconnect"));
        // input.setAttribute('disabled', 'true');
    });

    const subscribeForSymbol = (symbol) => {
        sub1 = centrifuge.subscribe(symbol, handleDataMessage)
            .on("join", handleJoin)
            .on("leave", handleLeave)
            .on("unsubscribe", handleUnsubscribe)
            .on("subscribe", handleSubscribe1)
            .on("error", handleSubscribeError);
    };

    // subscribe on channel and bind various event listeners. Actual
    // subscription request will be sent after client connects to
    // a server.
    const sub = centrifuge.subscribe(channel, handleMessage)
        .on("join", handleJoin)
        .on("leave", handleLeave)
        .on("unsubscribe", handleUnsubscribe)
        .on("subscribe", handleSubscribe)
        .on("error", handleSubscribeError);


    // Trigger actual connection establishing with a server.
    // At this moment actual client work starts - i.e. subscriptions
    // defined start subscribing etc.
    
    centrifuge.connect();

    // subscibing for symbol
    
    setTimeout(() => subscribeForSymbol(symbol), 1000);
    
    let count = 0;
    setInterval(function(){
        const d = {
            time: 1634636539+count,
            value: Math.random() * (2705 - 2730) + 2705
        }
        chartDataReceivedCallback(d);
        count= count+60;
        }, 2000);

    function handleSubscribe(ctx) {
        drawText('Subscribed on channel ' + ctx.channel + ' (resubscribed: ' + ctx.isResubscribe + ', recovered: ' + ctx.recovered + ')');
        showPresence(sub);
    }
    function handleSubscribe1(ctx) {
        drawText('Subscribed on channel ' + ctx.channel + ' (resubscribed: ' + ctx.isResubscribe + ', recovered: ' + ctx.recovered + ')');
        showPresence(sub1);
    }

    function handleSubscribeError(err) {
        drawText('Error subscribing on channel ' + err.channel + ': ' + err.message);
        console.log("subscription failed", err);
    }

    function handleMessage(message) {
        console.log("new message received", message);
        let clientID;
        if (message.info){
            clientID = message.info.client;
        } else {
            clientID = null;
        }
        const inputText = message.data["input"].toString();
        const text = safeTagsReplace(inputText) + ' <span class="muted">from ' + clientID + '</span>';
            console.log(text)
        drawText(text);
    }

    function handleDataMessage(message) {
        // console.log("Data ", message);
        const myJSON = JSON.stringify(message);
        const text = safeTagsReplace(myJSON);
        drawText(text);

        const data = JSON.parse(text);
        const d = { 
            time: data["data"]["ext"],
            value: data["data"]["lp"]
        }
        // chartDataReceivedCallback(d);
    }

    function handleJoin(message) {
        console.log("subscription join event fired", message);
        drawText('Client joined channel ' + this.channel + ' (uid ' + message.info["client"] + ', user '+ message.info["user"] +')');
    }

    function handleLeave(message) {
        console.log("subscription leave event fired", message);
        drawText('Client left channel ' + this.channel + ' (uid ' + message.info["client"] + ', user '+ message.info["user"] +')');
    }

    function handleUnsubscribe(sub) {
        drawText('Unsubscribed from channel ' + sub.channel);
    }

    function showPresence(sub) {
        sub.presence().then(function(result) {
            let count = 0;
            for (let key in result.presence){
                count++;
            }
            drawText('Presence: now in this room – ' + count + ' clients');
        }, function(err) {
            drawText("Presence error: " + JSON.stringify(err));
        });
    }

    function drawText(text) {
        // let e = document.createElement('li');
        // e.innerHTML = [(new Date()).toString(), ' ' + text].join(':');
        // container.insertBefore(e, container.firstChild);
        // console.log(text)
    }
};

export default ChartDataProvider;