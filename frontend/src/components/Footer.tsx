import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <div className="bg-white py-3 border-t-2 border-primary">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Logo and Links */}
        {/* <div className="space-y-4">
          <h1 className="text-3xl font-bold text-primary">LungTrack</h1>
          <div className="flex flex-col space-y-2 text-gray-700">
            <a href="about-us" className="hover:text-blue-600">Về LungTrack</a>
            <a href="about-us" className="hover:text-blue-600">Chính sách và điều khoản</a>
          </div>
        </div> */}

        {/* Contact Information */}
        <div className="space-y-4 text-gray-700">
          <p className="font-bold">Hotline: 1900232345</p>
          <p>Email: <a href="mailto:hotro@hustfood.com.vn" className="hover:text-blue-600">hoang.vk215584@sis.hust.edu.vn</a></p>
          {/* <a href="question" className="hover:text-blue-600">Câu hỏi thường gặp</a> */}
        </div>

        {/* Social Media Links */}
        <div className="space-y-4">
          <p className="font-bold">Kết nối với chúng tôi</p>
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:opacity-75"
            >
              <FaFacebook className="w-8 h-8 text-blue-600" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:opacity-75"
            >
              <FaInstagram className="w-8 h-8 text-pink-500" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="hover:opacity-75"
            >
              <FaYoutube className="w-8 h-8 text-red-500" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Footer;
