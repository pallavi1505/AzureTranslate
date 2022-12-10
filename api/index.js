const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const port = 3000;
const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');

require("dotenv").config();
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'build')))

app.get("/", async (req,re) => {
    res.sendFile(path.join(__dirname,"build","index.html"))
})


app.get('/translate', function(req, res) {
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
        // res.send(JSON.stringify(response.data));

    }).catch(
        function (error) {
            if (error.response) {  
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                let errorObj = {"message":"Please correct the input"}
                res.status(error.response.status).send(errorObj);   
            }    
    })
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

