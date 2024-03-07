const express = require('express')
const axios =require('axios')
const zoomRouter  = express.Router()
function generateJwtToken() {
    const payload = {
        iss: '9S_wps7kSUiuOXOJT600w',
        exp: ((new Date()).getTime() + 5000)
    };
    const token = jwt.sign(payload, '3GhNBLQdrH3WkEtyvjWjzV21zttPHiU2');
    return token;
}
const jwt = require('jsonwebtoken');

const clientId = '9S_wps7kSUiuOXOJT600w'
const clientSecret = '3GhNBLQdrH3WkEtyvjWjzV21zttPHiU2'

zoomRouter.get('/', async (req,res)=> {
            res.redirect('https://zoom.us/oauth/authorize?client_id=9S_wps7kSUiuOXOJT600w&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fzoom%2Fauth')
});

zoomRouter.get('/auth',async(req,res)=> {


    const { code } = req.query;

    axios.post('https://zoom.us/oauth/token', null, {
        params: {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: 'http://localhost:3001/zoom/auth'
        },
        headers: {
            Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
        }
    })
    .then(response => {
        console.log(response.data);
        res.send(response.data);
    })
    .catch(error => {
        console.error('Error obtaining access token:', error.response.data);
    });



})

module.exports =zoomRouter