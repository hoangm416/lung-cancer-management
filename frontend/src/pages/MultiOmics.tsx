import { useParams } from 'react-router-dom';
import { AlertCircle, CheckCircle, Copy, Download, Eye, FileIcon, Loader2, Share2, Trash2, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { FileObject } from '@supabase/storage-js';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';

const ROW_HEIGHT = 30;
const MIN_WIDTH = 200;

const MultiOmics = () => {
  const { sample_id } = useParams();

  const [files, setFiles] = useState<FileObject[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // States phục vụ cho việc xem file
  const [showViewer, setShowViewer] = useState(false);
  const [viewerUrl, setViewerUrl] = useState('');
  const [viewerFilename, setViewerFilename] = useState(''); // Lưu tên gốc của file
  const [tsvData, setTsvData] = useState<string[][]>([]); // Dùng cho .tsv
  const [viewerLoading, setViewerLoading] = useState(false);
  const [viewerError, setViewerError] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const [columnWidth, setColumnWidth] = useState<number>(MIN_WIDTH);

  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
    return `${size} ${sizes[i]}`;
  };

  useEffect(() => {
    if (sample_id) {
      loadFiles();
    }
  }, [sample_id]);
  
  const loadFiles = async () => {
    try {
      setLoading(true);
      setError('');
      // Gọi Supabase để lấy danh sách file trong thư mục sample_id
      const { data, error } = await supabase
        .storage
        .from('medical')
        .list(`${sample_id}`, { 
          limit: 100, 
          offset: 0, 
          sortBy: { column: 'name', order: 'asc' } 
        });

      if (error) throw error;
      // data là mảng các object: { name, id, updated_at, created_at, last_accessed_at, metadata: { size, ... } }
      setFiles(data || []);
    } catch (err) {
      setError('Lấy danh sách file thất bại');
      console.error('Lỗi', err);
    } finally {
      setLoading(false);
    }
  };

  // Hàm upload file
  const handleFileUpload = async (file: File) => {
    try {
      setUploading(true);
      setError('');

      const { error } = await supabase.storage
        .from('medical')
        .upload(`${sample_id}/${file.name}`, file);

      if (error) throw error;

      await loadFiles();
      setSuccess('Tệp đã được tải lên thành công');
    } catch (err) {
      setError('Không tải được tệp lên');
      console.error('Lỗi tải tệp lên:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;
    handleFileUpload(fileList[0]);
    event.target.value = '';
  };

  // Xử lý kéo thả file
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
        handleFileUpload(files[0]);
    }
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
  }, []);

  // Hàm tải file xuống
  const handleDownload = async (filename: string) => {
    try {
      setError('');
      const { data, error } = await supabase.storage
        .from('medical')
        .createSignedUrl(`${sample_id}/${filename}`, 60, { download: true });
  
      if (error) throw error;
  
      window.open(data.signedUrl, '_blank');
    } catch (err) {
      setError('Không thể tải xuống tệp');
      console.error('Lỗi tải xuống tệp:', err);
    }
  };
  
  const handleShare = async (filename: string) => {
    try {
      setError('');
      const { data, error } = await supabase.storage
        .from('medical')
        .createSignedUrl(`${sample_id}/${filename}`, 6 * 60 * 60);
  
      if (error) throw error;
  
      setShareUrl(data.signedUrl);
      setSelectedFile(filename);
    } catch (err) {
      setError('Không thể tạo liên kết chia sẻ');
      console.error('Lỗi chia sẻ tệp:', err);
    }
  };
  
  const handleDelete = async () => {
    if (!fileToDelete) return;
  
    try {
      setError('');
      const { error } = await supabase.storage
        .from('medical')
        .remove([`${sample_id}/${fileToDelete}`]);
  
      if (error) throw error;
  
      await loadFiles();
      setSuccess('Tệp đã được xóa thành công');
    } catch (err) {
      setError('Không thể xóa tệp');
      console.error('Lỗi xóa tệp:', err);
    } finally {
      setShowDeleteDialog(false);
      setFileToDelete(null);
    }
  };
  
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2000);
    } catch (err) {
      console.error('Không thể sao chép:', err);
      setError('Không thể sao chép vào clipboard');
    }
  };

  // Hàm view file: tạo signed URL, lưu viewerUrl và viewerFilename
  const handleView = async (filename: string) => {
    try {
      setError('');
      const { data, error } = await supabase.storage
        .from('medical')
        .createSignedUrl(`${sample_id}/${filename}`, 60 * 60);

      if (error) throw error;

      setViewerUrl(data.signedUrl);
      setViewerFilename(filename);
      setShowViewer(true);
    } catch (err) {
      setError('Không thể xem tệp');
      console.error('Lỗi xem tệp:', err);
    }
  };

  // Khi mở Dialog xem file, fetch nội dung nếu là .tsv hoặc .txt
  useEffect(() => {
    if (!showViewer) {
      // Reset state khi đóng Dialog
      setTsvData([]);
      setViewerError('');
      setViewerLoading(false);
      return;
    }

    const lowerName = viewerFilename.toLowerCase();
    const isTsv = lowerName.endsWith('.tsv');
    const isTxt = lowerName.endsWith('.txt');

    if (!isTsv && !isTxt) {
      setViewerError('Chỉ hỗ trợ xem file .txt hoặc .tsv dưới dạng bảng');
      return;
    }

    setViewerLoading(true);
    setViewerError('');

    fetch(viewerUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Không thể tải file (status ${res.status})`);
        }
        return res.text();
      })
      .then((rawText) => {
        // Với .tsv: tách theo '\t'
        // Với .txt: tách cột theo bất kỳ khoảng trắng (tab hoặc space)
        const rows = rawText.trim().split('\n').map((line) => {
          if (isTsv) {
            return line.split('\t');
          } else {
            // với .txt: split bất kỳ khoảng trắng (1 hoặc nhiều) thành cột
            return line.trim().split(/\s+/);
          }
        });
        setTsvData(rows);

        // Tính chiều rộng mỗi cột theo chiều rộng thực tế của Dialog
        const dialogEl = dialogRef.current;
        if (dialogEl && rows.length > 0) {
          const dialogWidth = dialogEl.clientWidth;
          const columnCount = rows[0].length;
          const calculatedWidth = Math.floor(dialogWidth / columnCount);
          setColumnWidth(Math.max(MIN_WIDTH, Math.min(calculatedWidth, 490))); // giới hạn min-max
        }
      })
      .catch((err) => {
        console.error('Lỗi khi tải hoặc parse file:', err);
        setViewerError('Không thể tải hoặc phân tích file.');
        setTsvData([]);
      })
      .finally(() => {
        setViewerLoading(false);
      });
  }, [showViewer, viewerUrl, viewerFilename]);

  // Component render 1 dòng TSV (dùng react-window)
  const Row = ({ index, style, data }: ListChildComponentProps) => {
    const row: string[] = data[index];
    return (
      <div
        style={style}
        className={`flex ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
      >
        {row.map((cell, colIdx) => (
          <div
            key={colIdx}
            className="flex-shrink-0 border px-2 py-1 text-sm truncate whitespace-nowrap overflow-hidden"
            style={{ width: columnWidth }}
            title={cell}
          >
            {cell}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-2 gap-7 p-4">
      <div className="col-span-1 border-2">
        <p className=" bg-[#F2F1F1] px-2 py-2 text-lg font-semibold">
          Thông tin chuyên ngành 
        </p>
        <div className="w-full space-y-5 p-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Quản lý dữ liệu thô (miRNA, Biểu hiện gen, Biến đổi số lượng bản sao, Methyl hóa DNA, ...)
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4"/>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-4">
                  <CheckCircle className="h-4 w-4"/>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="flex items-center justify-center w-full">
                <label
                  className={`w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-lg tracking-wide border-2 cursor-pointer transition-colors ${
                    isDragging
                      ? 'border-primary bg-secondary'
                      : 'border-border hover:bg-hover'
                  }`}
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="w-8 h-8"/>
                  <span className="mt-2 text-base">
                    {uploading
                      ? 'Đang tải...'
                      : isDragging
                        ? 'Thả tệp tại đây'
                        : 'Kéo thả hoặc nhấp để chọn tệp (tối đa 50MB)'}
                  </span>
                  <input
                    type="file"
                    accept=".tsv, .txt"
                    className="hidden"
                    onChange={handleInputChange}
                    disabled={uploading}
                  />
                </label>
              </div>

              <div className="space-y-4">
                {loading && (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin"/>
                  </div>
                )}

                {files.length === 0 ? (
                  <p className="text-center text-gray-500">Chưa có tệp tin nào</p>
                ) : (
                  files.map((file) => (
                    <div
                      key={file.name}
                      className="flex items-center justify-between p-4 bg-white rounded-lg border"
                    >
                      <div className="flex items-center space-x-3">
                        <FileIcon className="h-6 w-6 text-gray-400" />
                        {/* Tên file */}
                        <span className="font-medium">{file.name.split('/').pop()}</span>
                        {/* Dung lượng file */}
                        <span className="text-sm text-gray-500">
                          {file.metadata?.size != null
                            ? formatFileSize(file.metadata.size)
                            : '-'}
                        </span>
                        {/* Thời gian cập nhật cuối */}
                        <span className="text-sm text-gray-500">
                          {file.updated_at
                            ? new Date(file.updated_at).toLocaleString()
                            : '-'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleView(file.name)}
                          className="p-2 text-orange-500 hover:bg-orange-50 rounded-full transition-colors"
                          title="Xem"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDownload(file.name)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                          title="Tải xuống"
                        >
                          <Download className="h-5 w-5"/>
                        </button>
                        <button
                          onClick={() => handleShare(file.name)}
                          className="p-2 text-green-500 hover:bg-green-50 rounded-full transition-colors"
                          title="Chia sẻ"
                        >
                          <Share2 className="h-5 w-5"/>
                        </button>
                        <button
                          onClick={() => {
                            setFileToDelete(file.name);
                            setShowDeleteDialog(true);
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="h-5 w-5"/>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Share Dialog */}
              <Dialog open={Boolean(shareUrl)} onOpenChange={() => {
                setShareUrl('');
                setSelectedFile(null);
              }}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Chia sẻ {selectedFile?.split('/').pop()}</DialogTitle>
                    <DialogDescription>
                      Sao chép liên kết bên dưới để chia sẻ tệp. Liên kết này sẽ hết hạn sau 6 giờ.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="flex-1 p-2 border rounded bg-gray-50"
                    />
                    <button
                      onClick={() => copyToClipboard(shareUrl)}
                      className="p-2 text-primary-600 hover:bg-primary-50 rounded-full transition-colors relative"
                    >
                      <Copy className="h-5 w-5"/>
                      {showCopiedMessage && (
                        <span
                          className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded">
                          Đã sao chép!
                        </span>
                      )}
                    </button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Delete Confirmation Dialog */}
              <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xóa file</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn có chắc chắn muốn xóa tệp này không?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-red-300">
                      Xóa
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* Viewer Dialog (Virtualized): hiển thị .tsv hoặc .txt dạng bảng */}
              <Dialog open={showViewer} onOpenChange={setShowViewer}>
                <DialogContent className="max-w-5xl h-[90vh] p-0 flex flex-col">
                  {/* Header Dialog */}
                  <div className="px-4 py-2 border-b flex justify-between items-center">
                    <h3 className="text-lg font-medium">Xem tệp: {viewerFilename}</h3>
                  </div>

                  {/* Nội dung chính */}
                  <div className="flex-1 bg-white p-4">
                    {viewerLoading && (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        Đang tải…
                      </div>
                    )}

                    {viewerError && !viewerLoading && (
                      <div className="w-full h-full flex items-center justify-center text-red-500">
                        {viewerError}
                      </div>
                    )}

                    {/* Khi đã parse xong (tsvData.length > 0) */}
                    {!viewerLoading &&
                      !viewerError &&
                      tsvData.length > 0 &&
                      (viewerFilename.toLowerCase().endsWith('.tsv') ||
                        viewerFilename.toLowerCase().endsWith('.txt')) && (
                        <div
                          className="overflow-x-auto"
                          style={{ height: '100%' }} // Chiếm toàn bộ chiều cao còn lại
                        >
                          {/* Header row: width = số cột × columnWidth */}
                          <div
                            className="flex bg-secondary sticky top-0 z-10"
                            style={{ width: tsvData[0].length * columnWidth }}
                          >
                            {tsvData[0].map((headerCell, idx) => (
                              <div
                                key={idx}
                                className="flex-shrink-0 border px-2 py-1 font-semibold text-sm truncate whitespace-nowrap overflow-hidden"
                                style={{ width: columnWidth }}
                                title={headerCell} // để hiển thị full text khi hover
                              >
                                {headerCell}
                              </div>
                            ))}
                          </div>

                          {/* Virtualized List */}
                          <List
                            height={window.innerHeight * 0.8 - ROW_HEIGHT}
                            itemCount={tsvData.length - 1}
                            itemSize={ROW_HEIGHT}
                            width={tsvData[0].length * columnWidth}
                            itemData={tsvData.slice(1)}
                            className="outline-none"
                          >
                            {Row}
                          </List>
                        </div>
                      )}

                    {/* Nếu bảng rỗng */}
                    {!viewerLoading &&
                      !viewerError &&
                      (viewerFilename.toLowerCase().endsWith('.tsv') ||
                        viewerFilename.toLowerCase().endsWith('.txt')) &&
                      tsvData.length === 0 && (
                        <div className="text-gray-500 text-center">Không có dữ liệu</div>
                      )}

                    {/* Nếu không phải .tsv hoặc .txt */}
                    {!viewerLoading &&
                      !viewerError &&
                      !viewerFilename.toLowerCase().endsWith('.tsv') &&
                      !viewerFilename.toLowerCase().endsWith('.txt') && (
                        <div className="text-red-500 text-center">
                          Chỉ hỗ trợ xem file .txt hoặc .tsv dưới dạng bảng
                        </div>
                      )}
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default MultiOmics;