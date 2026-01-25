import { Button } from "@/components/ui/button";
import { storage } from "@/lib/storage";
import { Calendar, MapPin, ArrowUpRight, Radio, Play, HandCoins } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import Image from "next/image";
import { getUserSession, getRegisteredEvents } from "@/app/actions";
import { EventRegistrationButton } from "./register-button";

export default async function ProgramsPage() {
    const events = await storage.getEvents();
    const user = await getUserSession();
    const registeredEvents = await getRegisteredEvents();
    const registeredEventIds = registeredEvents.map(e => e.id);

    // Helper to get smarter images based on title
    const getEventImage = (title: string, id: string) => {
        const t = title.toLowerCase();

        // Curated high-quality Unsplash images
        if (t.includes('food') || t.includes('hunger') || t.includes('meal')) {
            return "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop";
        }
        if (t.includes('clean') || t.includes('environment') || t.includes('tree') || t.includes('plant')) {
            return "https://images.unsplash.com/photo-1542601906990-b4d3fb7d5fa5?q=80&w=2070&auto=format&fit=crop";
        }
        if (t.includes('flood') || t.includes('disaster') || t.includes('relief')) {
            return "https://images.unsplash.com/photo-1547082688-9077fe60b8f9?q=80&w=2070&auto=format&fit=crop"; // Community helping in water
        }
        if (t.includes('edu') || t.includes('school') || t.includes('teach') || t.includes('kid')) {
            return "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2070&auto=format&fit=crop";
        }
        if (t.includes('health') || t.includes('medical') || t.includes('doctor')) {
            return "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=2070&auto=format&fit=crop";
        }

        // Generic beautiful community/volunteering fallbacks
        const images = [
            "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=2074&auto=format&fit=crop", // Group volunteering
            "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop", // Volunteer Shirt
            "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=2049&auto=format&fit=crop", // Group hands
            "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop", // Helping hand
        ];
        return images[parseInt(id) % images.length] || images[0];
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="container py-16 md:py-24 text-center mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Programs & Events</h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Explore our ongoing and upcoming initiatives. Join us on the ground to make a real difference in your community.
                    </p>
                </div>
            </div>

            <div className="container py-16 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <div key={event.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="relative h-56 w-full overflow-hidden">
                                <Image
                                    src={getEventImage(event.title, event.id)}
                                    alt={event.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${event.status === 'UPCOMING' ? 'bg-white text-green-700' :
                                        event.status === 'COMPLETED' ? 'bg-slate-100 text-slate-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                        {event.status}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center text-sm text-slate-500 mb-3 space-x-4">
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-1.5 text-primary" />
                                        {new Date(event.date).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center">
                                        <MapPin className="h-4 w-4 mr-1.5 text-primary" />
                                        {event.location}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-primary transition-colors">
                                    {event.title}
                                </h3>

                                <p className="text-slate-600 mb-6 flex-1 line-clamp-3 leading-relaxed">
                                    {event.description}
                                </p>

                                <div className="pt-6 border-t border-slate-100 mt-auto">
                                    {/* Fundraising Progress */
                                        event.fundraising && (
                                            <div className="mb-4">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="font-semibold text-slate-700">₹{event.fundraising.raised.toLocaleString()} raised</span>
                                                    <span className="text-slate-500">of ₹{event.fundraising.goal.toLocaleString()}</span>
                                                </div>
                                                <Progress value={(event.fundraising.raised / event.fundraising.goal) * 100} className="h-2" />
                                            </div>
                                        )}

                                    {event.status === 'IN_PROGRESS' && (
                                        <Link href={`/programs/${event.id}/live`} className="block mb-3">
                                            <Button className="w-full bg-red-600 hover:bg-red-700 text-white animate-pulse">
                                                <Radio className="mr-2 h-4 w-4" />
                                                View Live Updates
                                            </Button>
                                        </Link>
                                    )}

                                    <div className="grid grid-cols-2 gap-2">
                                        <EventRegistrationButton
                                            eventId={event.id}
                                            eventTitle={event.title}
                                            isLoggedIn={!!user}
                                            eventStatus={event.status}
                                            isRegistered={registeredEventIds.includes(event.id)}
                                        />
                                        <Button variant="outline" className="w-full border-green-600 text-green-700 hover:bg-green-50">
                                            <HandCoins className="mr-2 h-4 w-4" />
                                            Donate
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
