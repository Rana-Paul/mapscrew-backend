const http = require("http");
const app = require("./index.js");
const server = http.createServer(app);
server.listen(8000, console.log("app running..."));