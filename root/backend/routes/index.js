var express = require('express');
var router = express.Router();

// Added by me (packages):
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {body, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('dotenv').config();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Added by me (models):
const Users = require('../models/Users');

// Added by me (middleware):
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/api/user/register', 
  upload.none(),
  body('email').isEmail(),
  body('password')
  .isLength({ min: 3 })
  //.matches(/[a-z]/).withMessage('at least one lowercase letter')
  //.matches(/[A-Z]/)
  //.matches(/[0-9]/)
  //.matches(/[~`!@#$%^&*()-_+={}[]|\;:"<>,.?|\/]/) // to include / used \ before /
  
  ,(req, res)=>{  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send('Password is not strong enough');
    }
    Users.findOne({email: req.body.email})
        .then(async (user) => {
            if(!user){
              const hashedPassword = await bcrypt.hash(req.body.password, 10)
                let newUser = new Users({
                    name: req.body.name,
                    email: req.body.email,
                    password: hashedPassword,
                    date: new Date()
                });
                newUser.save();
                return res.send(newUser);
            } else {
                return res.status(403).send('Email already in use');
            }
        }).catch((error) => {
            res.status(500).send(`Error occured: ${error}`);
        });
});

module.exports = router;
