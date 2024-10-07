import react, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

function PdfUpload({ onUpload }) {
  const [filestatus, setFileStatus] = useState(null);
  const onDrop = useCallback(
    (acceptedFile) => {
      const file = acceptedFile[0];
      setFileStatus(acceptedFile[0]);
      onUpload(file);
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
        className={` border-dashed border-2 rounded-md max-w-md mx-auto  hover:border-blue-500 hover:bg-blue-50 p-4 text-center cursor-pointer bg: ${
          isDragActive ? "#f0f0f" : "#ffff"
        }`}
      >
        {filestatus ? (
          <div className="m-4">
            <h4>File Name: {filestatus.name}</h4>
            <p>File size: {(filestatus.size / 1024).toFixed(2)}KB</p>
          </div>
        ) : (
          <p>Drag 'n' drop a PDF file here, or click to select a file </p>
        )}
      </div>
    </div>
  );
}

export default PdfUpload;
