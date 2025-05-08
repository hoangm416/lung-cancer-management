import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { LucidePlus, LucidePencil, LucideTrash } from 'lucide-react';
import ResearchForm from '@/forms/research-form/ResearchForm';
import EditResearchForm from '@/forms/research-form/EditResearchForm';
import ConfirmDialog from "@/components/ConfirmDialog";
import { useAddResearch, useEditResearch, useDeleteResearch } from '@/api/ResearchApi';
import { Research } from '@/types'; //no type -> erro

import research1 from "../assets/research1.png";
import research2 from "../assets/research2.png";
import research3 from "../assets/research3.png";

const toSlug = (title: string) => {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

const imageMap: Record<string, string> = {
  "research1.png": research1,
  "research2.png": research2,
  "research3.png": research3,
};

const categories = [
  { id: "popular", label: "Khoa học thường thức" },
  { id: "specialize", label: "Khoa học chuyên sâu" }
];

// interface ResearchItem {
//   _id: string;
//   submitter_id: string;
//   research_id: number;
//   type: string;
//   title: string;
//   description: string;
//   image: string;
//   detail: string;
//   date: string;
// }

const ResearchPage = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Research[]>([]);

  // State quản lý dialog và nghiên cứu được chọn
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedResearch, setSelectedResearch] = useState<Research | null>(null);
  
    // API hooks
    //const { isLoading } = useGetAllResearches();
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
            //alert('Xóa nghiên cứu thành công!');
            closeConfirmDialog();
          },
          onError: (error) => {
            console.error('Lỗi khi xóa nghiên cứu:', error);
            //alert('Xóa nghiên cứu thất bại!');
          },
        });
      }
    };


  const activeTab = type || "popular";

  useEffect(() => {
    axios
      .get<Research[]>("http://localhost:5000/api/research")
      .then((res) => {
        setArticles(res.data);
      })
      .catch((err) => {
        console.error("Error loading research:", err);
      });
  }, []);

  const filtered = articles.filter((item) => item.type === activeTab);

  return (
    <div>
      <div className="flex flex-row items-start justify-between gap-[28px] mb-4">
        <span className="text-2xl font-medium text-text">Danh sách bài báo nghiên cứu khoa học</span>
        <Button
          className="flex items-center gap-2 border font-normal"
          onClick={openAddDialog}
        >
          <LucidePlus className="inline-block h-4 w-4" />
          Thêm nghiên cứu
        </Button>
      </div>
      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => navigate(`/research/${cat.id}`)}
            className={`py-2 px-4 rounded-md font-medium ${
              activeTab === cat.id
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Articles */}
      <div className="space-y-4">
        {filtered.map((article) => (
          <div
            key={article._id}
            className="flex border rounded-lg shadow-md overflow-hidden cursor-pointer hover:bg-gray-100 transition duration-200"
            onClick={() => navigate(`/research/${article.type}/${toSlug(article.title)}`)}
          >
            <img
              src={
                article.image && imageMap[article.image]
                  ? imageMap[article.image]
                  : "https://via.placeholder.com/300x200.png?text=No+Image"
              }
              alt={article.title}
              className="w-1/3 h-48 object-cover"
            />
            <div className="p-4 w-2/3 flex flex-col justify-between">
              <div>
                <h1 className="text-lg font-semibold">{article.title}</h1>
                <p className="text-gray-500 text-sm">📅 {article.date}</p>
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

      {/* Dialog thêm nghiên cứu */}
      <ResearchForm
        isOpen={isAddDialogOpen}
        onClose={closeAddDialog}
        onSubmit={(data) => {
          addResearch(data, {
            onSuccess: () => {
              closeAddDialog();
            },
            onError: () => {
              alert('Thêm nghiên cứu thất bại!');
            },
          });
        }}
      />

      {/* Dialog chỉnh sửa nghiên cứu */}
      <EditResearchForm
        isOpen={isEditDialogOpen}
        onClose={closeEditDialog}
        defaultValues={selectedResearch ?? {} as Research}
        onSubmit={(data) => {
          editResearch(
            { _id: data._id, submitter_id: selectedResearch?.submitter_id, updatedResearch: data },
            {
              onSuccess: () => {
                // alert('Cập nhật nghiên cứu thành công!');
                closeEditDialog();
              },
              onError: (error) => {
                console.error('Lỗi khi cập nhật nghiên cứu:', error);
                // alert('Cập nhật nghiên cứu thất bại!');
              },
            }
          );
        }}
      />

      {/* ConfirmDialog xóa nghiên cứu */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        close={closeConfirmDialog}
        isLoading={isDeleting}
        handleSubmit={handleDelete}
        title="Xác nhận xóa"
        body={`Bạn có chắc chắn muốn xóa nghiên cứu: ${selectedResearch?._id}?`}
      />
      </div>
    </div>
  );
};

export default ResearchPage;
