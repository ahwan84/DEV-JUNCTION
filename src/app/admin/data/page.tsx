"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, FileJson, CheckCircle, AlertCircle } from "lucide-react";

export default function AdminDataPage() {
    const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setStatus("uploading");

        // Read file content
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const content = event.target?.result as string;
                // Validate JSON
                JSON.parse(content);

                // Send to API
                const response = await fetch("/api/upload", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content }),
                });

                if (!response.ok) throw new Error("Upload failed");

                setStatus("success");
                setMessage("Data successfully updated!");
            } catch (error) {
                console.error(error);
                setStatus("error");
                setMessage("Invalid JSON file or upload failed.");
            }
        };
        reader.readAsText(file);
    };

    const downloadTemplate = () => {
        const template = {
            contributors: [
                { name: "John Doe", amount: 5000, date: "2023-10-01" },
                { name: "Jane Smith", amount: 12000, date: "2023-10-05" }
            ],
            funds: {
                totalRaised: 50000,
                totalSpent: 35000,
                utilizationRate: "70%"
            },
            impact: {
                livesTouched: 1200,
                locations: 5,
                month: "October 2023"
            }
        };
        const blob = new Blob([JSON.stringify(template, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "data_template.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Data Management</h1>
                <p className="text-muted-foreground">Upload data for the Transparency AI to reference.</p>
            </div>

            <Card className="p-8 border-dashed border-2 flex flex-col items-center justify-center space-y-4 min-h-[300px]">
                <div className="p-4 bg-primary/10 rounded-full">
                    <Upload className="w-8 h-8 text-primary" />
                </div>
                <div className="text-center space-y-2">
                    <h3 className="font-semibold text-lg">Upload Data File</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                        Upload a JSON file containing contributor, fund, and impact data.
                    </p>
                </div>

                <div className="flex gap-4">
                    <Button variant="outline" onClick={downloadTemplate}>
                        <FileJson className="w-4 h-4 mr-2" />
                        Download Template
                    </Button>
                    <div className="relative">
                        <Button>Select File</Button>
                        <Input
                            type="file"
                            accept=".json"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleFileUpload}
                        />
                    </div>
                </div>

                {status === "success" && (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-md">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">{message}</span>
                    </div>
                )}

                {status === "error" && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-md">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">{message}</span>
                    </div>
                )}
            </Card>
        </div>
    );
}
