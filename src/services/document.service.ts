// services/document.service.ts
import API from "./api";

export interface DocumentItem {
  _id: string;
  fileName: string;
  storedName: string;
  fileSize: number;
  mimeType: string;
  path: string;
  createdAt: string;
  updatedAt: string;
}

export const documentService = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return API.post<DocumentItem>("/documents", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  list: () => {
    return API.get<DocumentItem[]>("/documents");
  },

  remove: (id: string) => {
    return API.delete<{ success: boolean }>(`/documents/${id}`);
  },
};
