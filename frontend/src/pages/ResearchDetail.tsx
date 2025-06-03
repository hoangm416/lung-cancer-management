import { Button } from '@/components/ui/button';
import { LucideMoveLeft } from 'lucide-react';
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

interface ResearchItem {
  research_id: string;
  type: string;
  title: string;
  date: string;
  author: string;
  link: string;
  description: string;
  image: string;
  detail: string;
}

const ResearchDetail = () => {
  const { slug } = useParams<{ type: string; slug: string }>();
  const [data, setData] = useState<ResearchItem | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  

  useEffect(() => {
    axios.get<ResearchItem>(`http://localhost:5000/api/research/slug/${slug}`)
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setData(null);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="p-4">Đang tải...</div>;
  if (!data) return <div className="p-4 text-red-500">❌ Không tìm thấy bài nghiên cứu!</div>;

  return (
    <div className="p-6 max-w-screen mx-auto">
      <Button
        className="flex items-center gap-2 rounded-md leading-none"
        variant="ghost"
        size="default"
        onClick={() =>
          navigate(`/research/${data.type}`)
        }
      >
        <LucideMoveLeft className="h-6 w-8" />
        <span className="align-middle">Trở về</span>
      </Button>

      <h2 className="text-4xl font-bold mb-4">{data.title}</h2>
      <p className="text-sm text-gray-500 mb-4 text-right">
        📅{new Date(data.date).toLocaleDateString('vi-VN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })}
      </p>
      {/* {data.image && (
        <img
          src={`/images/${data.image}`}
          alt={data.title}
          className="w-full max-h-96 object-cover rounded-lg mb-4"
        />
      )} */}
      <p className="text-gray-700 whitespace-pre-line text-justify mt-6">{data.detail}</p>
      <p className="text-gray-700 whitespace-pre-line text-left mt-6">
        Đường dẫn tới bài viết gốc:{" "}
        <a
          href={data.link}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-blue-600 hover:text-blue-800"
        >
          {data.link}
        </a>
      </p>

      <p className="text-sm text-gray-700 font-bold mt-8 text-right">{data.author}</p>
    </div>
  );
};

export default ResearchDetail;
