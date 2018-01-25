// Support TLS-specific URLs, when appropriate.
if (window.location.protocol == "https:") {
  var ws_scheme = "wss://";
} else {
  var ws_scheme = "ws://"
};


var inbox = new ReconnectingWebSocket(ws_scheme + location.host + "/receive");
var outbox = new ReconnectingWebSocket(ws_scheme + location.host + "/submit");

inbox.onmessage = function(message) {
  var data = JSON.parse(message.data);
  var id = data.id ? data.id : '';
  delete data["id"];
  $("#chat-text").append("<div class='panel panel-default'><div class='panel-heading'>"
                     + $('<span/>').text(id + ":").html()
                     + "</div><div class='panel-body'>"
                     + $('<span/>').text(JSON.stringify(data)).html()
                     + "</div></div>");
  console.log(message.data);
  $("#chat-text").stop().animate({
    scrollTop: $('#chat-text')[0].scrollHeight
  }, 800);
};

inbox.onclose = function(){
    console.log('inbox closed');
    this.inbox = new WebSocket(inbox.url);

};

outbox.onclose = function(){
    console.log('outbox closed');
    this.outbox = new WebSocket(outbox.url);
};

$("#input-form").on("submit", function(event) {
  event.preventDefault();
  var key = $("#input-key")[0].value;
  var value   = $("#input-value")[0].value;
  output = { "id": "user" }
  output[key] = value
  outbox.send(JSON.stringify(output));
  $("#input-key")[0].value = "";
  $("#input-value")[0].value = "";
});
