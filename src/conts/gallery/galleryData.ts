export interface GalleryItem {
    id: number;
    title: string;   
    image : string;   
}

export const galleryList: GalleryItem[] = JSON.parse(localStorage.getItem('galleryList') || '[]');