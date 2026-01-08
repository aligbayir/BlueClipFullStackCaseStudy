export class Notification {
    id: string;
    userId: string;
    title: string;
    body: string;
    timestamp: Date;
    status: 'pending' | 'sent' | 'failed';
}
