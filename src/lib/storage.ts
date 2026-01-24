import { Volunteer, Event, Donation, Announcement, AuditLog } from '@/types';
import fs from 'fs';
import path from 'path';

const DATA_FILE_PATH = path.join(process.cwd(), 'data.json');

interface DataSchema {
    volunteers: Volunteer[];
    events: Event[];
    donations: Donation[];
    announcements: Announcement[];
    auditLogs: AuditLog[];
}

class JSONFileStorage {
    private data: DataSchema;

    constructor() {
        this.data = this.loadData();
    }

    private loadData(): DataSchema {
        if (!fs.existsSync(DATA_FILE_PATH)) {
            return this.seedData();
        }
        try {
            const fileContent = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
            return JSON.parse(fileContent);
        } catch (error) {
            console.error("Error reading data file:", error);
            return this.seedData();
        }
    }

    private saveData() {
        try {
            fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(this.data, null, 2));
        } catch (error) {
            console.error("Error writing data file:", error);
        }
    }

    private seedData(): DataSchema {
        const initialData: DataSchema = {
            volunteers: [
                {
                    id: '1',
                    name: 'Alice Johnson',
                    email: 'alice@example.com',
                    phone: '123-456-7890',
                    skills: ['Teaching', 'First Aid'],
                    availability: 'Weekends',
                    status: 'APPROVED',
                    password: 'password123',
                    joinedDate: new Date().toISOString(),
                    rating: 4.5,
                    reviews: [
                        {
                            id: 'r1',
                            author: 'Community Center',
                            rating: 5,
                            comment: 'Alice was amazing! Very helpful and punctual.',
                            date: new Date(Date.now() - 86400000 * 10).toISOString()
                        },
                        {
                            id: 'r2',
                            author: 'John Doe',
                            rating: 4,
                            comment: 'Great work ethic.',
                            date: new Date(Date.now() - 86400000 * 5).toISOString()
                        }
                    ],
                    registeredEvents: []
                },
                {
                    id: '2',
                    name: 'Bob Smith',
                    email: 'bob@example.com',
                    phone: '987-654-3210',
                    skills: ['Driving', 'Logistics'],
                    availability: 'Weekdays',
                    status: 'PENDING',
                    joinedDate: new Date().toISOString(),
                },
            ],
            events: [
                {
                    id: '1',
                    title: 'Community Clean-up Drive',
                    description: 'Join us to clean up the local park and plant new trees.',
                    date: new Date(Date.now() + 86400000 * 7).toISOString(),
                    location: 'Central Park',
                    status: 'UPCOMING',
                },
                {
                    id: '2',
                    title: 'Food Distribution Camp',
                    description: 'Distributing food packets to underprivileged families.',
                    date: new Date(Date.now() - 86400000 * 2).toISOString(),
                    location: 'Community Center',
                    status: 'COMPLETED',
                },
            ],
            donations: [
                {
                    id: '1',
                    donorName: 'John Doe',
                    donorEmail: 'john@example.com',
                    amount: 5000,
                    date: new Date().toISOString(),
                    receiptId: 'RCPT-1001',
                },
                {
                    id: '2',
                    donorName: 'Jane Smith',
                    donorEmail: 'jane@example.com',
                    amount: 2500,
                    date: new Date(Date.now() - 86400000).toISOString(),
                    receiptId: 'RCPT-1002',
                },
            ],
            announcements: [
                {
                    id: '1',
                    title: 'Winter Donation Drive Started',
                    content: 'We are now accepting warm clothes and blankets for the winter drive.',
                    date: new Date().toISOString(),
                    author: 'Admin',
                },
            ],
            auditLogs: []
        };

        // Write initial data to file
        try {
            fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(initialData, null, 2));
        } catch (error) {
            console.error("Error creating initial data file:", error);
        }

        return initialData;
    }

    // Volunteers
    getVolunteers() {
        // Reload to ensure fresh data if multiple processes/reloads happened (basic sync)
        this.data = this.loadData();
        return this.data.volunteers;
    }

    addVolunteer(volunteer: Volunteer) {
        this.data = this.loadData();
        this.data.volunteers.push(volunteer);
        this.saveData();
    }

    updateVolunteer(id: string, data: Partial<Volunteer>) {
        this.data = this.loadData();
        const index = this.data.volunteers.findIndex(v => v.id === id);
        if (index !== -1) {
            this.data.volunteers[index] = { ...this.data.volunteers[index], ...data };
            this.saveData();
        }
    }

    // Events
    getEvents() {
        this.data = this.loadData();
        return this.data.events;
    }

    addEvent(event: Event) {
        this.data = this.loadData();
        this.data.events.push(event);
        this.saveData();
    }

    // Donations
    getDonations() {
        this.data = this.loadData();
        return this.data.donations;
    }

    addDonation(donation: Donation) {
        this.data = this.loadData();
        this.data.donations.push(donation);
        this.saveData();
    }

    // Announcements
    getAnnouncements() {
        this.data = this.loadData();
        return this.data.announcements;
    }

    addAnnouncement(announcement: Announcement) {
        this.data = this.loadData();
        this.data.announcements.push(announcement);
        this.saveData();
    }

    // Audit Logs
    getAuditLogs() {
        this.data = this.loadData();
        return this.data.auditLogs;
    }

    addAuditLog(log: AuditLog) {
        this.data = this.loadData();
        this.data.auditLogs.unshift(log);
        this.saveData();
    }
}

// Singleton instance
export const storage = new JSONFileStorage();
