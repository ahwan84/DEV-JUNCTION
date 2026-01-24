import { DataUpload } from "@/components/admin/data-upload";

export default function AdminDataPage() {
    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Data Management</h1>
                <p className="text-muted-foreground">Upload data for the Transparency AI to reference.</p>
            </div>

            <DataUpload />
        </div>
    );
}
