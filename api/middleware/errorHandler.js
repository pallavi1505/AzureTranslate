function errorHandler (err, req, res, next) {
    console.log("In middle ware")
    res.status(404);
    res.send({"error":true , "message":"Something went wrong"});
}

module.exports = { errorHandler }
