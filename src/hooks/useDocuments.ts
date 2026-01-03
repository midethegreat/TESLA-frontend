// hooks/useDocuments.ts
import { useEffect, useState } from "react";
import { documentService, type DocumentItem } from "../services/document.service";

export const useDocuments = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDocuments = async () => {
    const res = await documentService.list();
    setDocuments(res.data);
  };

  const uploadDocument = async (file: File) => {
    setLoading(true);
    try {
      const res = await documentService.upload(file);
      setDocuments((prev) => [res.data, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (id: string) => {
    await documentService.remove(id);
    setDocuments((prev) => prev.filter((d) => d._id !== id));
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return {
    documents,
    uploadDocument,
    deleteDocument,
    loading,
  };
};
