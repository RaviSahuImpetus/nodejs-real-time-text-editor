var http = require('http');
var restServer = require('@ravisahu88/restful-express-server');
var ShareDB = require('sharedb');
var richText = require('rich-text');
var WebSocket = require('ws');
var WebSocketJSONStream = require('@teamwork/websocket-json-stream');

ShareDB.types.register(richText.type);
var backend = new ShareDB();
createDoc(startServer);

// Create initial document then fire callback
function createDoc(callback) {
  var connection = backend.connect();
  var doc = connection.get('examples', 'richtext');
  doc.fetch(function(err) {
    if (err) throw err;
    if (doc.type === null) {
      doc.create([{insert: 'Hi!'}], 'rich-text', callback);
      return;
    }
    callback();
  });
}

function startServer() {
  // Load configurations or create custom object
  const config = restServer.loadConfiguration();

  // Create a server instance
  const serverInstance = new restServer.RestfulExpressServer(config);
  
  //  Load all middle-wares required for rest API development
  serverInstance.pre(); 

  // Create a web server to serve files and listen to WebSocket connections 
  serverInstance.static('static');
  serverInstance.static('node_modules/quill/dist');
  var app = serverInstance.getServer();
  var server = http.createServer(app);

  // Connect any incoming WebSocket connection to ShareDB
  var wss = new WebSocket.Server({server: server});
  wss.on('connection', function(ws) {
    var stream = new WebSocketJSONStream(ws);
    backend.listen(stream);
  });

  server.listen(8080);
}
