import 'mocha';
import * as assert from 'assert';
import { Db, ObjectId, Collection } from 'mongodb';
import { connect } from '../../src/db';

describe('Insert', () => {
    let Inventory: Collection;
    before('Connect to db', async () => {
        const db = await connect();
        Inventory = db.collection('inventory');
    });
    
    it('Insert one', async () => {
        const insertedItem = await Inventory.insertOne({
            item: 'canvas',
            qty: 100,
            tags: ['cotton'],
            size: { h: 28, w: 35.5, uom: "cme" }
        });
        const id = insertedItem.insertedId;
        const item2 = await Inventory.findOne({ _id: id });
        assert.equal(item2.qty, 100);
    });
    
    it('Insert many', async () => {
        await Inventory.insertMany([
            { item: "journal",
              qty: 25,
              size: { h: 14, w: 21, uom: "cm" },
              status: "A"},
            { item: "notebook",
              qty: 50,
              size: { h: 8.5, w: 11, uom: "in" },
              status: "A"},
            { item: "paper",
              qty: 100,
              size: { h: 8.5, w: 11, uom: "in" },
              status: "D"},
            { item: "planner",
              qty: 75, size: { h: 22.85, w: 30, uom: "cm" },
              status: "D"},
            { item: "postcard",
              qty: 45,
              size: { h: 10, w: 15.25, uom: "cm" },
              status: "A"}
        ]);
        const count = await Inventory.count({});
        const countA = await Inventory.count({ status: 'A' });
        assert.equal(count, 5);
        assert.equal(countA, 3);
    });
});
