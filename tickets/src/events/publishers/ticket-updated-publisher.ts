import { Publisher, TicketUpdatedEvent, Subjects } from '@outickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}