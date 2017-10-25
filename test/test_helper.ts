import 'mocha';
import { connect } from '../src/db';

beforeEach('Remove all items', async () => {
    const db = await connect();
    await db.dropDatabase();
});
