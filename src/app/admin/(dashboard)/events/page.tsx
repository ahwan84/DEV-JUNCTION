import { Button } from "@/components/ui/button";
import { createEvent } from "@/app/actions";
import { storage } from "@/lib/storage";
import { Plus, Radio } from "lucide-react";
import Link from "next/link";

export default async function EventsPage() {
    const events = await storage.getEvents();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Event Management</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Event Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Plus className="h-5 w-5" /> Create New Event
                        </h2>
                        <form action={createEvent} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Event Title</label>
                                <input required name="title" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. Summer Camp" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Date</label>
                                <input required name="date" type="date" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Location</label>
                                <input required name="location" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. City Park" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <textarea required name="description" className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Event details..." />
                            </div>
                            <Button type="submit" className="w-full">Create Event</Button>
                        </form>
                    </div>
                </div>

                {/* Events List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-muted-foreground border-b">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Event</th>
                                    <th className="px-6 py-4 font-medium">Date & Location</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {events.map((event) => (
                                    <tr key={event.id} className="hover:bg-slate-50/50">
                                        <td className="px-6 py-4">
                                            <p className="font-medium">{event.title}</p>
                                            <p className="text-xs text-muted-foreground line-clamp-1">{event.description}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span>{new Date(event.date).toLocaleDateString()}</span>
                                                <span className="text-xs text-muted-foreground">{event.location}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${event.status === 'UPCOMING' ? 'bg-green-100 text-green-700' :
                                                event.status === 'COMPLETED' ? 'bg-slate-100 text-slate-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {event.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/admin/events/${event.id}/live`}>
                                                <Button size="sm" variant="outline" className={event.status === 'IN_PROGRESS' ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100' : ''}>
                                                    {event.status === 'IN_PROGRESS' ? (
                                                        <>
                                                            <Radio className="w-3 h-3 mr-1 animate-pulse" /> Live Control
                                                        </>
                                                    ) : 'Manage'}
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {events.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                                            No events created yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
