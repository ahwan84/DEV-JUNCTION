import { Button } from "@/components/ui/button";
import { createAnnouncement } from "@/app/actions";
import { storage } from "@/lib/storage";
import { Megaphone } from "lucide-react";

export default function AnnouncementsPage() {
    const announcements = storage.getAnnouncements();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Announcements</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Announcement Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Megaphone className="h-5 w-5" /> Post Update
                        </h2>
                        <form action={createAnnouncement} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Title</label>
                                <input required name="title" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. Winter Drive Success" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Content</label>
                                <textarea required name="content" className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Write your update here..." />
                            </div>
                            <Button type="submit" className="w-full">Post Announcement</Button>
                        </form>
                    </div>
                </div>

                {/* Announcements List */}
                <div className="lg:col-span-2">
                    <div className="space-y-4">
                        {announcements.map((item) => (
                            <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold">{item.title}</h3>
                                    <span className="text-xs text-muted-foreground">{new Date(item.date).toLocaleDateString()}</span>
                                </div>
                                <p className="text-muted-foreground whitespace-pre-wrap">{item.content}</p>
                                <div className="mt-4 text-xs text-muted-foreground font-medium">
                                    Posted by {item.author}
                                </div>
                            </div>
                        ))}
                        {announcements.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground bg-white rounded-xl border">
                                No announcements posted yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
