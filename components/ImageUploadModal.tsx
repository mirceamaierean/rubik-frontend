"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { detectColors } from "@/services/CubeService";

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCubeDetected: (faces: Array<Array<Array<string>>>) => void;
}

export default function ImageUploadModal({
  isOpen,
  onClose,
  onCubeDetected,
}: ImageUploadModalProps) {
  const [images, setImages] = useState<(File | null)[]>(Array(6).fill(null));
  const [previews, setPreviews] = useState<(string | null)[]>(
    Array(6).fill(null),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(-1);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    idx: number,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const newImages = [...images];
      const newPreviews = [...previews];
      newImages[idx] = file;
      newPreviews[idx] = URL.createObjectURL(file);
      setImages(newImages);
      setPreviews(newPreviews);
    } else {
      console.warn("📁 No file selected");
    }
  };

  const startCamera = async (idx: number) => {
    setIsCameraLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });
      setIsCameraOpen(idx);
      streamRef.current = stream;

      // Wait for the next tick to ensure the video element is rendered
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(console.error);
          // Set loading to false once video starts playing
          videoRef.current.onloadedmetadata = () => {
            setIsCameraLoading(false);
          };
        }
      }, 100);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Unable to access camera. Please check permissions and try again.");
      setIsCameraLoading(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `photo_face_${isCameraOpen + 1}.jpg`, {
            type: "image/jpeg",
          });
          const newImages = [...images];
          const newPreviews = [...previews];
          newImages[isCameraOpen] = file;
          newPreviews[isCameraOpen] = URL.createObjectURL(file);
          setImages(newImages);
          setPreviews(newPreviews);
          stopCamera();
        } else {
          console.error("📸 Failed to create blob from canvas");
        }
      }, "image/jpeg");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(-1);
    setIsCameraLoading(false);
  };

  const removePhoto = (idx: number) => {
    const newImages = [...images];
    const newPreviews = [...previews];
    newImages[idx] = null;
    newPreviews[idx] = null;
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const handleSubmit = async () => {
    // select images that are not null

    if (images.every((img) => img !== null)) {
      setIsLoading(true);
      try {
        const data = await detectColors(images as File[]);
        onCubeDetected(data);
        // onClose();
      } catch (error) {
        console.error("Error detecting colors:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.warn("⚠️ Not all images are present");
      images.forEach((img, idx) => {
        if (img === null) {
          console.warn(`⚠️ Image ${idx} is missing`);
        }
      });
    }
  };

  const faceLabels = ["Front", "Right", "Back", "Left", "Top", "Bottom"];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Upload Cube Images
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <p className="text-gray-600 mb-6">
            Upload or capture a photo for each face of your cube
          </p>

          {/* Camera Modal */}
          {isCameraOpen !== -1 && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60]">
              <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold mb-4">
                  Capture {faceLabels[isCameraOpen]} Face
                </h3>
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full rounded-lg mb-4 bg-gray-200"
                    style={{ minHeight: "200px" }}
                  />
                  {/* Region of Interest Overlay - 75% of video height, centered */}
                  <div className="absolute top-0 left-0 right-0 bottom-4 flex items-center justify-center pointer-events-none">
                    <div
                      className="border-2 border-white shadow-lg rounded-lg relative"
                      style={{
                        height: "79%",
                        aspectRatio: "1",
                        boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      <div className="w-full h-full border-2 border-dashed border-blue-400 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-medium bg-black/50 px-2 py-1 rounded">
                          Align cube face here
                        </span>
                      </div>
                    </div>
                  </div>
                  {isCameraLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-lg mb-4">
                      <span className="text-gray-500">Starting camera...</span>
                    </div>
                  )}
                </div>
                <canvas ref={canvasRef} className="hidden" />
                <div className="flex gap-2">
                  <button
                    onClick={capturePhoto}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Capture
                  </button>
                  <button
                    onClick={stopCamera}
                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center"
              >
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  {faceLabels[idx]}
                </h3>

                {previews[idx] ? (
                  <div className="relative">
                    <Image
                      src={previews[idx]!}
                      alt={`${faceLabels[idx]} face`}
                      width={150}
                      height={150}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removePhoto(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-4xl">📷</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => fileInputRefs.current[idx]?.click()}
                        className="w-full px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Upload
                      </button>
                      <button
                        onClick={() => startCamera(idx)}
                        className="w-full px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Camera
                      </button>
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={(el) => {
                    fileInputRefs.current[idx] = el;
                  }}
                  onChange={(e) => handleFileChange(e, idx)}
                />
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!images.every((img) => img !== null) || isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : "Detect Colors"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
