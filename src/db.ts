import { MongoClient, Db } from 'mongodb';

const url = 'mongodb://localhost:27017/mongo-doc';

export function connect(): Promise<Db> {
    return MongoClient.connect(url);
}
