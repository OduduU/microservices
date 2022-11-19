import request from 'supertest';
import { app } from '../../app';

it('responds with details about the current user', async () => {
    const cookie = await signup(request, app);

    const currentUser = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', cookie)
        .send()
        .expect(200);

    expect(currentUser.body.currentUser.email).toEqual('test@test.com');
})

it('responds with null if not authenticated', async () => {
    const currentUser = await request(app)
        .get('/api/users/currentuser')
        .send()
        .expect(200);

    expect(currentUser.body.currentUser).toEqual(null);
})