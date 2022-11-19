import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
    var signup  : (req: any, app: any) => string[];
}

declare global {
    var getObjId  : () => string;
}


let mongo: any;

beforeAll(async () => {
    process.env.JWT_KEY = 'secret';
    mongo = await MongoMemoryServer.create();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri);
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
})

afterAll(async () => {
    if (mongo) await mongo.stop();
    
    await mongoose.connection.close();
}, 100000)

global.signup = (request: any, app: any) => {
    const payload = {
        id: getObjId(),
        email: 'test@test.com'
    };

    const token = jwt.sign(payload, process.env.JWT_KEY!);

    const session = JSON.stringify({
        jwt: token
    });

    const base64 = Buffer.from(session).toString('base64');

    return [`session=${base64}`];
}

global.getObjId = () => new mongoose.Types.ObjectId().toHexString();
