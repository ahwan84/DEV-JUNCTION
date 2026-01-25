import { getUserSession, getAnnouncements, getRegisteredEvents } from "@/app/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Clock, Bell, Calendar, MapPin } from "lucide-react";
import { PasswordResetForm } from "./password-form";
import { ProfileEditDialog } from "./profile-edit";
import { Leaderboard } from "@/components/volunteer/leaderboard";

export default async function DashboardPage() {
    // Server-side call to get user session
    const user = await getUserSession();
    const announcements = await getAnnouncements();
    const registeredEvents = await getRegisteredEvents();

    if (!user) {
        return <div className="p-8 text-center">Please log in to view your dashboard.</div>;
    }

    return (
        <div className="container mx-auto py-8 max-w-5xl space-y-8 px-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Welcome back, {user.name.split(' ')[0]}
            </h1>

            <div className="flex flex-col md:flex-row gap-6 items-start">

                {/* Left Column: Profile */}
                <Card className="w-full md:w-1/3">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4">
                            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                                <AvatarImage src={user.avatarUrl} alt={user.name} />
                                <AvatarFallback className="text-2xl">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </div>
                        <CardTitle className="text-xl">{user.name}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                        <ProfileEditDialog user={{ name: user.name, avatarUrl: user.avatarUrl }} />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-2">
                                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                                <span className="font-medium">Rating</span>
                            </div>
                            <span className="text-lg font-bold">{user.rating || 1} / 5</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-blue-500" />
                                <span className="font-medium">Joined</span>
                            </div>
                            <span className="text-sm">{new Date(user.joinedDate).toLocaleDateString()}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Right Column: Main Content */}
                <div className="w-full md:w-2/3 space-y-6">

                    {/* Announcements Section */}
                    {announcements.length > 0 && (
                        <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Bell className="h-5 w-5 text-indigo-600" />
                                    <CardTitle>Announcements</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {announcements.map((announcement) => (
                                    <div key={announcement.id} className="p-4 bg-white/50 rounded-lg border border-indigo-50">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-semibold text-indigo-900">{announcement.title}</h3>
                                            <span className="text-xs text-indigo-400">{new Date(announcement.date).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-sm text-indigo-800">{announcement.content}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    <Leaderboard />

                    {/* Upcoming Events Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>My Upcoming Events</CardTitle>
                            <CardDescription>Events you are registered for</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {registeredEvents.length > 0 ? (
                                registeredEvents.map((event) => (
                                    <div key={event.id} className="p-4 border rounded-lg bg-slate-50">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-slate-900">{event.title}</h3>
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${event.status === 'UPCOMING' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'
                                                }`}>
                                                {event.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-sm text-slate-500 mb-2 gap-3">
                                            <div className="flex items-center">
                                                <Calendar className="h-3 w-3 mr-1" />
                                                {new Date(event.date).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center">
                                                <MapPin className="h-3 w-3 mr-1" />
                                                {event.location}
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-600">{event.description}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 text-slate-500">
                                    <p>You haven't registered for any events yet.</p>
                                    <a href="/programs" className="text-primary hover:underline mt-2 inline-block text-sm">Browse Programs</a>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Reviews Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Reviews</CardTitle>
                            <CardDescription>What others are saying about your work</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {user.reviews && user.reviews.length > 0 ? (
                                user.reviews.map((review: any) => (
                                    <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                                        <div className="flex justify-between mb-2">
                                            <span className="font-semibold">{review.author}</span>
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-slate-300'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-slate-600 text-sm">{review.comment}</p>
                                        <p className="text-xs text-slate-400 mt-2">{new Date(review.date).toLocaleDateString()}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-muted-foreground text-center py-4">
                                    No reviews yet. Complete volunteer tasks to earn reviews!
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Password Reset Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Security</CardTitle>
                            <CardDescription>Update your password</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PasswordResetForm />
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}
