import { useState, useCallback } from 'react';

export function useImageModal() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const openModal = useCallback((imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsZoomed(false);
    document.body.style.overflow = "hidden";
  }, []);

  const closeModal = useCallback(() => {
    setSelectedImage(null);
    setIsZoomed(false);
    document.body.style.overflow = "auto";
  }, []);

  const toggleZoom = useCallback(() => {
    setIsZoomed((prev) => !prev);
  }, []);

  return {
    selectedImage,
    isZoomed,
    openModal,
    closeModal,
    toggleZoom,
  };
}
