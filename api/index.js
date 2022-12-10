const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
require("dotenv").config();
const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');

app.get('/', function(req, res) {
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
            'from': 'en',
            'to': ['hi']
        },
        data: [{
            'text': 'sau'
        }],
        responseType: 'json'
    }).then(function(response){
        res.send(JSON.stringify(response.data, null, 4));
    })
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

