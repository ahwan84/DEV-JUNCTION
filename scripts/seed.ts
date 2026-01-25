import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import { VolunteerModel, EventModel, DonationModel, AnnouncementModel, AuditLogModel } from '../src/lib/models'; // Adjust path if needed

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

const DATA_FILE_PATH = path.join(process.cwd(), 'data.json');

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI!);
        console.log('Connected to MongoDB');

        if (!fs.existsSync(DATA_FILE_PATH)) {
            console.error('Data file not found!');
            process.exit(1);
        }

        const fileContent = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
        const data = JSON.parse(fileContent);

        // Clear existing data (optional, but safer for re-seeding)
        await Promise.all([
            VolunteerModel.deleteMany({}),
            EventModel.deleteMany({}),
            DonationModel.deleteMany({}),
            AnnouncementModel.deleteMany({}),
            AuditLogModel.deleteMany({})
        ]);
        console.log('Cleared existing collections');

        // Insert new data
        if (data.volunteers?.length) await VolunteerModel.insertMany(data.volunteers);
        if (data.events?.length) await EventModel.insertMany(data.events);
        if (data.donations?.length) await DonationModel.insertMany(data.donations);
        if (data.announcements?.length) await AnnouncementModel.insertMany(data.announcements);
        if (data.auditLogs?.length) await AuditLogModel.insertMany(data.auditLogs);

        console.log('Database seeded successfully from data.json');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

seed();
