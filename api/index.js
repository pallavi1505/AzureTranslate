const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const port = 3000;
const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');
// const {errorHandler} = require('./middleware/errorHandler');
const { json } = require('express');
const { requestRateLimiter } = require('./middleware/requestRateLimiter');
require("dotenv").config();
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'build')))

app.get("/", async (req,re) => {
    res.sendFile(path.join(__dirname,"build","index.html"))
})


app.get('/translate', requestRateLimiter, function(req, res ,next) {
    axios({
        baseURL: process.env.endPoint,
        url: '/translate',
        method: 'post',
        headers: {
            'Ocp-Apim-Subscription-Key': process.env.apiKey,
             // location required if you're using a multi-service or regional (not global) resource.
            'Ocp-Apim-Subscription-Region': process.env.location,
            'Content-type': 'application/json',
            'X-ClientTraceId': uuidv4().toString()
        },
        params: {
            'api-version': '3.0',
            'from': req.query.from,
            'to': req.query.to
        },
        data: [{
            'text': req.query.text
        }],
        responseType: 'json'
    }).then(function(response){
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.send(JSON.stringify(response.data[0].translations[0]));
    }).catch(
        function (error) {
            if (error.response) {  
                next(error.response.status)  
            }    
    })
});




app.use((status,req,res,next)=>
{
    console.log(status);
    let err = new Error()
    switch (status) {
    case 400:
        err.name = "One of the query parameters is missing or not valid. Correct request parameters before retrying.";
        break;
    case 401:
        err.name = "The request couldn't be authenticated. Check that credentials are specified and valid.";
        break;
    case 403:
        err.name = "The request couldn't be authenticated. Check that credentials are specified and valid.";
        break;
    case 429:
        err.name = "The server rejected the request because the client has exceeded request limits.";
        break;
    case 503:
        err.name = "Server temporarily unavailable. Retry the request. If the error persists, report it with: date and time of the failure, request identifier from response header X-RequestId, and client identifier from request header X-ClientTraceId.";
        break;
    default:
        err.name = "An unexpected error occurred. If the error persists, report it with: date and time of the failure, request identifier from response header X-RequestId, and client identifier from request header X-ClientTraceId.";    
        break;
    }
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.status(status).send(JSON.stringify(err)); 
})



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

