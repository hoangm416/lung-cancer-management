import React, { useRef, useState } from "react";
import { useFiles, useUploadFile, useDeleteFile, useRenameFile } from "../api/LungFileApi";
import { FileType, FileData } from "../types";

type Props = {
  case_submitter_id: string;
};

const FileManagement: React.FC<Props> = ({ case_submitter_id }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileType, setSelectedFileType] = useState<FileType>("cnv");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  // API hooks
  const { data: filesData, isLoading } = useFiles(case_submitter_id);
  const uploadMutation = useUploadFile();
  const deleteMutation = useDeleteFile();
  const renameMutation = useRenameFile();

  // Xử lý chọn file
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] || null);
  };

  // Xử lý kéo-thả file
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  // Xử lý upload file
  const handleFileUpload = () => {
    if (!file) return;

    uploadMutation.mutate(
      {
        case_submitter_id,
        file,
        fileType: selectedFileType,
        fileName: file.name,
      },
      {
        onSuccess: () => {
          setFile(null);
          setUploadProgress(0);
        },
        onError: () => {
          alert("Có lỗi xảy ra khi upload file.");
        },
      }
    );
  };

  // Xử lý xóa file
  const handleDelete = (fileType: FileType) => {
    deleteMutation.mutate({ case_submitter_id, fileType });
  };

  // Xử lý đổi tên file
  const handleRename = (fileType: FileType, currentFileName: string) => {
    const newName = prompt("Nhập tên file mới:", currentFileName);
    if (newName) {
      renameMutation.mutate({ case_submitter_id, fileType, newFileName: newName });
    }
  };

  // Lọc file theo từ khóa tìm kiếm
  const filteredFiles = filesData?.filter((file) =>
    file.file_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <p>Đang tải danh sách file...</p>;

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Quản lý file</h2>

      {/* Khu vực kéo-thả và upload file */}
      <div
        className={`border-dashed border-2 rounded-lg p-6 mb-6 text-center ${
            isDragging ? "border-blue-600 bg-blue-50" : "border-gray-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        >
        {file ? (
            <p className="text-lg">{file.name}</p>
        ) : (
            <p className="text-gray-600">Kéo-thả file vào đây hoặc nhấn để chọn file</p>
        )}
        <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
        />
        <button
            onClick={() => fileInputRef.current?.click()} // Gọi click vào input file
            className="cursor-pointer text-blue-600 underline"
        >
            Chọn file
        </button>
        </div>

      {/* Hiển thị tiến trình upload */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="w-full bg-gray-300 rounded-lg">
          <div
            className="bg-blue-600 h-2 rounded-lg"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}

      <div className="flex items-center gap-4 mb-6">
        <select
          value={selectedFileType}
          onChange={(e) => setSelectedFileType(e.target.value as FileType)}
          className="border rounded px-4 py-2"
        >
          <option value="cnv">CNV</option>
          <option value="dna_methylation">DNA Methylation</option>
          <option value="miRNA">miRNA</option>
          <option value="gene_expression">Gene Expression</option>
        </select>
        <button
          onClick={handleFileUpload}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Upload
        </button>
      </div>

      {/* Thanh tìm kiếm */}
      <input
        type="text"
        placeholder="Tìm kiếm file..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border border-gray-400 rounded-lg px-4 py-2 mb-4 w-full"
      />

      {/* Danh sách file */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredFiles?.map((file) => (
          <div
            key={file.file_type}
            className="bg-white p-4 rounded-lg shadow-md"
          >
            <a
              href={file.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-medium"
            >
              📁 {file.file_name || "Không có tên file"}
            </a>
            <p className="text-gray-600 text-sm">Loại file: {file.file_type}</p>
            <p className="text-gray-600 text-sm">
              Ngày tải lên: {file.uploaded_at || "Không xác định"}
            </p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => handleDelete(file.file_type)}
                className="bg-red-600 text-white px-2 py-1 rounded"
              >
                Xóa
              </button>
              <button
                onClick={() => handleRename(file.file_type, file.file_name || "Unnamed File")}
                className="bg-yellow-500 text-white px-2 py-1 rounded"
              >
                Đổi tên
              </button>
              <a
                href={file.file_url}
                download
                className="bg-green-600 text-white px-2 py-1 rounded"
              >
                Tải xuống
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileManagement;