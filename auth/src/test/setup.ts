import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';


declare global {
    var signup  : (req: any, app: any) => Promise<string[]>;
}

// declare global {
//   namespace NodeJS {
//     export interface Global {
//       signin(): Promise<string[]>;
//     }
//   }
// }


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

global.signup = async (request: any, app: any) => {
    const credentials = {
        email: 'test@test.com',
        password: 'password'
    }

    const response = await request(app)
        .post('/api/users/signup')
        .send(credentials)
        .expect(201)

    const cookie = response.get('Set-Cookie');
    
    return cookie;
}
