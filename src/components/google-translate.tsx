'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe, Check } from "lucide-react";
import { cn } from "@/lib/utils";

declare global {
    interface Window {
        googleTranslateElementInit: () => void;
        google: any;
    }
}

export function GoogleTranslate() {
    const [currentLang, setCurrentLang] = useState('en');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Initialize Google Translate
        window.googleTranslateElementInit = () => {
            // @ts-ignore
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: 'en',
                    includedLanguages: 'en,hi',
                    autoDisplay: false,
                },
                'google_translate_element'
            );
        };

        // Check cookie for current language
        // Cookie format: googtrans=/source/target
        const cookies = document.cookie.split(';');
        const googtrans = cookies.find(c => c.trim().startsWith('googtrans='));
        if (googtrans) {
            const value = googtrans.split('=')[1];
            // Check if target is 'hi'
            if (value.endsWith('/hi')) {
                setCurrentLang('hi');
            } else {
                setCurrentLang('en');
            }
        }
    }, []);

    const changeLanguage = (lang: string) => {
        // Set cookie for Google Translate
        // Format: /source/target
        const cookieValue = `/en/${lang}`;

        // Clear existing cookies first - crucial for reliability
        // We try to expire them for both the current domain and the root
        document.cookie = `googtrans=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
        document.cookie = `googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC`;

        // Set new cookie with correct format
        // Google Translate looks for this specific path/domain combination
        document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname}`;
        document.cookie = `googtrans=${cookieValue}; path=/;`; // fallback

        setCurrentLang(lang);
        window.location.reload();
    };

    if (!mounted) return null;

    return (
        <>
            {/* 
          Hidden Translation Element 
          CRITICAL: Do NOT use display:none or visibility:hidden, as Google Translate 
          skips initialization if it detects the element is not visible.
          Instead, we make it 1x1 pixel and throw it off screen/z-index.
        */}
            <div id="google_translate_element" className="absolute w-[1px] h-[1px] overflow-hidden -z-10 bg-transparent opacity-0 pointer-events-none top-0 left-0" />

            <Script
                src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
                strategy="afterInteractive"
            />

            {/* Custom Switcher UI */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 text-slate-600 hover:text-primary hover:bg-primary/10 transition-colors">
                        <Globe className="h-5 w-5" />
                        <span className="sr-only">Toggle Language</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[150px]">
                    <DropdownMenuItem
                        onClick={() => changeLanguage('en')}
                        className={cn("flex justify-between cursor-pointer", currentLang === 'en' && "bg-accent text-accent-foreground")}
                    >
                        English
                        {currentLang === 'en' && <Check className="h-4 w-4 ml-2" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => changeLanguage('hi')}
                        className={cn("flex justify-between cursor-pointer", currentLang === 'hi' && "bg-accent text-accent-foreground")}
                    >
                        Hindi (हिंदी)
                        {currentLang === 'hi' && <Check className="h-4 w-4 ml-2" />}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <style jsx global>{`
        /* Hide the Google Translate banner forcefullly */
        .goog-te-banner-frame {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
        }
        body {
            top: 0px !important; 
        }
        /* Hide tooltips and hover effects from Google */
        .goog-tooltip {
            display: none !important;
        }
        .goog-te-balloon-frame {
            display: none !important;
        }
        /* Remove blue hover highlights on translated text */
        font {
            background-color: transparent !important;
            box-shadow: none !important;
        }
        /* Ensure our element doesn't take space */
        .goog-te-gadget {
            height: 0;
            overflow: hidden;
        }
      `}</style>
        </>
    );
}
