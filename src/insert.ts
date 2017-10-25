import { connect } from './db';

async function removeAll() {
    const db = await connect();
    const writeResult = await db.collection('inventory').remove({});
    console.log(writeResult);
    return db.close();
}


async function insert() {
    const db = await connect();
    const inserted = await db.collection('inventory').insertOne({
        item: 'canvas',
        qty: 100,
        tags: ['cotton'],
        size: { h: 28, w: 35.5, uom: "cm" }
    });
    console.log(inserted.insertedId);
    return db.close();
}

async function insertMany() {
    const db = await connect();
    const result = await db.collection('inventory').insertMany([
        { item: "journal",
            qty: 25,
            tags: ["blank", "red"],
            size: { h: 14, w: 21, uom: "cm" }
        },
        { item: "mat",
            qty: 85,
            tags: ["gray"],
            size: { h: 27.9, w: 35.5, uom: "cm" }
        },
        { item: "mousepad",
            qty: 25,
            tags: ["gel", "blue"],
            size: { h: 19, w: 22.85, uom: "cm" }
        }
    ]);
    console.log(result);
    return db.close();
}

async function find() {
    const db = await connect();
    const cursor = db.collection('inventory').find({
        item: 'canvas',
    });
    console.log(cursor);
    return db.close();
}
