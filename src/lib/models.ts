import mongoose, { Schema, Model } from 'mongoose';
import { Volunteer, Event, Donation, Announcement, AuditLog, EventUpdate, Feedback } from '@/types';

// Volunteer Schema
const VolunteerSchema = new Schema<Volunteer>({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    skills: { type: [String], required: true },
    availability: { type: String, required: true },
    status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], required: true },
    password: { type: String },
    avatarUrl: { type: String },
    rating: { type: Number },
    reviews: [{
        id: String,
        author: String,
        rating: Number,
        comment: String,
        date: String
    }],
    joinedDate: { type: String, required: true },
    registeredEvents: { type: [String] },
    points: { type: Number, default: 0 }
});

// Event Schema
const EventSchema = new Schema<Event>({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    location: { type: String, required: true },
    status: { type: String, enum: ['UPCOMING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], required: true },
    metrics: {
        peopleFed: { type: Number, default: 0 },
        costBurnt: { type: Number, default: 0 },
        partners: { type: [String], default: [] }
    },
    fundraising: {
        goal: { type: Number, default: 1000 }, // Default goal
        raised: { type: Number, default: 0 }
    }
});

// Event Update Schema
const EventUpdateSchema = new Schema<EventUpdate>({
    id: { type: String, required: true, unique: true },
    eventId: { type: String, required: true },
    content: { type: String, required: true },
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    timestamp: { type: String, required: true },
    imageUrl: { type: String }
});

// Donation Schema
const DonationSchema = new Schema<Donation>({
    id: { type: String, required: true, unique: true },
    donorName: { type: String, required: true },
    donorEmail: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: String, required: true },
    campaignId: { type: String },
    receiptId: { type: String, required: true }
});

// Announcement Schema
const AnnouncementSchema = new Schema<Announcement>({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: String, required: true },
    author: { type: String, required: true }
});

// AuditLog Schema
const AuditLogSchema = new Schema<AuditLog>({
    id: { type: String, required: true, unique: true },
    action: { type: String, required: true },
    details: { type: String, required: true },
    adminId: { type: String, required: true },
    timestamp: { type: String, required: true }
});

// Staff Schema
const StaffSchema = new Schema({
    id: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['SUPER_ADMIN', 'STAFF'], required: true },
    permissions: { type: [String], default: [] }
});

// Feedback Schema
const FeedbackSchema = new Schema({
    id: { type: String, required: true, unique: true },
    eventId: { type: String, required: true },
    volunteerId: { type: String, required: true },
    volunteerName: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    timestamp: { type: String, required: true }
});

// Check if models exist before compiling to prevent OverwriteModelError
export const VolunteerModel: Model<Volunteer> = mongoose.models.Volunteer || mongoose.model<Volunteer>('Volunteer', VolunteerSchema);
export const EventModel: Model<Event> = mongoose.models.Event || mongoose.model<Event>('Event', EventSchema);
export const EventUpdateModel: Model<EventUpdate> = mongoose.models.EventUpdate || mongoose.model<EventUpdate>('EventUpdate', EventUpdateSchema);
export const DonationModel: Model<Donation> = mongoose.models.Donation || mongoose.model<Donation>('Donation', DonationSchema);
export const AnnouncementModel: Model<Announcement> = mongoose.models.Announcement || mongoose.model<Announcement>('Announcement', AnnouncementSchema);
export const AuditLogModel: Model<AuditLog> = mongoose.models.AuditLog || mongoose.model<AuditLog>('AuditLog', AuditLogSchema);
export const StaffModel = mongoose.models.Staff || mongoose.model('Staff', StaffSchema);
export const FeedbackModel = mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema);
