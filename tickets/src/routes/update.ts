import express, {Request, Response} from 'express';
import { body } from 'express-validator';
import { NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from '@outickets/common';

import { Ticket } from '../models/ticket';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put('/api/tickets/:id', 
requireAuth, 
[
    body('title')
        .optional()
        .notEmpty()
        .withMessage('title can not be an empty string'),
    body('price')
        .optional()
        .isFloat({gt: 0})
        .withMessage('price must be greater than 0')
], 
validateRequest, 
async (req: Request, res: Response) => {

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    ticket.set({
        title: req.body.title,
        price: req.body.price,
    });

    await ticket.save();

    new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        userId: ticket.userId,
        price: ticket.price
    })

    res.status(200).json(ticket);
})

export { router as updateTicketRouter };