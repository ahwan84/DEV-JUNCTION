'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { Heart, Menu, User, LogOut, Settings, Sparkles } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from 'react';
import { GoogleTranslate } from '@/components/google-translate';
import { logoutUser, updateUserProfile } from '@/app/actions';

interface NavbarProps {
    user?: {
        name: string;
        email: string;
        avatarUrl?: string;
    } | null;
}

export function Navbar({ user }: NavbarProps) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
    const [isLoading, setIsLoading] = useState(false);

    // Active link logic
    const pathname = usePathname();
    const navLinks = [
        { href: '/about', label: 'About' },
        { href: '/programs', label: 'Programs' },
        { href: '/impact', label: 'Impact' },
        { href: '/gallery', label: 'Gallery' },
        { href: '/volunteer', label: 'Volunteer' },
        { href: '/trust', label: 'Trust' },
    ];

    const handleLogout = async () => {
        await logoutUser();
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('avatarUrl', avatarUrl);
        await updateUserProfile(formData);
        setIsLoading(false);
        setIsProfileOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center space-x-2">
                        <Heart className="h-6 w-6 text-red-500 fill-current" />
                        <span className="text-xl font-bold">HopeConnect</span>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "group relative px-4 py-2 text-sm font-medium transition-colors hover:text-primary rounded-full hover:bg-slate-50",
                                pathname === link.href
                                    ? "text-primary bg-primary/5"
                                    : "text-slate-600"
                            )}
                        >
                            {link.label}
                            {pathname === link.href && (
                                <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary" />
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2 md:gap-4">
                    <GoogleTranslate />
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage
                                            src={user.avatarUrl || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
                                            alt={user.name}
                                        />
                                        <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard" className="cursor-pointer">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Dashboard</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link href="/login" className="hidden md:block text-sm font-medium text-muted-foreground hover:text-primary">
                            Login
                        </Link>
                    )}

                    <Link href="/donate">
                        <Button>Donate Now</Button>
                    </Link>
                    {/* Mobile Menu Trigger */}
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}
