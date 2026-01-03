// hooks/useAdminDocuments.ts
import { adminService } from "@/services/admin.service";
import { useState, useEffect } from "react";
export interface AdminDocument {
  id: string;
  fileName: string;
  fileType: string;
  filePath: string;
  fileSize: number;
  uploadedAt: string;
  email: string;
  firstName: string;
  lastName: string;
}

export const useAdminDocuments = (props?: {
  page?: number;
  limit?: number;
}) => {
  const { page = 1, limit = 20 } = props || {};

  const [documents, setDocuments] = useState<AdminDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page,
    limit,
    totalPages: 0,
  });

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);


      const demoDocuments: AdminDocument[] = [
        {
          id: "doc_001",
          fileName: "passport_scan.pdf",
          fileType: "pdf",
          filePath: "/uploads/documents/passport_001.pdf",
          fileSize: 2048,
          uploadedAt: "2024-02-15T10:30:00Z",
          email: "john.doe@example.com",
          firstName: "John",
          lastName: "Doe",
        },
        {
          id: "doc_002",
          fileName: "license_front.jpg",
          fileType: "jpg",
          filePath: "/uploads/documents/license_002.jpg",
          fileSize: 1024,
          uploadedAt: "2024-02-18T14:20:00Z",
          email: "jane.smith@example.com",
          firstName: "Jane",
          lastName: "Smith",
        },
        {
          id: "doc_003",
          fileName: "utility_bill.pdf",
          fileType: "pdf",
          filePath: "/uploads/documents/bill_003.pdf",
          fileSize: 3072,
          uploadedAt: "2024-02-20T09:45:00Z",
          email: "alex.wong@example.com",
          firstName: "Alex",
          lastName: "Wong",
        },
      ];

      await new Promise((resolve) => setTimeout(resolve, 500));

      setDocuments(demoDocuments);
      setPagination({
        total: demoDocuments.length,
        page: 1,
        limit: 20,
        totalPages: 1,
      });
    } catch (err: any) {
      setError(err.message || "Failed to fetch documents");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    if (adminService.isAdminLoggedIn()) {
      fetchDocuments();
    }
  }, []);

  return {
    documents,
    loading,
    error,
    pagination,
    refetch: fetchDocuments,
  };
};
