import { Volunteer, Event, Donation, Announcement, AuditLog, EventUpdate, EventMetrics, EventFundraising } from '@/types';
import dbConnect from './db';
import { VolunteerModel, EventModel, DonationModel, AnnouncementModel, AuditLogModel, EventUpdateModel, StaffModel } from './models';

class MongoStorage {

    constructor() {
        // Ensure connection is established when storage is used
        dbConnect();
    }

    // Volunteers
    async getVolunteers(): Promise<Volunteer[]> {
        await dbConnect();
        const volunteers = await VolunteerModel.find({});
        // Convert Mongoose documents to plain objects if needed, though they are compatible
        return JSON.parse(JSON.stringify(volunteers));
    }

    async addVolunteer(volunteer: Volunteer): Promise<void> {
        await dbConnect();
        await VolunteerModel.create(volunteer);
    }

    async updateVolunteer(id: string, data: Partial<Volunteer>): Promise<void> {
        await dbConnect();
        await VolunteerModel.updateOne({ id }, { $set: data });
    }

    // Events
    async getEvents(): Promise<Event[]> {
        await dbConnect();
        const events = await EventModel.find({});
        return JSON.parse(JSON.stringify(events));
    }

    async addEvent(event: Event): Promise<void> {
        await dbConnect();
        await EventModel.create(event);
    }

    async updateEventStatus(id: string, status: 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'): Promise<void> {
        await dbConnect();
        await EventModel.updateOne({ id }, { $set: { status } });
    }

    async updateEventMetrics(id: string, metrics: EventMetrics): Promise<void> {
        await dbConnect();
        await EventModel.updateOne({ id }, { $set: { metrics } });
    }

    async updateEventFundraising(id: string, fundraising: EventFundraising): Promise<void> {
        await dbConnect();
        await EventModel.updateOne({ id }, { $set: { fundraising } });
    }

    async incrementVolunteerPoints(id: string, points: number): Promise<void> {
        await dbConnect();
        await VolunteerModel.updateOne({ id }, { $inc: { points } });
    }

    async getEventUpdates(eventId: string): Promise<EventUpdate[]> {
        await dbConnect();
        const updates = await EventUpdateModel.find({ eventId }).sort({ timestamp: -1 });
        return JSON.parse(JSON.stringify(updates));
    }

    async addEventUpdate(update: EventUpdate): Promise<void> {
        await dbConnect();
        await EventUpdateModel.create(update);
    }

    // Donations
    async getDonations(): Promise<Donation[]> {
        await dbConnect();
        const donations = await DonationModel.find({});
        return JSON.parse(JSON.stringify(donations));
    }

    async addDonation(donation: Donation): Promise<void> {
        await dbConnect();
        await DonationModel.create(donation);
    }

    // Announcements
    async getAnnouncements(): Promise<Announcement[]> {
        await dbConnect();
        const announcements = await AnnouncementModel.find({});
        return JSON.parse(JSON.stringify(announcements));
    }

    async addAnnouncement(announcement: Announcement): Promise<void> {
        await dbConnect();
        await AnnouncementModel.create(announcement);
    }

    // Audit Logs
    async getAuditLogs(): Promise<AuditLog[]> {
        await dbConnect();
        // Sort by timestamp descending by default for logs
        const logs = await AuditLogModel.find({}).sort({ timestamp: -1 });
        return JSON.parse(JSON.stringify(logs));
    }

    async addAuditLog(log: AuditLog): Promise<void> {
        await dbConnect();
        await AuditLogModel.create(log);
    }

    // Staff
    async getAllStaff(): Promise<any[]> {
        await dbConnect();
        const staff = await StaffModel.find({});
        return JSON.parse(JSON.stringify(staff));
    }

    async getStaffByUsername(username: string): Promise<any | null> {
        await dbConnect();
        const staff = await StaffModel.findOne({ username });
        return staff ? JSON.parse(JSON.stringify(staff)) : null;
    }

    async addStaff(staff: any): Promise<void> {
        await dbConnect();
        await StaffModel.create(staff);
    }
}

// Singleton instance
export const storage = new MongoStorage();
