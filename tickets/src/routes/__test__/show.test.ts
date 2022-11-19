import request from 'supertest';

import { app } from '../../app';

it('returns 404 if the ticket is not found', async () => {
    const id = getObjId();
    await request(app)
        .get(`/api/tickets/${id}`)
        .send()
        .expect(404);
})

it('returns the ticket if the ticket is found', async () => {
    const ticketData = {
        title: 'new ticket',
        price: 20
    };

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', signup(request, app))
        .send(ticketData)
        .expect(201);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200);

    expect(ticketResponse.body.title).toEqual(ticketData.title);
    expect(ticketResponse.body.price).toEqual(ticketData.price);
})