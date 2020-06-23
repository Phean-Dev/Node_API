const mongodb = require('mongodb').MongoClient;
const dotenv = require('dotenv');
dotenv.config();
const url = process.env.DATABASE_SERVER;
const client = new mongodb(url, { useNewUrlParser: true });

function initialize(dbName, dbCollectionName, successCallBack, failCallBack) {
    client.connect(err => {
        if (err) {
            console.log(`Error mongoDB:${err}`)
            failCallBack(err);
        }
        else {
            const dbObject = client.db(dbName);
            const dbCollection = dbObject.collection(dbCollectionName);
            console.log(`MongoDB connect success`);
            successCallBack(dbCollection);
        }
    });
};

module.exports = { initialize };