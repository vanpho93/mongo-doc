"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const url = 'mongodb://localhost:27017/mongo-doc';
function connect() {
    return mongodb_1.MongoClient.connect(url);
}
exports.connect = connect;
