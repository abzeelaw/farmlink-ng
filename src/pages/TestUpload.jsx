import { useState } from "react";
import toast from "react-hot-toast";

import { uploadProductImage } from "../services/storageService";

const TestUpload = () => {
  const [image, setImage] = useState(null);

  const handleUpload = async () => {
    if (!image) return;

    try {
      const url = await uploadProductImage(image);

      console.log(url);

      toast.success("Image Uploaded");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5">
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <button
        onClick={handleUpload}
        className="rounded-xl bg-emerald-600 px-6 py-3 text-white"
      >
        Upload
      </button>
    </div>
  );
};

export default TestUpload;