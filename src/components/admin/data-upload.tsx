'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Upload, FileJson, CheckCircle, AlertCircle } from 'lucide-react';

export function DataUpload() {
    const [jsonContent, setJsonContent] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const text = event.target?.result as string;
                // Validate if it's JSON
                JSON.parse(text);
                setJsonContent(text);
                setStatus('idle');
                setMessage('');
            } catch (err) {
                setStatus('error');
                setMessage('Invalid JSON file.');
            }
        };
        reader.readAsText(file);
    };

    const handleUpload = async () => {
        if (!jsonContent) return;

        setStatus('loading');
        try {
            // Further validation
            JSON.parse(jsonContent);

            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: jsonContent }),
            });

            if (!res.ok) throw new Error('Upload failed');

            setStatus('success');
            setMessage('Data updated successfully! The Transparency Hub will now use this new data.');
            setJsonContent('');
        } catch (error) {
            console.error(error);
            setStatus('error');
            setMessage('Failed to update data. Please check the JSON format.');
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileJson className="h-5 w-5 text-primary" />
                    Update NGO Data
                </CardTitle>
                <CardDescription>
                    Upload a new `ngo_data.json` file to update the Transparency Hub's knowledge base.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <input
                        type="file"
                        accept=".json"
                        onChange={handleFileUpload}
                        className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-slate-600 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>

                <Textarea
                    placeholder="Or paste JSON content here..."
                    value={jsonContent}
                    onChange={(e) => setJsonContent(e.target.value)}
                    className="min-h-[200px] font-mono text-xs"
                />

                <div className="flex justify-end">
                    <Button onClick={handleUpload} disabled={status === 'loading' || !jsonContent}>
                        {status === 'loading' ? 'Updating...' : (
                            <>
                                <Upload className="mr-2 h-4 w-4" />
                                Update Data
                            </>
                        )}
                    </Button>
                </div>

                {status === 'success' && (
                    <Alert className="bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-800">Success</AlertTitle>
                        <AlertDescription className="text-green-700">{message}</AlertDescription>
                    </Alert>
                )}

                {status === 'error' && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{message}</AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}
