const router = require('express').Router();
const db_connection = require('../models/db_connection');
const dotenv = require('dotenv');
const { validate_student } = require('../Tool/Validation');
const jwt = require('jsonwebtoken');
dotenv.config();

db_connection.initialize(process.env.DATBASE_NAME, process.env.COLLECTION_STUDENT,
    (db_collection) => {
        router.get('/', (req, res) => {
            db_collection.find().toArray((err, result) => {
                if (err) res.status(500).json({ msg: "Internal server error.", data: "" });
                else res.status(200).json({ msg: "Success", data: result });
            });
        });
        router.post('/', verifyToken, (req, res) => {
            const validate = validate_student.validate(req.body);
            if (validate.error) return res.status(400).json({ msg: "Invalid field", data: validate.error.details[0].message });
            const student = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                gender: req.body.gender,
                age: req.body.age,
                class: req.body.class,
                From: req.body.From
            }
            if (!student.first_name || !student.last_name || !student.From) {
                return res.status(400).json({ msg: "Please input first_name and last_name." });
            }
            db_connection.insertOne(student, (err, result) => {
                if (err) res.status(500).json({ msg: "Internal server error.", data: "" });
                db_connection.find().toArray((err, result) => {
                    if (err) res.status(500).json({ msg: "Internal server error.", data: "" })
                    else {
                        res.status(200).json({ msg: "Success", data: result });
                    }
                });
            });
        });
        router.get('/:id', (req, res) => {
            const id = new ID(req.params.id);
            db_connection.findOne({ _id: id }, (err, result) => {
                if (err) res.status(500).json({ msg: "Internal server error", data: "" });
                res.status(200).json({ msg: "Success", data: result });
            });
        });
        router.put('/:id', verifyToken, (req, res) => {
            const stu_id = new ID(req.params.id);
            const stu_data = req.body;
            db_connection.updateOne({ _id: stu_id }, { $set: stu_data }, (err, result) => {
                if (err) res.status(500).json({ msg: "Success", data: "" });
                res.status(200).json({ msg: "Successs", data: result });
            });
        });
        router.delete('/:id', verifyToken, (req, res) => {
            const id = new ID(req.params.id);
            db_connection.deleteOne({ _id: id }, (err, result) => {
                if (err) res.status(500).json({ msg: "Internal server error", data: "" });
                res.json({ msg: "Successfull deleted.", data: "" });
            });
        });
    }, function (err) {
        throw (err);
    }
);
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.TOKEN_KEY, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            next();
        })
    } else { res.status(401).json({ msg: "Authorize unsuccessful.", data: "" }); }
}
module.exports = router;