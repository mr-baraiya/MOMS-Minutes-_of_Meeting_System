'use client';

import { useState, useRef, useCallback } from 'react';
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropModalProps {
  imageSrc: string;
  onConfirm: (croppedFile: File) => void;
  onCancel: () => void;
  originalFileName: string;
  originalFileType: string;
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number): Crop {
  return centerCrop(
    makeAspectCrop({ unit: '%', width: 80 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
}

async function getCroppedBlob(
  image: HTMLImageElement,
  crop: PixelCrop,
  fileType: string
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width * scaleX;
  canvas.height = crop.height * scaleY;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height
  );
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Canvas toBlob failed'));
    }, fileType || 'image/jpeg', 0.92);
  });
}

export default function ImageCropModal({
  imageSrc,
  onConfirm,
  onCancel,
  originalFileName,
  originalFileType,
}: ImageCropModalProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(1); // 1:1 default
  const [processing, setProcessing] = useState(false);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
  }, []);

  const handleConfirm = async () => {
    if (!completedCrop || !imgRef.current) return;
    setProcessing(true);
    try {
      const blob = await getCroppedBlob(imgRef.current, completedCrop, originalFileType);
      const croppedFile = new File([blob], originalFileName, { type: originalFileType || 'image/jpeg' });
      onConfirm(croppedFile);
    } catch (err) {
      console.error('Crop failed:', err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Crop Profile Photo</h2>
            <p className="text-xs text-gray-400 mt-0.5">Drag to reposition · resize handles to adjust</p>
          </div>
          <button
            onClick={onCancel}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Aspect ratio toggles */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50">
          <span className="text-xs font-medium text-gray-500 mr-1">Ratio:</span>
          {[
            { label: '1:1', value: 1 },
            { label: '4:3', value: 4 / 3 },
            { label: '16:9', value: 16 / 9 },
            { label: 'Free', value: undefined },
          ].map(({ label, value }) => (
            <button
              key={label}
              onClick={() => {
                setAspect(value);
                if (imgRef.current && value !== undefined) {
                  const { width, height } = imgRef.current;
                  setCrop(centerAspectCrop(width, height, value));
                }
              }}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                aspect === value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Crop area */}
        <div className="overflow-auto flex-1 flex items-center justify-center p-4 bg-gray-900">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
            minWidth={50}
            minHeight={50}
            circularCrop={aspect === 1}
            className="max-w-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Crop preview"
              onLoad={onImageLoad}
              className="max-h-[50vh] max-w-full object-contain"
            />
          </ReactCrop>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-gray-100">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!completedCrop || processing}
            className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? 'Processing…' : 'Use Cropped Photo'}
          </button>
        </div>
      </div>
    </div>
  );
}
