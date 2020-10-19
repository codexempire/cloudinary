const express = require("express");
const app = express();
const cloudinary = require("cloudinary").v2;
const bodyParser = require('body-parser');
const path = require('path');
const { config } = require('dotenv');
const { request } = require('http');
const { response } = require('express');

config();

// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET_KEY
});

// cloudinary.api.resources({ 
//    type: 'upload', 
//    prefix: 'images' }, 
//    function(error, result){console.log(error)
// });

app.get("/", (request, response) => {
    response.json({ message: "Hey! This is your server response!" });
});

// image upload API
app.post("/image", (request, response) => {
    const data = {
        image: path.resolve(__dirname + request.body.image),
    }

    cloudinary.uploader.upload(data.image, {folder: "images"})
        .then((result) => {
            response.status(200).send({
                message: "success",
                result,
            });
        }).catch((error) => {
            response.status(500).send({
                message: "failure",
                error,
            });
        });

});

app.get('/image', (request, response) => {
    cloudinary.search
        .expression('images')
        .sort_by('public_id', 'desc')
        .max_results(30)
        .execute().then(result => {
            return response.json(result);
        })
        .catch(e => console.log(e));
})

app.delete('/image/:imageId', (request,response) => {
    cloudinary.uploader.destroy('images/'+request.params.imageId)
        .then((result) => {
            response.status(200).send({
                message: "success",
                result,
            });
        }).catch((error) => {
            response.status(500).send({
                message: "failure",
                error,
            });
        });
})
app.listen(9090);