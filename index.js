var restServer = require('@ravisahu88/restful-express-server');
// Load configurations or create custom object
const config = restServer.loadConfiguration();

// Create a server instance
const server = new restServer.RestfulExpressServer(config);

//  Load all middle-wares required for rest API development
server.pre();

// router group
let router = server.router();

// bind some routes
router.get('/ravi', (req, res) => {
    res.send({
        now: (Date.now()),
        ravi: true
    })
});
// binding any router
// or middleware
server.use(router);

// bind 404, exception handling, terminating middle-ware and start listening.
server.post().terminating().listen();
