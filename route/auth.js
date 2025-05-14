const express = require('express');
const router = express.Router();
const { conn } = require("../database");
const  bcrypt  =  require("bcrypt");
const  jwt  =  require("jsonwebtoken");


// register
router.post('/register',(req,res) => {

});

// login
router.post('/login',(req,res) => {

});

// logout
router.post('/logout',(req,res)=>{

});

module.exports = router;