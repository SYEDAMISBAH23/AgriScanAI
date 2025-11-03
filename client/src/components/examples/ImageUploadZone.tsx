import ImageUploadZone from "../ImageUploadZone";
import { useState } from "react";

export default function ImageUploadZoneExample() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  return (
    <div className="p-8">
      <ImageUploadZone
        onImageSelect={(file) => {
          setSelectedImage(file);
          console.log("Image selected:", file.name);
        }}
        selectedImage={selectedImage}
        onClearImage={() => setSelectedImage(null)}
      />
    </div>
  );
}
