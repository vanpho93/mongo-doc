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
require("mocha");
const assert = require("assert");
const db_1 = require("../../src/db");
describe('Query', () => {
    let Inventory;
    before('Connect to db', () => __awaiter(this, void 0, void 0, function* () {
        const db = yield db_1.connect();
        Inventory = db.collection('inventory');
    }));
    beforeEach('Insert data for testing', () => __awaiter(this, void 0, void 0, function* () {
        yield Inventory.insertMany([
            { item: "journal",
                qty: 25,
                size: { h: 14, w: 21, uom: "cm" },
                status: "A" },
            { item: "notebook",
                qty: 50,
                size: { h: 8.5, w: 11, uom: "in" },
                status: "A" },
            { item: "paper",
                qty: 100,
                size: { h: 8.5, w: 11, uom: "in" },
                status: "D" },
            { item: "planner",
                qty: 75, size: { h: 22.85, w: 30, uom: "cm" },
                status: "D" },
            { item: "postcard",
                qty: 45,
                size: { h: 10, w: 15.25, uom: "cm" },
                status: "A" }
        ]);
    }));
    it('Select all docs', () => __awaiter(this, void 0, void 0, function* () {
        const inventories = yield Inventory.find({}).toArray();
        // const inventories = await Inventory.find({}, { item: 1, _id: 0 }).toArray();
        // console.log(inventories);
        // SELECT * FROM inventory
        assert.equal(inventories.length, 5);
    }));
    it('Specify equality condition', () => __awaiter(this, void 0, void 0, function* () {
        const inventories = yield Inventory.find({ status: 'D' }).toArray();
        // SELECT * FROM inventory WHERE status = "D"
        assert.equal(inventories.length, 2);
    }));
    it('Specify condition using query operators', () => __awaiter(this, void 0, void 0, function* () {
        const queryObj = { status: { $in: ['D', 'A'] } };
        // https://docs.mongodb.com/manual/reference/operator/query/
        const inventories = yield Inventory.find(queryObj).toArray();
        // SELECT * FROM inventory WHERE status in ("A", "D")
        assert.equal(inventories.length, 5);
    }));
    it('Specify AND condition', () => __awaiter(this, void 0, void 0, function* () {
        const queryObj = {
            status: 'A',
            qty: { $gt: 30 }
        };
        // SELECT * FROM inventory WHERE status = "A" AND qty > 30
        const inventories = yield Inventory.find(queryObj).toArray();
        assert.equal(inventories.length, 2);
    }));
    it('Specify "or" condition', () => __awaiter(this, void 0, void 0, function* () {
        const queryObj = {
            $or: [
                { status: 'A' },
                { qty: { $gt: 80 } }
            ]
        };
        // SELECT * FROM inventory WHERE status = "A" OR qty > 80
        const inventories = yield Inventory.find(queryObj).toArray();
        assert.equal(inventories.length, 4);
    }));
    it('Use "AND" and "OR"', () => __awaiter(this, void 0, void 0, function* () {
        const inventories = yield Inventory.find({
            status: "A",
            $or: [{ qty: { $lt: 30 } }, { item: { $regex: "^p" } }]
        }).toArray();
        // SELECT * FROM inventory WHERE status = "A" AND ( qty < 30 OR item LIKE "p%")
        assert.equal(inventories.length, 2);
    }));
});
