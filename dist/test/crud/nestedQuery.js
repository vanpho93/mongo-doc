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
describe.only('Query', () => {
    let Inventory;
    before('Connect to db', () => __awaiter(this, void 0, void 0, function* () {
        const db = yield db_1.connect();
        Inventory = db.collection('inventory');
    }));
    beforeEach('Insert data for testing', () => __awaiter(this, void 0, void 0, function* () {
        yield Inventory.insertMany([
            {
                item: "journal",
                qty: 25,
                size: { h: 14, w: 21, uom: "cm" },
                status: "A"
            },
            {
                item: "notebook",
                qty: 50,
                size: { h: 8.5, w: 11, uom: "in" },
                status: "A"
            },
            {
                item: "paper",
                qty: 100,
                size: { h: 8.5, w: 11, uom: "in" },
                status: "D"
            },
            {
                item: "planner",
                qty: 75, size: { h: 22.85, w: 30, uom: "cm" },
                status: "D"
            },
            {
                item: "postcard",
                qty: 45,
                size: { h: 10, w: 15.25, uom: "cm" },
                status: "A"
            }
        ]);
    }));
    it('Match an nested document', () => __awaiter(this, void 0, void 0, function* () {
        const inventories = yield Inventory.find({
            size: { h: 14, w: 21, uom: 'cm' }
        }).toArray();
        assert.equal(inventories.length, 1);
    }));
    it('Query in nested field', () => __awaiter(this, void 0, void 0, function* () {
        const inventories = yield Inventory.find({
            'size.uom': 'cm'
        }).toArray();
        assert.equal(inventories.length, 3);
    }));
    it('Query in nested field with operators', () => __awaiter(this, void 0, void 0, function* () {
        const inventories = yield Inventory.find({
            'size.h': { $lt: 15 }
        }).toArray();
        assert.equal(inventories.length, 4);
    }));
    it('AND condition', () => __awaiter(this, void 0, void 0, function* () {
        const inventories = yield Inventory.find({
            "size.h": { $lt: 15 },
            "size.uom": "in",
            status: "D"
        }).toArray();
        assert.equal(inventories.length, 1);
    }));
});
