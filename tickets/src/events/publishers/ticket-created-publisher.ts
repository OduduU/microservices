import { Publisher, TicketCreatedEvent, Subjects } from '@outickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}