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
        const cursor = await Inventory.find({
            instock: { warehouse: 'A', qty: 5 }
        });
        const inventories = await cursor.toArray();
        assert.equal(inventories.length, 1);
        assert.equal(inventories[0].item, 'journal');
    });
});
