import { useParams } from 'react-router-dom';
import { AlertCircle, CheckCircle, Copy, Download, Eye, FileIcon, Loader2, Maximize2, Minimize2, Share2, Trash2, Upload, ZoomIn, ZoomOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { FileObject } from '@supabase/storage-js';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';

const TissueImage = () => {
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
  const [showViewer, setShowViewer] = useState(false);
  const [viewerUrl, setViewerUrl] = useState('');

  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    if (sample_id) {
      loadFiles();
    }
  }, [sample_id]);
  
  const loadFiles = async () => {
    try {
      setLoading(true);
      setError('');
      const {data, error} = await supabase.storage.from('tissue').list(`${sample_id}`);

      if (error) throw error;
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
        .from('tissue')
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
        .from('tissue')
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
        .from('tissue')
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
        .from('tissue')
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

  const handleView = async (filename: string) => {
    try {
      setError('');
      const { data, error } = await supabase.storage
        .from('tissue')
        .createSignedUrl(`${sample_id}/${filename}`, 60 * 60);

      if (error) throw error;

      setViewerUrl(data.signedUrl);
      setShowViewer(true);
    } catch (err) {
      setError('Không thể xem tệp');
      console.error('Lỗi xem tệp:', err);
    }
  };

  const ImageViewer = ({ viewerUrl, onClose }) => {
    const [scale, setScale] = useState(1); // Quản lý mức độ phóng đại
    const [isFullScreen, setIsFullScreen] = useState(false); // Trạng thái toàn màn hình
    const imageRef = useRef(null); // Tham chiếu đến ảnh
    const [position, setPosition] = useState({x: 0, y: 0});
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 }); // Vị trí chuột ban đầu
    const containerRef = useRef(null); // Tham chiếu đến khung chứa

    // Hàm phóng to
    const zoomIn = () => setScale(prev => Math.min(prev + 0.1, 3));
    // Hàm thu nhỏ
    const zoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));
    // Chuyển đổi chế độ toàn màn hình
    const toggleFullScreen = () => {
      if (!isFullScreen) {
        imageRef?.current?.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
      setIsFullScreen(!isFullScreen);
    };

    // Xử lý sự kiện cuộn chuột
    useEffect(() => {
      const handleWheel = (e) => {
        if (isFullScreen) {
          e.preventDefault();
          if (e.deltaY < 0) zoomIn(); // Cuộn lên để phóng to
          else zoomOut(); // Cuộn xuống để thu nhỏ
        }
      };

      if (isFullScreen) {
        document.addEventListener('wheel', handleWheel, { passive: false });
      }
      return () => document.removeEventListener('wheel', handleWheel);
    }, [isFullScreen]);

    // Bắt đầu kéo ảnh
  const startDrag = (e) => {
    if (scale > 1) { // Chỉ kéo khi ảnh phóng to
      setIsDragging(true);
      setStartPos({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  // Di chuyển ảnh
  const dragImage = (e) => {
    if (isDragging) {
      const newX = e.clientX - startPos.x;
      const newY = e.clientY - startPos.y;
      setPosition({ x: newX, y: newY });
    }
  };

  // Dừng kéo
  const stopDrag = () => setIsDragging(false);

  // Căn giữa ảnh khi tải xong
  useEffect(() => {
    const image = imageRef.current;
    const container = containerRef.current;

    if (image && container) {
      const imgRect = image.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      // Tính toán vị trí để căn giữa
      const centerX = (containerRect.width - imgRect.width) / 2;
      const centerY = (containerRect.height - imgRect.height) / 2;

      setPosition({ x: centerX, y: centerY });
    }
  }, [viewerUrl, scale]);

    return (
      <div 
        className="relative w-full h-full flex flex-col"
        ref={containerRef}
        onMouseMove={dragImage}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
      >
        {/* Thanh công cụ với các nút */}
        <div className="flex justify-between items-center p-2 bg-gray-400">
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={zoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={zoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={toggleFullScreen}>
              {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        {/* Khu vực hiển thị ảnh */}
        <div 
          className="flex-1 overflow-auto flex items-center justify-center bg-gray-100"
          onMouseDown={startDrag}
        >
          <img
            ref={imageRef}
            src={viewerUrl}
            alt="Xem ảnh"
            // className="object-contain"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              cursor: scale > 1 ? 'grab' : 'default', // Đổi con trỏ khi kéo được
              transition: 'transform 0.2s',
            }}
            onLoad={() => {
              // Cập nhật vị trí khi ảnh tải xong
              const imgRect = imageRef?.current?.getBoundingClientRect();
              const containerRect = containerRef?.current?.getBoundingClientRect();
              const centerX = (containerRect.width - imgRect.width) / 2;
              const centerY = (containerRect.height - imgRect.height) / 2;
              setPosition({ x: centerX, y: centerY });
            }}
          />
        </div>
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
                Quản lý ảnh xét nghiệm (khối u, mô tuyến, ...)
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
                    accept='.jpg, .png, .svg'
                    type="file"
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
                        <FileIcon className="h-6 w-6 text-gray-400"/>
                        <span className="font-medium">{file.name.split('/').pop()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
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

              <Dialog open={showViewer} onOpenChange={setShowViewer}>
                <DialogContent className="max-w-5xl h-[90vh] p-0">
                  <ImageViewer viewerUrl={viewerUrl} onClose={() => setShowViewer(false)} />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default TissueImage;