
const router = require('express').Router();
const db_connection = require('../models/db_connection');
const dotenv = require('dotenv');
const { validate_login } = require('../Tool/Validation');
const { validate_user } = require('../Tool/Validation');
const jwt = require('jsonwebtoken');
dotenv.config();

db_connection.initialize(process.env.DATBASE_NAME, process.env.COLLECTION_USER,
    (db_collection) => {
        router.post('/login', (req, res) => {
            const validate = validate_login.validate(req.body);
            if (validate.error) return res.status(400).json({ msg: "Invalid field", data: validate.error.details[0].message });
            const loginuser = {
                email: req.body.email,
                pwd: req.body.pwd
            }
            db_collection.findOne({ "email": loginuser.email, "pwd": loginuser.pwd }, (err, result) => {
                if (err) res.status(500).json({ msg: "Internal server error.", data: "" });
                else {
                    if (result != null) {
                        const user = {
                            name: result.name,
                            email: result.email,
                            pwd: result.pwd,
                            date: new Date()
                        }
                        jwt.sign({ user: user }, process.env.TOKEN_KEY, (err, token) => {
                            if (err) res.status(500).json({ msg: "Internal server error.", data: "" });
                            else
                                res.status(200).json({
                                    msg: "Success",
                                    data: token
                                });
                        });
                    }
                }
            });
        });
        router.post('/register', (req, res) => {
            const validate = validate_user.validate(req.body);
            if (validate.error) return res.status(400).json({ msg: "Invalid field", data: validate.error.details[0].message });
            const register = {
                name: req.body.name,
                email: req.body.email,
                pwd: req.body.pwd,
                date: new Date()
            }
            if (!register.name && !register.email && !register.pwd) {
                res.status(400).json({ msg: "Please input name, email and password.", data: "" });
            }
            else {
                db_collection.findOne({ "email": register.email }, (err, result) => {
                    if (err) res.status(500).json({ msg: "Internal server error.", data: "" });
                    else {
                        if (result != null) {
                            res.status(400).json({ msg: "Unsuccessfull", data: "User existing" });
                            
                        }
                        else {
                            db_collection.insertOne(register, (err, result) => {
                                if (err) res.status(500).json({ msg: "Internal server error.", data: "" });
                                else
                                    jwt.sign({ user: register }, process.env.TOKEN_KEY, (err, token) => {
                                        res.status(200).json({
                                            msg: "Success",
                                            data: token
                                        });
                                    });
                            });
                        }
                    };
                });
            }
        });
    }, function (err) {
        throw (err);
    });

module.exports = router;





