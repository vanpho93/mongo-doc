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
const assert = require("assert");
require("mocha");
const db_1 = require("../../../src/db");
describe.only('Query an Array of Embedded Documents', () => {
    let Inventory;
    before('Connect to db', () => __awaiter(this, void 0, void 0, function* () {
        const db = yield db_1.connect();
        Inventory = db.collection('inventory');
    }));
    beforeEach('Insert data for testing', () => __awaiter(this, void 0, void 0, function* () {
        yield Inventory.insertMany([
            {
                item: 'journal',
                instock: [
                    { warehouse: 'A', qty: 5 },
                    { warehouse: 'C', qty: 15 }
                ]
            },
            {
                item: 'notebook',
                instock: [
                    { warehouse: 'C', qty: 5 }
                ]
            },
            {
                item: 'paper',
                instock: [
                    { warehouse: 'A', qty: 60 },
                    { warehouse: 'B', qty: 15 }
                ]
            },
            {
                item: 'planner',
                instock: [
                    { warehouse: 'A', qty: 40 },
                    { warehouse: 'B', qty: 5 }
                ]
            },
            {
                item: 'postcard',
                instock: [
                    { warehouse: 'B', qty: 15 },
                    { warehouse: 'C', qty: 35 }
                ]
            }
        ]);
    }));
    it('Match document', () => __awaiter(this, void 0, void 0, function* () {
        // an element in the instock array matches the specified document
        const cursor = yield Inventory.find({
            instock: { warehouse: 'A', qty: 5 }
        });
        const inventories = yield cursor.toArray();
        assert.equal(inventories.length, 1);
        assert.equal(inventories[0].item, 'journal');
    }));
    it('Using dot notation with fieldname', () => __awaiter(this, void 0, void 0, function* () {
        // an element in the instock array matches the specified document
        const cursor = yield Inventory.find({
            'instock.0.qty': { $lte: 5 }
        });
        const inventories = yield cursor.toArray();
        assert.equal(inventories.length, 2);
    }));
    it('Query in a field', () => __awaiter(this, void 0, void 0, function* () {
        const cursor = yield Inventory.find({
            'instock.qty': { $lte: 5 }
        });
        const inventories = yield cursor.toArray();
        assert.equal(inventories.length, 3);
    }));
});
