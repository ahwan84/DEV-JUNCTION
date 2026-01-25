import { Button } from "@/components/ui/button";
import { updateVolunteerStatus, getStaffSession } from "@/app/actions";
import { storage } from "@/lib/storage";
import { Check, X } from "lucide-react";

export default async function VolunteersPage() {
    const session = await getStaffSession();
    const canApprove = session?.role === 'SUPER_ADMIN' || session?.permissions?.includes('APPROVE_USERS');

    const volunteers = await storage.getVolunteers();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Volunteer Management</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-muted-foreground border-b">
                        <tr>
                            <th className="px-6 py-4 font-medium">Name</th>
                            <th className="px-6 py-4 font-medium">Contact</th>
                            <th className="px-6 py-4 font-medium">Skills</th>
                            <th className="px-6 py-4 font-medium">Availability</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {volunteers.map((volunteer) => (
                            <tr key={volunteer.id} className="hover:bg-slate-50/50">
                                <td className="px-6 py-4 font-medium">{volunteer.name}</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span>{volunteer.email}</span>
                                        <span className="text-xs text-muted-foreground">{volunteer.phone}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {volunteer.skills.map(skill => (
                                            <span key={skill} className="px-2 py-0.5 bg-slate-100 rounded-full text-xs">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4">{volunteer.availability}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${volunteer.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                        volunteer.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {volunteer.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {volunteer.status === 'PENDING' && canApprove && (
                                        <div className="flex justify-end gap-2">
                                            <form action={async () => {
                                                'use server';
                                                await updateVolunteerStatus(volunteer.id, 'APPROVED');
                                            }}>
                                                <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50">
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                            </form>
                                            <form action={async () => {
                                                'use server';
                                                await updateVolunteerStatus(volunteer.id, 'REJECTED');
                                            }}>
                                                <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50">
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </form>
                                        </div>
                                    )}
                                    {volunteer.status === 'PENDING' && !canApprove && (
                                        <span className="text-xs text-muted-foreground italic">Read Only</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {volunteers.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                    No volunteers found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
