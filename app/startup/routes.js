const express = require("express")
const helmet = require('helmet')
const morgan = require('morgan')
const path = require('path')
var cors = require('cors');
const corsOption = require('../middlewares/corsoptions')

const error = require('../middlewares/error.middleware')
require('express-async-errors')

module.exports = function (server) {

    /**
     * Middlewares
     */

    // console.log(corsOption);


    server.use(morgan('tiny'))
    server.use(express.json({ limit: "50mb" }));
    server.use(express.urlencoded({ limit: "50mb", extended: true }));
    server.use(helmet())
    // server.use(require("../middlewares/multer.middleware"));
    // server.use((req,res,next)=>{
    //     console.log(req.headers);
    //     next()
    // })
    // server.use(cors(corsOption))
    server.use(cors())
    //auth for device and Browser



    /**
     * Server Routes here
     */

    server.use("/api/referral", require("../routes/referral.routes"));
  server.use("/api", require("../routes/user.route"));
  server.get("/register", (req, res) => res.render(path.join(__dirname,'..','view', 'index.ejs')));
  server.get("/", (req, res) => res.render(path.join(__dirname,'..','view', 'index.ejs')));
  server.get("/loginPage", (req, res) => res.render(path.join(__dirname,'..','view', 'login.ejs')));
  server.get("/homePage", (req, res) => res.render(path.join(__dirname,'..','view','writeStream', 'home.ejs')));
    /**
     * error handling middleware
     */
    server.use(error)

}