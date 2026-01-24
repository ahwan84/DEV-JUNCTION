import { storage } from "@/lib/storage";
import { FileText } from "lucide-react";

export default function AuditPage() {
    const logs = storage.getAuditLogs();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Audit Logs</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-muted-foreground border-b">
                        <tr>
                            <th className="px-6 py-4 font-medium">Timestamp</th>
                            <th className="px-6 py-4 font-medium">Action</th>
                            <th className="px-6 py-4 font-medium">Admin/User</th>
                            <th className="px-6 py-4 font-medium">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50/50">
                                <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                                    {new Date(log.timestamp).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 font-medium">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-mono text-xs">{log.adminId}</td>
                                <td className="px-6 py-4 text-muted-foreground">{log.details}</td>
                            </tr>
                        ))}
                        {logs.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center">
                                        <FileText className="h-10 w-10 text-slate-300 mb-2" />
                                        <p>No audit logs available.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
