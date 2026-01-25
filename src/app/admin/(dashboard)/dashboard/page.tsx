import { storage } from "@/lib/storage";
import { Calendar, DollarSign, Users } from "lucide-react";
import { Leaderboard } from "@/components/volunteer/leaderboard";

export default async function AdminDashboardPage() {
    const volunteers = await storage.getVolunteers();
    const events = await storage.getEvents();
    const donations = await storage.getDonations();
    const totalRaised = donations.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-xl shadow-sm border">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-muted-foreground">Total Volunteers</h3>
                        <Users className="h-5 w-5 text-blue-500" />
                    </div>
                    <p className="text-3xl font-bold">{volunteers.length}</p>
                    <p className="text-sm text-green-600 mt-1">+2 this week</p>
                </div>

                <div className="p-6 bg-white rounded-xl shadow-sm border">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-muted-foreground">Total Donations</h3>
                        <DollarSign className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="text-3xl font-bold">${totalRaised.toLocaleString()}</p>
                    <p className="text-sm text-green-600 mt-1">+15% vs last month</p>
                </div>

                <div className="p-6 bg-white rounded-xl shadow-sm border">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-muted-foreground">Active Events</h3>
                        <Calendar className="h-5 w-5 text-purple-500" />
                    </div>
                    <p className="text-3xl font-bold">{events.filter(e => e.status === 'UPCOMING').length}</p>
                    <p className="text-sm text-muted-foreground mt-1">{events.length} total events</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h3 className="text-lg font-bold mb-4">Recent Volunteers</h3>
                    <div className="space-y-4">
                        {volunteers.slice(0, 5).map(v => (
                            <div key={v.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                                <div>
                                    <p className="font-medium">{v.name}</p>
                                    <p className="text-sm text-muted-foreground">{v.email}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs ${v.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {v.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h3 className="text-lg font-bold mb-4">Recent Donations</h3>
                    <div className="space-y-4">
                        {donations.slice(0, 5).map(d => (
                            <div key={d.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                                <div>
                                    <p className="font-medium">{d.donorName}</p>
                                    <p className="text-sm text-muted-foreground">{new Date(d.date).toLocaleDateString()}</p>
                                </div>
                                <p className="font-bold text-green-600">+${d.amount}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Leaderboard />
            </div>
        </div>
    );
}
