import { getEventFeedback } from "@/app/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function EventFeedbackPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const feedbackList = await getEventFeedback(id);

    // Calculate average rating
    const averageRating = feedbackList.length > 0
        ? (feedbackList.reduce((acc, curr) => acc + curr.rating, 0) / feedbackList.length).toFixed(1)
        : "N/A";

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/events">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Event Feedback</h1>
                    <p className="text-muted-foreground">View volunteer feedback and ratings</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Average Rating</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold flex items-center gap-2">
                            {averageRating}
                            <Star className="h-8 w-8 text-yellow-500 fill-current" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Responses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">{feedbackList.length}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Comments</h2>
                {feedbackList.length > 0 ? (
                    <div className="grid gap-4">
                        {feedbackList.map((feedback) => (
                            <Card key={feedback.id}>
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarFallback>{feedback.volunteerName.substring(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold">{feedback.volunteerName}</p>
                                                <p className="text-xs text-muted-foreground">{new Date(feedback.timestamp).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i < feedback.rating ? 'text-yellow-500 fill-current' : 'text-slate-300'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-slate-700">{feedback.comment}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed">
                        <p className="text-muted-foreground">No feedback received yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
