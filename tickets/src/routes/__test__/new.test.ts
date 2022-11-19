import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('has a route handler listening to /api/tickets for post requests', async () => {
    const responds = await request(app)
        .post('/api/tickets')
        .send({});
    
    expect(responds.status).not.toEqual(404);
})

it('can only be accessed if the user is signed in', async () => {
    await request(app)
        .post('/api/tickets')
        .send({})
        .expect(401);
})

it('returns a status other than 401 if the user is signed in', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', signup(request, app))
        .send({});

    expect(response.status).not.toEqual(401);
})

it('returns an error if an invalid title is provided', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', signup(request, app))
        .send({
            title: '',
            price: 10
        })
        .expect(400);

    await request(app)
        .post('/api/tickets')
        .set('Cookie', signup(request, app))
        .send({
            price: 10
        })
        .expect(400);
})

it('returns an error if an invalid price is provided', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', signup(request, app))
        .send({
            title: 'ejfhds',
            price: -10
        })
        .expect(400);
    
    await request(app)
        .post('/api/tickets')
        .set('Cookie', signup(request, app))
        .send({
            title: 'random'
        })
        .expect(400);
})

it('creates a ticket with valid inputs', async () => {
    let ticket = await Ticket.find({});
    expect(ticket.length).toEqual(0);

    const ticketData = {
        title: 'new ticket',
        price: 20
    };

    await request(app)
        .post('/api/tickets')
        .set('Cookie', signup(request, app))
        .send(ticketData)
        .expect(201);
    
    ticket = await Ticket.find({});
    expect(ticket.length).toEqual(1);
    expect(ticket[0].price).toEqual(ticketData.price);
    expect(ticket[0].title).toEqual(ticketData.title);
})