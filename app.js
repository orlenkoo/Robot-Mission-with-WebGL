var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongo = require('./mongo/mongo-client');
var cors = require('cors');
const responseTime = require('response-time');
const expressip = require('express-ip');


var indexRouter = require('./routes/index');

var app = express();


app.use(cors());
app.use(expressip().getIpInfoMiddleware);
app.use(responseTime());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* ADDING SUPPORT FOR ARRAY BASED JSONS */
app.use((req, res, next) => {
    const keysToConvert = [
        "parameters",
        "similar",
        "includes",
        "data_type",
        "alias",
        "ui_alias",
        "paginate",
        "render",
        "render_result",
        "android_display_options",
        "modification_obj"
    ];

    try {
        const arrayToJson = (arr) => {
            if (arr && arr.length && typeof arr[0] === "string") return arr;
            const json = {};
            arr.forEach((item)=> {
                json[ item.key ] = item.value;
            });
            return json;
        };

        Object.keys(req.body).forEach((req_key)=> {
            if (Array.isArray(req.body[req_key]) && keysToConvert.includes(req_key)) {
                req.body[req_key] = arrayToJson(req.body[req_key]);
            }
        });
    } catch (e) {
        res.log_send({
            message: "Error: " + e,
            success: false
        });
        console.log("some error in array to json: "+e);
        return;
    }


    next();
});


let tempClient = null;
app.use((req, res, next) => {
    const logOrNot = !req.originalUrl.includes("api_");

    if (tempClient) {
        req.mongoClient = tempClient;

        res.log_send = (obj) => {
            const client = req.mongoClient;
            const collection = client.db("watt_coin").collection("api_log");
            const ipInfo = req.ipInfo;

            const insertObj = { url: req.originalUrl, req_json: req.body, res_json: obj, time: new Date().getTime(), ipInfo};

            if (logOrNot) {
                collection.insertOne(insertObj, function (err, result) {
                    res.send(obj);
                });
            } else {
                res.send(obj);
            }
        };

        next();
    } else {
        mongo((client) => {
            tempClient = client;
            req.mongoClient = tempClient;

            res.log_send = (obj) => {
                const client = req.mongoClient;
                const collection = client.db("watt_coin").collection("api_logs");
                const ipInfo = req.ipInfo;

                const insertObj = {req_json: req.body, res_json: obj, time: new Date().getTime(), ipInfo};

                if (logOrNot) {
                    collection.insertOne(insertObj, function (err, result) {
                        res.send(obj);
                    })
                } else {
                    res.send(obj);
                }
            };

            next();
        });
    }
});

app.use('/', indexRouter);

module.exports = app;
