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
describe.only('Array Query', () => {
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
                tags: ["blank", "red"],
                dim_cm: [14, 21]
            },
            {
                item: "notebook",
                qty: 50,
                tags: ["red", "blank"],
                dim_cm: [14, 21]
            },
            {
                item: "paper",
                qty: 100,
                tags: ["red", "blank", "plain"],
                dim_cm: [14, 21]
            },
            {
                item: "planner",
                qty: 75,
                tags: ["blank", "red"],
                dim_cm: [22.85, 30]
            },
            {
                item: "postcard",
                qty: 45,
                tags: ["blue"],
                dim_cm: [10, 15.25]
            }
        ]);
    }));
    it('Match an array', () => __awaiter(this, void 0, void 0, function* () {
        const inventories = yield Inventory.find({ tags: ['red', 'blank'] }).toArray();
        assert.equal(inventories.length, 2);
    }));
});
