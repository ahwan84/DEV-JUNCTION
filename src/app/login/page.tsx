'use client';

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight, Heart } from "lucide-react";
import Link from "next/link";
import { loginUser } from "@/app/actions";
import { Captcha } from "@/components/ui/captcha";

export default function LoginPage() {
    const [role, setRole] = useState<'user' | 'admin'>('user');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [captchaVerified, setCaptchaVerified] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!captchaVerified) {
            setError("Please complete the captcha verification.");
            return;
        }

        setIsLoading(true);
        setError('');

        if (role === 'admin') {
            // Admin login logic (keep existing mock for now, or update if user wants)
            // Implementation plan didn't specify changing admin login, so kept as mock to avoid regression
            // unless admin is also in storage? The types imply specific admin interface.
            // For MVP, keep simple check.
            if (email === 'admin' && password === 'admin') {
                document.cookie = "admin_session=true; path=/";
                router.push('/admin/dashboard');
            } else {
                setError('Invalid admin credentials');
                setIsLoading(false);
            }
        } else {
            // Volunteer Login
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);

            try {
                const result = await loginUser(formData);

                if (result.success) {
                    router.push('/');
                    router.refresh(); // Ensure navbar updates
                } else {
                    setError(result.error || 'Login failed');
                    setIsLoading(false);
                }
            } catch (err) {
                setError('An unexpected error occurred');
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                {/* Header */}
                <div className="bg-primary/5 p-8 text-center">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">
                        <Heart className="h-6 w-6 text-red-500 fill-current" />
                        <span className="text-xl font-bold text-slate-900">HopeConnect</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
                    <p className="text-slate-500 mt-2">Sign in to continue your journey</p>
                </div>

                {/* Role Switcher */}
                <div className="p-8 pb-0">
                    <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
                        <button
                            onClick={() => setRole('user')}
                            className={`flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-all ${role === 'user'
                                ? 'bg-white text-primary shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <User className="h-4 w-4" />
                            Donor / Volunteer
                        </button>
                        <button
                            onClick={() => setRole('admin')}
                            className={`flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-all ${role === 'admin'
                                ? 'bg-white text-primary shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <Lock className="h-4 w-4" />
                            Administrator
                        </button>
                    </div>
                </div>

                {/* Login Form */}
                <div className="p-8">
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                                {role === 'admin' ? 'Username' : 'Email Address'}
                            </label>
                            <input
                                type={role === 'admin' ? "text" : "email"}
                                className="flex h-11 w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={role === 'admin' ? "admin" : "john@example.com"}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-slate-700">Password</label>
                                <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
                            </div>
                            <input
                                type="password"
                                className="flex h-11 w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div className="pt-2 pb-2">
                            <Captcha onVerify={setCaptchaVerified} />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                            disabled={isLoading || !captchaVerified}
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                            {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                        </Button>
                    </form>

                    {role === 'user' && (
                        <div className="mt-6 text-center text-sm text-slate-500">
                            Don't have an account?{' '}
                            <Link href="/volunteer" className="text-primary font-medium hover:underline">
                                Join as Volunteer
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
