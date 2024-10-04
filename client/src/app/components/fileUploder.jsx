import react, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

function PdfUpload({ onUpload }) {
  const onDrop = useCallback(
    (acceptedFile) => {
      onUpload(acceptedFile[0]);
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    onDrop,
  });

  return (
    <div {...getRootProps()} className="pdf-upload">
      <input {...getInputProps()} />
      <div
        className={` border-dashed border-2 p-4 text-center cursor-pointer bg: ${
          isDragActive ? "#f0f0f" : "#ffff"
        }`}
      >
        {isDragActive ? (
          <p>Drop the pdf here....</p>
        ) : (
          <p>Drag & drop a pdf here, or click to select one </p>
        )}
      </div>
    </div>
  );
}

export default PdfUpload;
