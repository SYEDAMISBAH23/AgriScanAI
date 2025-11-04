import { useState, useRef } from "react";
import { Camera, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onUpload: (file: File) => void;
}

export function CameraCapture({ onCapture, onUpload }: CameraCaptureProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isCamera, setIsCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    setCameraError(null);
    console.log("Starting camera...");

    try {
      // First set isCamera to true to show the video element
      setIsCamera(true);

      // Request camera access with fallback
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" } 
        });
      } catch (err) {
        console.log("Environment camera failed, trying default camera...");
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: true 
        });
      }

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(err => {
            console.error("Play failed:", err);
            setCameraError("Failed to start video playback");
          });
        };

        console.log("Camera started successfully");
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      setIsCamera(false);
      setCameraError("Unable to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCamera(false);
    setCameraError(null);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current.toDataURL("image/jpeg");
        setPreview(imageData);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setPreview(imageData);
      };
      reader.readAsDataURL(file);
      onUpload(file);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    stopCamera();
  };

  const handleAnalyze = () => {
    if (preview) {
      onCapture(preview);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-2">
        <div className="relative aspect-video bg-muted/50 flex items-center justify-center">
          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-full object-cover" data-testid="img-preview" />
          ) : isCamera ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ display: 'block' }}
              data-testid="video-camera"
            />
          ) : (
            <div className="text-center p-8">
              <Camera className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Start camera or upload an image
              </p>
              {cameraError && (
                <div className="mt-4 text-destructive text-sm bg-destructive/10 px-4 py-2 rounded-md">
                  {cameraError}
                </div>
              )}
            </div>
          )}
          {preview && (
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-4 right-4 z-10"
              onClick={clearPreview}
              data-testid="button-clear-preview"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          {isCamera && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium animate-pulse z-10" data-testid="text-camera-active">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                Camera Active
              </div>
            </div>
          )}
        </div>
      </Card>

      <canvas ref={canvasRef} className="hidden" />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      <div className="flex gap-4">
        {!preview && !isCamera && (
          <>
            <Button
              onClick={startCamera}
              variant="outline"
              className="flex-1"
              data-testid="button-start-camera"
            >
              <Camera className="h-4 w-4 mr-2" />
              Camera
            </Button>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="flex-1"
              data-testid="button-upload"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </>
        )}
        {isCamera && (
          <>
            <Button
              onClick={capturePhoto}
              className="flex-1"
              data-testid="button-capture"
            >
              Capture Photo
            </Button>
            <Button
              onClick={stopCamera}
              variant="outline"
              className="flex-1"
              data-testid="button-stop-camera"
            >
              Cancel
            </Button>
          </>
        )}
        {preview && (
          <Button
            onClick={handleAnalyze}
            className="w-full"
            data-testid="button-analyze"
          >
            Analyze Produce
          </Button>
        )}
      </div>
    </div>
  );
}
