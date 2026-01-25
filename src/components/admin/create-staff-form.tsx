'use client';

import { createStaff } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { UserPlus } from "lucide-react";

export function CreateStaffForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setMessage(null);

        try {
            const result = await createStaff(formData);
            if (result.success) {
                setMessage({ type: 'success', text: 'Staff account created successfully!' });
                // Reset form
                (document.getElementById('create-staff-form') as HTMLFormElement)?.reset();
            } else {
                setMessage({ type: 'error', text: result.error || 'Failed to create staff account.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An unexpected error occurred.' });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form id="create-staff-form" action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Username</label>
                <Input id="username" name="username" placeholder="e.g. staff_john" required />
            </div>
            <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Password</label>
                <Input id="password" name="password" type="password" required />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Permissions</label>
                <div className="flex flex-col gap-2 p-3 border rounded-md bg-slate-50">
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" name="permissions" value="VIEW_AUDITS" className="rounded border-slate-300 text-primary focus:ring-primary" />
                        View Audit Logs
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" name="permissions" value="APPROVE_USERS" className="rounded border-slate-300 text-primary focus:ring-primary" />
                        Approve Volunteer Applications
                    </label>
                    <input type="hidden" name="permissions" value="" />
                </div>
                <p className="text-xs text-muted-foreground">
                    Select permissions for this staff member.
                </p>
            </div>

            {message && (
                <div className={`p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Staff Account'}
            </Button>
        </form>
    );
}
