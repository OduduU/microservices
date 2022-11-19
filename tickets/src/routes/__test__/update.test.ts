import request from 'supertest';

import { app } from '../../app';

it('returns 404 if the ticket is not found', async () => {
    const id = getObjId();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', signup(request, app))
        .send({
            title: 'updated title',
            price: 25
        })
        .expect(404);
})

it('returns 401 if the user is not authenticated', async () => {
    const id = getObjId();
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'updated title',
            price: 25
        })
        .expect(401);
})

it('returns 401 if the user does not own the ticket', async () => {
    const id = getObjId();

    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', signup(request, app))
        .send({
            title: 'new title',
            price: 25
        })
        .expect(201);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', signup(request, app))
        .send({
            title: 'updated title',
            price: 25
        })
        .expect(401);
})

it('returns 400 if the user provides an invalid title or price', async () => {
    const id = getObjId();
    const cookie = signup(request, app);

    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 25
        })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', cookie)
        .send({
            price: '0'
        })
        .expect(400);
})

it('updates the ticket if the user provide valid title or price', async () => {
    const cookie = signup(request, app);

    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
            price: 25
        })
        .expect(201);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'updated title',
            price: 255
        })
        .expect(200);

    const updatedTicket = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send();

    expect(updatedTicket.body.title).toEqual('updated title');
    expect(updatedTicket.body.price).toEqual(255);
})