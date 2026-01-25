import { storage } from "@/lib/storage";
import { getStaffSession } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, UserPlus } from "lucide-react";
import { redirect } from "next/navigation";
import { CreateStaffForm } from "@/components/admin/create-staff-form";

export default async function StaffPage() {
    const session = await getStaffSession();

    if (!session || session.role !== 'SUPER_ADMIN') {
        redirect('/admin/dashboard');
    }

    const staffList = await storage.getAllStaff();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Staff Management</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Create Staff Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserPlus className="h-5 w-5 text-primary" />
                            Create New Staff
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CreateStaffForm />
                    </CardContent>
                </Card>

                {/* Staff List */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            Existing Staff
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Username</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Permissions</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {staffList.length === 0 ? (
                                        <tr className="border-b transition-colors hover:bg-muted/50">
                                            <td colSpan={3} className="p-4 text-center text-muted-foreground">
                                                No staff accounts found.
                                            </td>
                                        </tr>
                                    ) : (
                                        staffList.map((staff: any) => (
                                            <tr key={staff.id} className="border-b transition-colors hover:bg-muted/50">
                                                <td className="p-4 align-middle font-medium">{staff.username}</td>
                                                <td className="p-4 align-middle">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${staff.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                                        }`}>
                                                        {staff.role}
                                                    </span>
                                                </td>
                                                <td className="p-4 align-middle text-xs text-muted-foreground">
                                                    {staff.role === 'SUPER_ADMIN' ? 'ALL' : staff.permissions?.join(', ') || 'None'}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
