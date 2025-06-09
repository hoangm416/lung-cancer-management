import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { LucidePlus, LucidePencil, LucideTrash } from 'lucide-react';
import ResearchForm from '@/forms/research-form/ResearchForm';
import EditResearchForm from '@/forms/research-form/EditResearchForm';
import SearchResearchForm from '@/forms/research-form/SearchResearchForm';
import ConfirmDialog from "@/components/ConfirmDialog";
import { useAddResearch, useSearchResearch, useEditResearch, useDeleteResearch } from '@/api/ResearchApi';
import { Research } from '@/types';
import { toSlug } from '@/utils/toSlug';

// const toSlug = (title: string) => {
//   return title
//     .toLowerCase()
//     .normalize("NFD")
//     .replace(/[\u0300-\u036f]/g, "")
//     .replace(/đ/g, "d")
//     .replace(/[^a-z0-9\s-]/g, "")
//     .trim()
//     .replace(/\s+/g, "-");
// };

const SearchResearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [articles, setArticles] = useState<Research[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("detail") || "";

  // State quản lý dialog và nghiên cứu được chọn
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedResearch, setSelectedResearch] = useState<Research | null>(null);

  // API hooks
  const { researches, isLoading, isError, error } = useSearchResearch(searchQuery);
  const { mutate: addResearch } = useAddResearch();
  const { mutate: editResearch } = useEditResearch();
  const { mutate: deleteResearch, isLoading: isDeleting } = useDeleteResearch();

  // Hàm mở/đóng dialog thêm
  const openAddDialog = () => {
    setSelectedResearch(null);
    setIsAddDialogOpen(true);
  };

  const closeAddDialog = () => {
    setSelectedResearch(null);
    setIsAddDialogOpen(false);
  };

  // Hàm mở/đóng dialog chỉnh sửa
  const openEditDialog = (research: Research) => {
    setSelectedResearch(research);
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setSelectedResearch(null);
    setIsEditDialogOpen(false);
  };

  // Hàm mở/đóng ConfirmDialog
  const openConfirmDialog = (research: Research) => {
    setSelectedResearch(research);
    setIsConfirmOpen(true);
  };

  const closeConfirmDialog = () => {
    setSelectedResearch(null);
    setIsConfirmOpen(false);
  };

  // Hàm xử lý xóa nghiên cứu
  const handleDelete = () => {
    if (selectedResearch) {
      deleteResearch(selectedResearch._id, {
        onSuccess: () => {
          closeConfirmDialog();
        },
        onError: (error) => {
          console.error('Lỗi khi xóa nghiên cứu:', error);
        },
      });
    }
  };

  useEffect(() => {
    axios.get<Research[]>("http://localhost:5000/api/research")
      .then(res => setArticles(res.data))
      .catch(err => console.error("Lỗi khi tải bài viết:", err));
  }, []);

  const filtered = articles.filter((item) =>
    item.title.toLowerCase().includes(keyword.toLowerCase()) ||
    item.description.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-row items-start justify-between gap-[28px] mb-4">
        <span className="text-2xl font-medium text-text">Kết quả tìm kiếm cho: "{keyword}"</span>
        <Button
          className="flex items-center gap-2 border font-normal"
          onClick={openAddDialog}
        >
          <LucidePlus className="inline-block h-4 w-4" />
          Thêm nghiên cứu
        </Button>
      </div>
      <div className="mb-4">
        <SearchResearchForm
          query={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {filtered.length === 0 ? (
        <p className="text-gray-600">Không tìm thấy kết quả nào.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map(article => (
            <div
              key={article._id}
              className="flex border rounded-lg shadow-md overflow-hidden cursor-pointer hover:bg-gray-100 transition duration-200"
              onClick={() => navigate(`/research/${article.type}/${toSlug(article.title)}`)}
            >
              <img
                src={
                  article.image.startsWith("http")
                    ? article.image 
                    : "https://via.placeholder.com/300x200.png?text=No+Image"
                }
                alt={article.title}
                className="w-1/4 h-48 object-cover"
              />
              <div className="p-4 w-2/3 flex flex-col justify-between">
              <div>
                <h1 className="text-lg font-semibold">{article.title}</h1>
                <p className="text-gray-500 text-sm">
                  📅{new Date(article.date).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })}
                </p>
                <p className="text-gray-600">{article.description}</p>
              </div>
              <div className="mt-3 flex items-center gap-3">
                {/* Sửa nghiên cứu */}
                <div
                  className="flex items-center cursor-pointer text-blue-500 hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditDialog(article);
                  }}
                >
                  <LucidePencil className="h-5 w-5 mr-1" />
                  <span>Sửa nghiên cứu</span>
                </div>

                {/* Xóa nghiên cứu */}
                <div
                  className="flex items-center cursor-pointer text-red-500 hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    openConfirmDialog(article);
                  }}  
                >
                  <LucideTrash className="h-5 w-5 mr-1" />
                  <span>Xóa nghiên cứu</span>
                </div>
              </div>
            </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResearchPage;
