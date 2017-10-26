import * as assert from 'assert';
import 'mocha';
import { Collection, Db } from 'mongodb';
import { connect } from '../../../src/db';

describe('Nested Query', () => {
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
                size: { h: 14, w: 21, uom: 'cm' },
                status: 'A'
            },
            {
                item: 'notebook',
                qty: 50,
                size: { h: 8.5, w: 11, uom: 'in' },
                status: 'A'
            },
            {
                item: 'paper',
                qty: 100,
                size: { h: 8.5, w: 11, uom: 'in' },
                status: 'D'
            },
            {
                item: 'planner',
                qty: 75, size: { h: 22.85, w: 30, uom: 'cm' },
                status: 'D'
            },
            {
                item: 'postcard',
                qty: 45,
                size: { h: 10, w: 15.25, uom: 'cm' },
                status: 'A'
            }
        ]);
    });

    it('Match an nested document', async () => {
        const inventories = await Inventory.find({
            size: { h: 14, w: 21, uom: 'cm' }
        }).toArray();
        assert.equal(inventories.length, 1);
    });

    it('Query in nested field', async () => {
        const inventories = await Inventory.find({
            'size.uom': 'cm'
        }).toArray();
        assert.equal(inventories.length, 3);
    });

    it('Query in nested field with operators', async () => {
        const inventories = await Inventory.find({
            'size.h': { $lt: 15 }
        }).toArray();
        assert.equal(inventories.length, 4);
    });

    it('AND condition', async () => {
        const inventories = await Inventory.find({
            'size.h': { $lt: 15 },
            'size.uom': 'in',
            'status': 'D'
        }).toArray();
        assert.equal(inventories.length, 1);
    });
});
