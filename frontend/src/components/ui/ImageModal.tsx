import React, { useRef, useEffect } from "react";
import { getFileNameFromUrl } from "@/utils/fileUtils";

interface ImageModalProps {
  imageUrl: string | null;
  altText: string;
  isZoomed: boolean;
  onClose: () => void;
  onToggleZoom: () => void;
}

export function ImageModal({
  imageUrl,
  altText,
  isZoomed,
  onClose,
  onToggleZoom,
}: ImageModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    if (imageUrl) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [imageUrl, onClose]);

  if (!imageUrl) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="relative bg-white rounded-lg shadow-lg max-w-full max-h-full"
      >
        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-gray-800 rounded-full p-2 text-lg hover:bg-gray-700 z-50"
          aria-label="Fechar"
        >
          &times;
        </button>

        {/* Botão de Salvar Imagem */}
        <a
          href={imageUrl}
          download={getFileNameFromUrl(imageUrl, altText)}
          className="absolute top-2 right-14 text-white bg-gray-800 rounded-full p-2 text-lg hover:bg-gray-700 z-50 flex items-center justify-center"
          aria-label="Salvar Imagem"
          title="Salvar Imagem"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </a>

        <div
          className="overflow-hidden flex items-center justify-center"
          style={{
            maxWidth: "90vw",
            maxHeight: "90vh",
          }}
        >
          <img
            src={imageUrl}
            alt={altText}
            className={`max-w-full max-h-full transition-transform duration-300 ease-in-out cursor-zoom-${
              isZoomed ? "out" : "in"
            }`}
            style={{
              transform: isZoomed ? "scale(1.5)" : "scale(1)",
              transformOrigin: "center center",
            }}
            onClick={onToggleZoom}
          />
        </div>
      </div>
    </div>
  );
}
