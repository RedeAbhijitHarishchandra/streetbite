"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Heart, MessageCircle, Award, X } from "lucide-react";
import { toast } from "sonner";

interface Photo {
    id: number;
    imageUrl: string;
    username: string;
    foodName: string;
    location: string;
    likes: number;
    comments: number;
    isLiked: boolean;
    isPhotoOfWeek?: boolean;
}

const SAMPLE_PHOTOS: Photo[] = [
    {
        id: 1,
        imageUrl: "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=400&h=400&fit=crop",
        username: "foodie_raj",
        foodName: "Vada Pav",
        location: "Mumbai",
        likes: 234,
        comments: 45,
        isLiked: false,
        isPhotoOfWeek: true
    },
    {
        id: 2,
        imageUrl: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&h=400&fit=crop",
        username: "chaat_lover",
        foodName: "Pani Puri",
        location: "Delhi",
        likes: 189,
        comments: 32,
        isLiked: false
    },
    {
        id: 3,
        imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=400&fit=crop",
        username: "street_bites",
        foodName: "Dosa",
        location: "Bangalore",
        likes: 312,
        comments: 67,
        isLiked: false
    },
    {
        id: 4,
        imageUrl: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&h=400&fit=crop",
        username: "tasty_trails",
        foodName: "Biryani",
        location: "Hyderabad",
        likes: 456,
        comments: 89,
        isLiked: false
    },
    {
        id: 5,
        imageUrl: "https://images.unsplash.com/photo-1626132647523-66f2bf00c2e8?w=400&h=400&fit=crop",
        username: "momo_addict",
        foodName: "Momos",
        location: "Kolkata",
        likes: 178,
        comments: 28,
        isLiked: false
    },
    {
        id: 6,
        imageUrl: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=400&fit=crop",
        username: "kebab_king",
        foodName: "Seekh Kebab",
        location: "Lucknow",
        likes: 267,
        comments: 41,
        isLiked: false
    }
];

export function PhotoWall() {
    const [photos, setPhotos] = useState<Photo[]>(SAMPLE_PHOTOS);
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

    const handleLike = (photoId: number, e?: React.MouseEvent) => {
        e?.stopPropagation();
        setPhotos(photos.map(photo => {
            if (photo.id === photoId) {
                const newIsLiked = !photo.isLiked;
                return {
                    ...photo,
                    isLiked: newIsLiked,
                    likes: newIsLiked ? photo.likes + 1 : photo.likes - 1
                };
            }
            return photo;
        }));

        const photo = photos.find(p => p.id === photoId);
        if (photo && !photo.isLiked) {
            toast.success(`Liked ${photo.foodName}! ❤️`);
        }
    };

    const handleComment = (photoId: number, e?: React.MouseEvent) => {
        e?.stopPropagation();
        toast.info("Comments feature coming soon! 💬");
    };

    const handleUpload = () => {
        toast.info("Photo upload feature coming soon! 📸", {
            description: "Share your street food adventures with the community!"
        });
    };

    const openLightbox = (photo: Photo) => {
        setSelectedPhoto(photo);
    };

    const closeLightbox = () => {
        setSelectedPhoto(null);
    };

    return (
        <>
            <Card className="hover:shadow-lg transition-shadow border-primary/10">
                <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Camera className="w-5 h-5 text-pink-500" />
                                Foodie Photo Wall
                            </CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">
                                Community's best street food captures
                            </p>
                        </div>
                        <Button size="sm" onClick={handleUpload} className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                            <Camera className="w-4 h-4 mr-2" />
                            Upload
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="pt-6">
                    {/* Photo Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {photos.map((photo) => (
                            <div
                                key={photo.id}
                                onClick={() => openLightbox(photo)}
                                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                            >
                                <img
                                    src={photo.imageUrl}
                                    alt={photo.foodName}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                />

                                {/* Photo of the Week Badge */}
                                {photo.isPhotoOfWeek && (
                                    <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                                        <Award className="w-3 h-3" />
                                        POTW
                                    </div>
                                )}

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                                        <h4 className="font-bold text-sm">{photo.foodName}</h4>
                                        <p className="text-xs opacity-90">by {photo.username}</p>
                                        <div className="flex gap-3 mt-2 text-xs">
                                            <span className="flex items-center gap-1">
                                                <Heart className="w-3 h-3" />
                                                {photo.likes}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MessageCircle className="w-3 h-3" />
                                                {photo.comments}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="text-xs text-center text-muted-foreground mt-4 bg-pink-50 p-2 rounded-lg">
                        📸 Click on photos to view details • Share your food moments!
                    </p>
                </CardContent>
            </Card>

            {/* Lightbox Modal */}
            {selectedPhoto && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    onClick={closeLightbox}
                >
                    <div
                        className="relative bg-white rounded-2xl max-w-2xl w-full overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
                            onClick={closeLightbox}
                        >
                            <X className="w-5 h-5" />
                        </Button>

                        <img
                            src={selectedPhoto.imageUrl}
                            alt={selectedPhoto.foodName}
                            className="w-full aspect-square object-cover"
                        />

                        <div className="p-6 space-y-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold">{selectedPhoto.foodName}</h3>
                                    <p className="text-sm text-muted-foreground">📍 {selectedPhoto.location}</p>
                                    <p className="text-sm text-muted-foreground">by @{selectedPhoto.username}</p>
                                </div>
                                {selectedPhoto.isPhotoOfWeek && (
                                    <div className="bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-full flex items-center gap-2 text-sm font-bold">
                                        <Award className="w-4 h-4" />
                                        Photo of the Week
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant={selectedPhoto.isLiked ? "default" : "outline"}
                                    size="sm"
                                    onClick={(e) => handleLike(selectedPhoto.id, e)}
                                    className={selectedPhoto.isLiked ? "bg-red-500 hover:bg-red-600" : ""}
                                >
                                    <Heart className={`w-4 h-4 mr-2 ${selectedPhoto.isLiked ? 'fill-current' : ''}`} />
                                    {selectedPhoto.likes}
                                </Button>
                                <Button variant="outline" size="sm" onClick={(e) => handleComment(selectedPhoto.id, e)}>
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    {selectedPhoto.comments}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
