'use client';

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { updatePassword } from "@/app/actions";

export function PasswordResetForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setMessage(null);

        try {
            const result = await updatePassword(formData);
            if (result.success) {
                setMessage({ type: 'success', text: 'Password updated successfully' });
                // Optional: Clear form
                (document.getElementById('password-form') as HTMLFormElement)?.reset();
            } else {
                setMessage({ type: 'error', text: result.error || 'Failed to update password' });
            }
        } catch (e) {
            setMessage({ type: 'error', text: 'An unexpected error occurred' });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form id="password-form" action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <label htmlFor="new-password" className="text-sm font-medium">New Password</label>
                <input
                    name="password"
                    type="password"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="••••••••"
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="confirm-password" className="text-sm font-medium">Confirm New Password</label>
                <input
                    name="confirmPassword"
                    type="password"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="••••••••"
                />
            </div>

            {message && (
                <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {message.text}
                </div>
            )}

            <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Password'}
            </Button>
        </form>
    );
}
