import { randomBytes } from 'crypto';
import nats from 'node-nats-streaming';

import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222',
})

stan.on('connect', () => {
    console.log('Listener connected to NATS');

    stan.on('close', () => {
        console.log('NAT connection closed!');
        process.exit();
    });

    // const options = stan.subscriptionOptions()
    //     .setManualAckMode(true)
    //     .setDeliverAllAvailable()
    //     .setDurableName('ticket-service');

    // const subscription = stan.subscribe('ticket:created', 'listener:group', options);

    // subscription.on('message', (msg: Message) => {
    //     const data = msg.getData();

    //     if (typeof data === 'string') {
    //         console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    //     }

    //     msg.ack();
    // })

    new TicketCreatedListener(stan).listen()
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());

