import React, { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  X,
  Image as ImageIcon,
  ZoomIn,
  Check,
  Loader2,
  Trash2,
} from "lucide-react";
import getCroppedImg from "../utils/canvasUtils";

export default function ImageUpload({ value, onChange, label }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const aspect = 1; // Always 1:1
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Auto-upload when fileToUpload changes
  useEffect(() => {
    if (fileToUpload) {
      console.log("Triggering auto-upload for file:", fileToUpload);
      handleUpload();
    }
  }, [fileToUpload]);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const onFileChange = useCallback(async (files) => {
    if (files && files.length > 0) {
      const file = files[0];
      const imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
      setIsCropping(true);
      setPreviewUrl(null);
      setFileToUpload(null);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onFileChange,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/jpg": [],
    },
    multiple: false,
  });

  const readFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    });
  };

  const handleCropConfirm = async () => {
    try {
      console.log("Starting crop confirm...");
      const croppedImageBlob = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        0,
      );
      console.log("Image cropped successfully:", croppedImageBlob);

      const preview = URL.createObjectURL(croppedImageBlob);
      setPreviewUrl(preview);
      // Set file to upload, which triggers the useEffect
      setFileToUpload(croppedImageBlob);
      setIsCropping(false);
    } catch (e) {
      console.error("Error during crop:", e);
      alert("Error al recortar la imagen");
    }
  };

  const handleUpload = async () => {
    if (!fileToUpload) return;

    console.log("Starting upload...");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", fileToUpload, "upload.jpg");

      const token = localStorage.getItem("token");
      console.log("Sending request to /api/upload...");
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Error al subir imagen: ${response.status} ${errText}`);
      }

      const data = await response.json();
      console.log("Upload success, data:", data);
      onChange(data.url);
      setPreviewUrl(null);
      setFileToUpload(null);
      setImageSrc(null);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error al subir la imagen: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!value) return;

    if (window.confirm("¿Estás seguro de eliminar esta imagen?")) {
      try {
        const token = localStorage.getItem("token");
        await fetch("/api/upload/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ url: value }),
        });
        onChange(null);
      } catch (e) {
        console.error(e);
        alert("Error al eliminar imagen");
      }
    }
  };

  const handleCancelCrop = () => {
    setIsCropping(false);
    setImageSrc(null);
  };

  const showCurrent = value && !previewUrl && !isCropping;

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 transition-colors hover:border-primary/50 bg-gray-50">
        {showCurrent && (
          <div className="relative group w-full h-48 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center mb-4">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-contain"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-white rounded-full text-gray-800 hover:bg-gray-100"
              >
                <ZoomIn size={20} />
              </a>
              <button
                type="button"
                onClick={handleDelete}
                className="p-2 bg-white rounded-full text-red-500 hover:bg-gray-100"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        )}

        {previewUrl && (
          <div className="relative w-full h-48 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center mb-4 border-2 border-primary">
            <img
              src={previewUrl}
              alt="To Upload"
              className="w-full h-full object-contain"
            />
            <button
              type="button"
              onClick={() => {
                setPreviewUrl(null);
                setFileToUpload(null);
              }}
              className="absolute top-2 right-2 p-1 bg-white rounded-full text-red-500 shadow-sm"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {!isCropping && (
          <div className="flex flex-col items-center justify-center gap-3">
            {!previewUrl && !showCurrent && (
              <div
                {...getRootProps()}
                className="text-center cursor-pointer p-6 w-full"
              >
                <input {...getInputProps()} />
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 text-primary">
                  <Upload size={24} />
                </div>
                <p className="text-sm text-gray-500 font-medium">
                  Arrastra una imagen aquí
                </p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG</p>
              </div>
            )}

            <div className="flex gap-3 w-full">
              {!previewUrl ? (
                <div {...getRootProps()} className="flex-1">
                  <input {...getInputProps()} />
                  <button
                    type="button"
                    className="w-full py-2 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <ImageIcon size={18} />
                    Examinar
                  </button>
                </div>
              ) : (
                <div className="w-full flex items-center justify-center py-4">
                  {uploading ? (
                    <div className="flex items-center gap-2 text-primary">
                      <Loader2 className="animate-spin" size={20} />
                      <span className="font-medium">Subiendo imagen...</span>
                    </div>
                  ) : (
                    <span className="text-green-600 font-medium flex items-center gap-2">
                      <Check size={20} /> ¡Lista para guardar!
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {isCropping && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-lg">Editar Imagen</h3>
              <button
                type="button"
                onClick={handleCancelCrop}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative flex-1 min-h-[400px] bg-gray-900">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                {...(aspect ? { aspect } : {})}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            <div className="p-4 bg-white space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Zoom</p>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t">
                <button
                  type="button"
                  onClick={handleCancelCrop}
                  className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleCropConfirm}
                  className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 flex items-center gap-2"
                >
                  <Check size={18} />
                  Recortar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
