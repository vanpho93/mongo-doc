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
describe('Insert', () => {
    let Inventory;
    before('Connect to db', () => __awaiter(this, void 0, void 0, function* () {
        const db = yield db_1.connect();
        Inventory = db.collection('inventory');
    }));
    it('Insert one', () => __awaiter(this, void 0, void 0, function* () {
        const insertedItem = yield Inventory.insertOne({
            item: 'canvas',
            qty: 100,
            tags: ['cotton'],
            size: { h: 28, w: 35.5, uom: "cme" }
        });
        const id = insertedItem.insertedId;
        const item2 = yield Inventory.findOne({ _id: id });
        assert.equal(item2.qty, 100);
    }));
    it('Insert many', () => __awaiter(this, void 0, void 0, function* () {
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
        const count = yield Inventory.count({});
        const countA = yield Inventory.count({ status: 'A' });
        assert.equal(count, 5);
        assert.equal(countA, 3);
    }));
});
