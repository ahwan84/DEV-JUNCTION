import Image from "next/image";
import { CompareSlider } from "@/components/ui/compare-slider";

export default function GalleryPage() {
    // Placeholder images
    const images = [
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=2074&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=2062&auto=format&fit=crop",
    ];

    return (
        <div className="container py-12 space-y-12">
            <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold mb-4">Photo Gallery</h1>
                <p className="text-xl text-muted-foreground">Glimpses of our work and the smiles we've shared.</p>
            </div>

            {/* Before/After Section */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-center">Our Impact: Before & After</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <CompareSlider
                            beforeImage="https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?q=80&w=2070&auto=format&fit=crop"
                            afterImage="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop"
                            beforeLabel="Neglected School"
                            afterLabel="Renovated Classroom"
                        />
                        <p className="text-center text-sm text-muted-foreground">Renovating local schools to provide better learning environments.</p>
                    </div>
                    <div className="space-y-2">
                        <CompareSlider
                            beforeImage="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop"
                            afterImage="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop"
                            beforeLabel="Empty Food Bank"
                            afterLabel="Stocked & Serving"
                        />
                        <p className="text-center text-sm text-muted-foreground">Restocking community food banks to fight hunger.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((src, i) => (
                    <div key={i} className="aspect-square relative overflow-hidden rounded-xl bg-slate-100 group">
                        <Image
                            src={src}
                            alt={`Gallery image ${i + 1}`}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
