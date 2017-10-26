import * as assert from 'assert';
import 'mocha';
import { Collection, Db } from 'mongodb';
import { connect } from '../../../src/db';

describe('Array Query', () => {
    let Inventory: Collection;

    before('Connect to db', async () => {
        const db = await connect();
        Inventory = db.collection('inventory');
    });

    beforeEach('Insert data for testing', async () => {
        await Inventory.insertMany([
            {
                item: 'journal',
                qty: 25,
                tags: ['blank', 'red'],
                dim_cm: [14, 21]
            },
            {
                item: 'notebook',
                qty: 50,
                tags: ['red', 'blank'],
                dim_cm: [14, 21]
            },
            {
                item: 'paper',
                qty: 100,
                tags: ['red', 'blank', 'plain'],
                dim_cm: [14, 21]
            },
            {
                item: 'planner',
                qty: 75,
                tags: ['blank', 'red'],
                dim_cm: [22.85, 30]
            },
            {
                item: 'postcard',
                qty: 45,
                tags: ['blue'],
                dim_cm: [10, 15.25]
            }
        ]);
    });

    it('Match an array', async () => {
        const inventories = await Inventory.find({ tags: ['red', 'blank'] }).toArray();
        assert.equal(inventories.length, 1);
    });

    it('Order do not master', async () => {
        const inventories = await Inventory.find({ 
            tags: { $all: ['red', 'blank'] } }
        ).toArray();
        assert.equal(inventories.length, 4);
    });

    it('Query an array for an element', async () => {
        // Match all elements where tags is an array that contains the string 'red'
        const inventories = await Inventory.find({ tags: 'red' }, { item: 1 }).toArray();
        assert.equal(inventories.length, 4);
    });

    it('Query an array for an element with operator', async () => {
        // Match all elements where tags is an array that contains the string 'red'
        const inventories = await Inventory.find({ dim_cm: { $gt: 25 } }).toArray();
        assert.equal(inventories.length, 1);
    });

    it('Use AND condition', async () => {
        const inventories = await Inventory.find({ dim_cm: { $gt: 15, $lt: 20 } }).toArray();
        assert.equal(inventories.length, 4);
    });

    it('Use $elementMatch condition', async () => {
        // Have least one element satisfies all condition
        const cursor = await Inventory.find({ 
            dim_cm: { $elemMatch: { $gt: 22, $lt: 30 } }
        });
        const inventories = await cursor.toArray();
        assert.equal(inventories.length, 1);
    });

    it('With index position', async () => {
        const cursor = await Inventory.find({ 
            'dim_cm.0': { $gt: 22, $lt: 30 }
        });
        const inventories = await cursor.toArray();
        assert.equal(inventories.length, 1);
    });

    it('Query array length', async () => {
        const cursor = await Inventory.find({ 
            tags: { $size: 3 }
        });
        const inventories = await cursor.toArray();
        assert.equal(inventories.length, 1);
    });
});
