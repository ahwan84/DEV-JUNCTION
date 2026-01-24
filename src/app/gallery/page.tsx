import Image from "next/image";

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
        <div className="container py-12">
            <h1 className="text-4xl font-bold mb-4">Photo Gallery</h1>
            <p className="text-xl text-muted-foreground mb-10">Glimpses of our work and the smiles we've shared.</p>

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
