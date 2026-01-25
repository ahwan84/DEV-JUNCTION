'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { postEventUpdate } from "@/app/actions";
import { Send, Image as ImageIcon, Loader2 } from "lucide-react";

interface UpdateFormProps {
    eventId: string;
}

export function UpdateForm({ eventId }: UpdateFormProps) {
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('content', content);
        if (imageUrl) formData.append('imageUrl', imageUrl);

        try {
            await postEventUpdate(eventId, formData);
            setContent("");
            setImageUrl("");
        } catch (error) {
            console.error("Failed to post update:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8 sticky top-4 z-20">
            <h3 className="font-bold text-sm text-slate-900 mb-3">Post a Live Update</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's happening right now?"
                    className="w-full min-h-[80px] p-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                    disabled={isSubmitting}
                />

                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Image URL (optional)"
                        className="flex-1 h-9 px-3 text-xs rounded-md border border-slate-200 focus:outline-none focus:border-primary"
                        disabled={isSubmitting}
                    />
                </div>

                <div className="flex justify-end pt-2">
                    <Button
                        type="submit"
                        size="sm"
                        className="rounded-full"
                        disabled={isSubmitting || !content.trim()}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Posting...
                            </>
                        ) : (
                            <>
                                Post Update
                                <Send className="w-3.5 h-3.5 ml-2" />
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
