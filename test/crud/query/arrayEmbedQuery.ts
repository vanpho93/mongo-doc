import * as assert from 'assert';
import 'mocha';
import { Collection, Db } from 'mongodb';
import { connect } from '../../../src/db';

describe.only('Query an Array of Embedded Documents', () => {
    let Inventory: Collection;

    before('Connect to db', async () => {
        const db = await connect();
        Inventory = db.collection('inventory');
    });

    beforeEach('Insert data for testing', async () => {
        await Inventory.insertMany([
            {
                item: 'journal',
                instock: [
                    { warehouse: 'A', qty: 5 },
                    { warehouse: 'C', qty: 15 }]
            },
            {
                item: 'notebook',
                instock: [
                    { warehouse: 'C', qty: 5 }]
            },
            {
                item: 'paper',
                instock: [
                    { warehouse: 'A', qty: 60 },
                    { warehouse: 'B', qty: 15 }]
            },
            {
                item: 'planner',
                instock: [
                    { warehouse: 'A', qty: 40 },
                    { warehouse: 'B', qty: 5 }]
            },
            {
                item: 'postcard',
                instock: [
                    { warehouse: 'B', qty: 15 },
                    { warehouse: 'C', qty: 35 }]
            }
        ]);
    });

    it('Match document', async () => {
        // an element in the instock array matches the specified document
        const cursor = Inventory.find({
            instock: { warehouse: 'A', qty: 5 }
        });
        const inventories = await cursor.toArray();
        assert.equal(inventories.length, 1);
        assert.equal(inventories[0].item, 'journal');
    });

    it('Using dot notation with fieldname', async () => {
        // an element in the instock array matches the specified document
        const cursor = Inventory.find({
            'instock.0.qty': { $lte: 5 }
        });
        const inventories = await cursor.toArray();
        assert.equal(inventories.length, 2);
    });

    it('Query in a field', async () => {
        const cursor = Inventory.find({
            'instock.qty': { $lte: 5 }
        });
        const inventories = await cursor.toArray();
        assert.equal(inventories.length, 3);
    });

    it('Single match. Use $elemMatch', async () => {
        const cursor = Inventory.find({
            instock: { $elemMatch: { qty: 5, warehouse: 'A' } }
        });
        const inventories = await cursor.toArray();
        assert.equal(inventories[0].item, 'journal');
    });

    it('Single match. Use $elemMatch with operator', async () => {
        const cursor = Inventory.find({
            instock: { $elemMatch: 
                { qty: { $gt: 10, $lte: 20 } }
            }
        });
        const inventories = await cursor.toArray();
        assert.equal(inventories.length, 3);
    });

    it('Combination of elements match 1', async () => {
        const cursor = Inventory.find({
            'instock.qty': { $gt: 10, $lte: 20 }
        });
        const inventories = await cursor.toArray();
        assert.equal(inventories.length, 4);
    });

    it('Combination of elements match 2', async () => {
        const cursor = Inventory.find({ 
            'instock.qty': 5, 'instock.warehouse': 'A'
          });
        const inventories = await cursor.toArray();
        assert.equal(inventories.length, 2);
    });
});
