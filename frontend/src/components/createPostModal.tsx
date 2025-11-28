"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  X,
  Image as ImageIcon,
  Loader2,
  Plus,
  Edit2,
  Trash2,
  Hash,
} from "lucide-react";
import { useImageProcessor } from "../hooks/useImageProcessor";

// Schema de validação
const createPostSchema = z.object({
  description: z
    .string()
    .min(1, "A descrição é obrigatória")
    .max(500, "A descrição deve ter no máximo 500 caracteres"),
  hashtags: z.array(z.string()),
});

type CreatePostFormValues = z.infer<typeof createPostSchema>;

export interface PostData {
  description: string;
  userId?: number;
  ongId?: number;
  projectId?: number;
  hashtags: string[];
  images: {
    content: string;
    caption: string;
  }[];
}

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  userImage: string;
  userName: string;
  userTitle: string;
  onPost: (postData: PostData) => Promise<void>;
}

interface ImageWithCaption {
  file: File;
  preview: string;
  caption: string;
  base64: string;
}

export default function CreatePostModal({
  isOpen,
  onClose,
  userImage,
  userName,
  userTitle,
  onPost,
}: CreatePostModalProps) {
  const [images, setImages] = useState<ImageWithCaption[]>([]);
  const [newHashtag, setNewHashtag] = useState("");
  const [isHashtagInputVisible, setIsHashtagInputVisible] = useState(false);
  const [editingImageIndex, setEditingImageIndex] = useState<number | null>(
    null
  );

  const { processImages, isProcessing } = useImageProcessor();

  const modalRef = useRef<HTMLDivElement>(null);
  const hashtagInputRef = useRef<HTMLInputElement>(null);
  const captionInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      description: "",
      hashtags: [],
    },
  });

  const hashtags = watch("hashtags");
  const description = watch("description");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isHashtagInputVisible && hashtagInputRef.current) {
      hashtagInputRef.current.focus();
    }
  }, [isHashtagInputVisible]);

  useEffect(() => {
    if (editingImageIndex !== null && captionInputRef.current) {
      captionInputRef.current.focus();
    }
  }, [editingImageIndex]);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      images.forEach((image) => {
        if (image.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, [images]);

  const handleClose = () => {
    reset();
    setImages([]);
    setNewHashtag("");
    setIsHashtagInputVisible(false);
    setEditingImageIndex(null);
    onClose();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const imageFiles = filesArray.filter((file) =>
        file.type.startsWith("image/")
      );

      if (imageFiles.length === 0) return;

      try {
        const processed = await processImages(imageFiles);
        const newImages = processed.map((img) => ({
          ...img,
          caption: "",
        }));
        setImages((prev) => [...prev, ...newImages]);
      } catch (error) {
        console.error("Erro ao processar imagens:", error);
        // Aqui poderia ter um toast de erro
      }
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });

    if (editingImageIndex === index) {
      setEditingImageIndex(null);
    }
  };

  const addHashtag = () => {
    if (newHashtag.trim()) {
      const tag = newHashtag.trim().startsWith("#")
        ? newHashtag.trim()
        : `#${newHashtag.trim()}`;

      if (!hashtags.includes(tag)) {
        setValue("hashtags", [...hashtags, tag]);
      }

      setNewHashtag("");
    }
    setIsHashtagInputVisible(false);
  };

  const removeHashtag = (index: number) => {
    setValue(
      "hashtags",
      hashtags.filter((_, i) => i !== index)
    );
  };

  const handleHashtagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addHashtag();
    } else if (e.key === "Escape") {
      setIsHashtagInputVisible(false);
      setNewHashtag("");
    }
  };

  const updateImageCaption = (index: number, caption: string) => {
    setImages((prev) => {
      const newImages = [...prev];
      newImages[index].caption = caption;
      return newImages;
    });
  };

  const insertHashtagsInText = () => {
    if (hashtags.length > 0) {
      const hashtagsText = hashtags.join(" ") + " ";
      const currentDescription = description || "";

      if (currentDescription.trim().endsWith(hashtagsText.trim())) {
        return;
      }

      const newDescription =
        currentDescription +
        (currentDescription && !currentDescription.endsWith(" ") ? " " : "") +
        "\n" +
        hashtagsText;
      setValue("description", newDescription);
    }
  };

  const onSubmit = async (data: CreatePostFormValues) => {
    try {
      const postData: PostData = {
        description: data.description,
        hashtags: data.hashtags,
        images: images.map((img) => ({
          content: img.base64,
          caption: img.caption,
        })),
      };

      await onPost(postData);
      handleClose();
    } catch (error) {
      console.error("Erro ao enviar post:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-lg w-full max-w-xl shadow-xl max-h-[90vh] overflow-y-auto"
      >
        {/* Cabeçalho */}
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg font-medium">Novo post</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Info Usuário */}
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full overflow-hidden">
                <img
                  src={userImage || "/placeholder.svg"}
                  alt={userName}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">{userName}</h3>
                <p className="text-xs text-gray-500">{userTitle}</p>
              </div>
            </div>
          </div>

          {/* Campos */}
          <div className="px-4 pb-3">
            <div className="mb-3">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Descrição <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                {...register("description")}
                placeholder="Sobre o que você quer falar?"
                className={`w-full min-h-[120px] text-base resize-none border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  errors.description
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                maxLength={500}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Hashtags Display */}
            {hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {hashtags.map((tag, index) => (
                  <div
                    key={index}
                    className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-sm flex items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeHashtag(index)}
                      className="ml-1 text-blue-400 hover:text-blue-700"
                      aria-label="Remove hashtag"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Hashtag Input */}
            {isHashtagInputVisible && (
              <div className="mb-3 flex">
                <input
                  ref={hashtagInputRef}
                  type="text"
                  value={newHashtag}
                  onChange={(e) => setNewHashtag(e.target.value)}
                  onKeyDown={handleHashtagKeyDown}
                  onBlur={addHashtag}
                  placeholder="Adicionar hashtag"
                  className="flex-grow border border-gray-300 rounded-l-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={addHashtag}
                  className="bg-blue-600 text-white px-3 py-1 rounded-r-md hover:bg-blue-700"
                >
                  Adicionar
                </button>
              </div>
            )}

            {/* Imagens */}
            {images.length > 0 && (
              <div className="space-y-4 mt-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div className="relative">
                      <img
                        src={image.preview || "/placeholder.svg"}
                        alt={`Preview ${index}`}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setEditingImageIndex(
                              editingImageIndex === index ? null : index
                            )
                          }
                          className="bg-gray-800 bg-opacity-70 text-white rounded-full p-1.5 hover:bg-opacity-100"
                          aria-label="Edit caption"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="bg-gray-800 bg-opacity-70 text-white rounded-full p-1.5 hover:bg-opacity-100"
                          aria-label="Remove image"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Legenda */}
                    {(editingImageIndex === index || image.caption) && (
                      <div className="p-3 bg-gray-50">
                        {editingImageIndex === index ? (
                          <>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Adicionar legenda
                            </label>
                            <div className="flex">
                              <input
                                ref={captionInputRef}
                                type="text"
                                value={image.caption}
                                onChange={(e) =>
                                  updateImageCaption(index, e.target.value)
                                }
                                placeholder="Sobre o que é esta imagem?"
                                className="flex-grow border border-gray-300 rounded-l-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                              <button
                                type="button"
                                onClick={() => setEditingImageIndex(null)}
                                className="bg-blue-600 text-white px-3 py-1.5 rounded-r-md hover:bg-blue-700 flex items-center"
                              >
                                <Plus size={16} className="mr-1" />
                                Salvar
                              </button>
                            </div>
                          </>
                        ) : (
                          <p className="text-sm text-gray-700">
                            {image.caption}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="px-4 pb-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsHashtagInputVisible(!isHashtagInputVisible);
                  if (isHashtagInputVisible) setNewHashtag("");
                }}
                className="text-blue-600 font-medium hover:bg-blue-50 rounded-md px-3 py-1.5 flex items-center text-sm"
              >
                <Hash size={16} className="mr-1" />
                Adicionar hashtag
              </button>

              {hashtags.length > 0 && (
                <button
                  type="button"
                  onClick={insertHashtagsInText}
                  className="text-blue-600 font-medium hover:bg-blue-50 rounded-md px-3 py-1.5 flex items-center text-sm"
                >
                  <Hash size={16} className="mr-1" />
                  Inserir hashtags no texto
                </button>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t flex justify-between items-center bg-gray-50 rounded-b-lg">
            <div className="flex space-x-4">
              <label
                className={`cursor-pointer p-2 rounded-full hover:bg-gray-200 transition-colors ${
                  isProcessing ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isProcessing}
                />
                {isProcessing ? (
                  <Loader2 size={24} className="animate-spin text-blue-500" />
                ) : (
                  <ImageIcon size={24} className="text-blue-500" />
                )}
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isProcessing}
              className={`px-6 py-2 rounded-full font-medium flex items-center transition-all ${
                isSubmitting || isProcessing
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Publicando...
                </>
              ) : (
                "Publicar"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
