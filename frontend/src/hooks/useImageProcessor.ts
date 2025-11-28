import { useState } from 'react';

interface ImageConfig {
  maxWidth: number;
  maxHeight: number;
  quality: number;
}

const DEFAULT_CONFIG: ImageConfig = {
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 0.85,
};

export interface ProcessedImage {
  file: File;
  preview: string;
  base64: string;
}

export function useImageProcessor(config: ImageConfig = DEFAULT_CONFIG) {
  const [isProcessing, setIsProcessing] = useState(false);

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > config.maxWidth || height > config.maxHeight) {
          const ratio = Math.min(config.maxWidth / width, config.maxHeight / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Não foi possível criar o contexto do canvas'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const base64 = canvas.toDataURL(file.type, config.quality);
        URL.revokeObjectURL(img.src);
        resolve(base64);
      };

      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error('Erro ao carregar a imagem'));
      };
    });
  };

  const processImages = async (files: File[]): Promise<ProcessedImage[]> => {
    setIsProcessing(true);
    try {
      const processed = await Promise.all(
        files.map(async (file) => {
          const preview = URL.createObjectURL(file);
          const base64 = await resizeImage(file);
          return {
            file,
            preview,
            base64,
          };
        })
      );
      return processed;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processImages,
    isProcessing,
  };
}
