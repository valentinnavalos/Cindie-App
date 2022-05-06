const { urlencoded } = require("express");
require("./db.js");
const app = require("express");

const AdminJS = require('adminjs');
const AdminJSExpress = require('@adminjs/express');
const AdminJSSequelize = require('@adminjs/sequelize');
AdminJS.registerAdapter(AdminJSSequelize);

const express = require("express");
const morgan = require('morgan');
const routes = require('./routes/index.js');
require("./db.js");

const path = require('path');
const server = express();

server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'ejs');
server.use(express.static(path.join(__dirname, 'public')));

server.name = "PG-IndieCine";
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(morgan("dev"));

server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

const con = require('./db.js').connect;

const adminJs = new AdminJS({
    databases: [con],
    rootPath: '/admin',
  })
  const router = AdminJSExpress.buildRouter(adminJs)
  server.use(adminJs.options.rootPath, router)
  

server.use("/", routes);

server.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || err;
    console.error(err);
    res.status(status).send(message);
});
  
module.exports = server;