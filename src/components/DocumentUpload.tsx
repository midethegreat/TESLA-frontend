"use client";

import { useState, useRef } from "react";
import { Upload, FileText, Loader2, Trash2 } from "lucide-react";
import { useDocuments } from "../hooks/useDocuments";

const DocumentUpload = () => {
  const {
    documents,
    uploadDocument,
    deleteDocument,
    loading: uploading,
  } = useDocuments();

  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setError(null);

    if (file.size > 50 * 1024 * 1024) {
      setError("File size must be less than 50MB");
      return;
    }

    try {
      await uploadDocument(file);
    } catch (err: any) {
      setError(err.message || "Upload failed");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-8 transition-colors ${
          dragActive
            ? "border-amber-500 bg-amber-500/5"
            : "border-white/10 hover:border-white/20"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          accept=".pdf,.doc,.docx,.txt,.xlsx"
        />

        <div className="flex flex-col items-center justify-center text-center space-y-3">
          <Upload className="text-amber-500" size={32} />
          <div>
            <p className="text-white font-semibold">
              Drop your documents here
            </p>
            <p className="text-gray-400 text-sm">or</p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition disabled:opacity-50 flex items-center gap-2"
          >
            {uploading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Upload size={16} />
            )}
            Browse Files
          </button>
          <p className="text-xs text-gray-500">Max file size: 50MB</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {documents.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-white font-semibold">Your Documents</h3>
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc._id}
                className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-lg transition"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FileText
                    className="text-amber-500 flex-shrink-0"
                    size={20}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-white truncate font-medium">
                      {doc.fileName}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {(doc.fileSize / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => deleteDocument(doc._id)}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded transition flex-shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
