"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
function removeAll() {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield db_1.connect();
        const writeResult = yield db.collection('inventory').remove({});
        console.log(writeResult);
        return db.close();
    });
}
function insert() {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield db_1.connect();
        const inserted = yield db.collection('inventory').insertOne({
            item: 'canvas',
            qty: 100,
            tags: ['cotton'],
            size: { h: 28, w: 35.5, uom: "cm" }
        });
        console.log(inserted.insertedId);
        return db.close();
    });
}
function insertMany() {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield db_1.connect();
        const result = yield db.collection('inventory').insertMany([
            { item: "journal",
                qty: 25,
                tags: ["blank", "red"],
                size: { h: 14, w: 21, uom: "cm" }
            },
            { item: "mat",
                qty: 85,
                tags: ["gray"],
                size: { h: 27.9, w: 35.5, uom: "cm" }
            },
            { item: "mousepad",
                qty: 25,
                tags: ["gel", "blue"],
                size: { h: 19, w: 22.85, uom: "cm" }
            }
        ]);
        console.log(result);
        return db.close();
    });
}
function find() {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield db_1.connect();
        const cursor = db.collection('inventory').find({
            item: 'canvas',
        });
        console.log(cursor);
        return db.close();
    });
}
