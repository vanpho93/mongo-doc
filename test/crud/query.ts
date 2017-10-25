import 'mocha';
import * as assert from 'assert';
import { Db, Collection } from 'mongodb';
import { connect } from '../../src/db';

describe('Query', () => {
    let Inventory: Collection;
    
    before('Connect to db', async () => {
        const db = await connect();
        Inventory = db.collection('inventory');
    });

    beforeEach('Insert data for testing', async () => {
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
    })

    it('Select all docs', async () => {
        const inventories = await Inventory.find({}).toArray();
        // const inventories = await Inventory.find({}, { item: 1, _id: 0 }).toArray();
        // console.log(inventories);
        // SELECT * FROM inventory
        assert.equal(inventories.length, 5);
    });

    it('Specify equality condition', async () => {
        const inventories = await Inventory.find({ status: 'D' }).toArray();
        // SELECT * FROM inventory WHERE status = "D"
        assert.equal(inventories.length, 2);
    });

    it('Specify condition using query operators', async () => {
        const queryObj = { status: { $in: ['D', 'A'] } };
        // https://docs.mongodb.com/manual/reference/operator/query/
        const inventories = await Inventory.find(queryObj).toArray();
        // SELECT * FROM inventory WHERE status in ("A", "D")
        assert.equal(inventories.length, 5);
    });

    it('Specify AND condition', async () => {
        const queryObj = {
            status: 'A',
            qty: { $gt: 30 }
        };
        // SELECT * FROM inventory WHERE status = "A" AND qty > 30
        const inventories = await Inventory.find(queryObj).toArray();
        assert.equal(inventories.length, 2);
    });

    it('Specify "or" condition', async () => {
        const queryObj = {
            $or: [
                { status: 'A' },
                { qty: { $gt: 80 } }
            ]
        };
        // SELECT * FROM inventory WHERE status = "A" OR qty > 80
        const inventories = await Inventory.find(queryObj).toArray();
        assert.equal(inventories.length, 4);
    });

    it('Use "AND" and "OR"', async () => {
        const inventories = await Inventory.find({ 
            status: "A",
            $or: [ { qty: { $lt: 30 } }, { item: { $regex: "^p" } } ]
        }).toArray();
        // SELECT * FROM inventory WHERE status = "A" AND ( qty < 30 OR item LIKE "p%")
        assert.equal(inventories.length, 2);
    });
});
