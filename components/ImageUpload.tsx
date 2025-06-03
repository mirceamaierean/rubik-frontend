"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { CameraIcon, XIcon } from "@heroicons/react/outline";
import { detectColors } from "@/services/CubeService";
import { RubiksCube } from "@/utils/rubiksCube";

const FACE_LABELS = [
  "Up (U)",
  "Down (D)",
  "Front (F)",
  "Back (B)",
  "Left (L)",
  "Right (R)",
];

const PhotoUploadForm: React.FC<{
  onCubeDetected: (faces: RubiksCube["faces"]) => void;
}> = ({ onCubeDetected }) => {
  const [images, setImages] = useState<(File | null)[]>(Array(6).fill(null));
  const [previews, setPreviews] = useState<(string | null)[]>(
    Array(6).fill(null),
  );
  const [isCameraOpen, setIsCameraOpen] = useState<number | null>(null); // index of face being captured
  const [isLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
    }
  };

  const handleCapture = (idx: number) => {
    setIsCameraOpen(idx);
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      })
      .catch((err) => {
        console.error("Error accessing the camera: ", err);
      });
  };

  const takePhoto = () => {
    if (canvasRef.current && videoRef.current && isCameraOpen !== null) {
      const context = canvasRef.current.getContext("2d");
      context?.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height,
      );
      canvasRef.current.toBlob((blob) => {
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
        }
      }, "image/jpeg");
      stopCamera();
    }
  };

  const stopCamera = () => {
    setIsCameraOpen(null);
    if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
      videoRef.current.srcObject = null;
    }
  };

  const removePhoto = (idx: number) => {
    const newImages = [...images];
    const newPreviews = [...previews];
    newImages[idx] = null;
    newPreviews[idx] = null;
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // setIsLoading(true);
    const data = await detectColors(images as File[]);
    onCubeDetected(data);
    // setIsLoading(false);
  };

  return (
    <div className="bg-[#1a2332]/90 shadow rounded-lg w-full max-w-xl p-8 flex flex-col items-center justify-center mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-100">
        Upload or Capture Photos
      </h2>
      <p className="py-2 text-gray-300">
        Upload or capture a photo for each face of your cube
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-full gap-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mb-2">
          {FACE_LABELS.map((label, idx) => (
            <div
              key={label}
              className="flex flex-col items-center bg-[#232e42] rounded-lg p-4 w-full"
            >
              <span className="text-gray-200 mb-2 font-medium">{label}</span>
              {previews[idx] ? (
                <div className="relative mb-2 flex justify-center w-full">
                  <Image
                    src={previews[idx] as string}
                    width={160}
                    height={120}
                    alt={`Preview ${label}`}
                    className="rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg"
                  >
                    <XIcon className="h-5 w-5" />
                  </button>
                </div>
              ) : isCameraOpen === idx ? (
                <div className="relative mb-2 flex flex-col items-center w-full">
                  <video
                    ref={videoRef}
                    className="rounded-lg mb-2"
                    style={{ width: "100%", maxWidth: 160 }}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={takePhoto}
                      className="p-2 bg-primary text-white rounded-full"
                    >
                      <CameraIcon className="h-6 w-6" />
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="p-2 bg-red-500 text-white rounded-full"
                    >
                      <XIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRefs.current[idx]?.click()}
                    className="w-12 h-12 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center bg-gray-800 text-gray-300 hover:bg-gray-700"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={(el) => {
                      fileInputRefs.current[idx] = el;
                    }}
                    onChange={(e) => handleFileChange(e, idx)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => handleCapture(idx)}
                    className="w-12 h-12 border-2 border-gray-400 rounded-lg flex items-center justify-center bg-gray-800 text-gray-300 hover:bg-gray-700"
                  >
                    <CameraIcon className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="px-8 py-4 bg-primary text-white rounded-full flex items-center text-lg mt-2 bg-green-500 hover:bg-green-600 transition-colors duration-300 "
          disabled={isLoading}
        >
          {(isLoading && (
            <>
              Submitting...
              <svg
                className="animate-spin ml-2 h-8 w-8 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            </>
          )) ||
            "Submit All Photos"}
        </button>
        <canvas
          ref={canvasRef}
          style={{ display: "none" }}
          width="400"
          height="300"
        />
      </form>
    </div>
  );
};

export default PhotoUploadForm;
