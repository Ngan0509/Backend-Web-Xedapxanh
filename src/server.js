import express from 'express';
import configViewEngine from './configs/viewEngine';
import initAPIRoute from './route/api'
import initWebRoute from './route/web'
import bodyParser from "body-parser"


require('dotenv').config();

const app = express()
const port = process.env.PORT || 8000

// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', process.env.URL_REACT);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// config app
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

// set up view engine
configViewEngine(app)

initWebRoute(app)
initAPIRoute(app)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})