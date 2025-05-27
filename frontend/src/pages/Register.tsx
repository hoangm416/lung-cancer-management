import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'
import LungImage from '@/assets/lung-cancer.png' 
import { Label } from '@/components/ui/label'
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, UserIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCreateUser } from '@/api/UserApi'
// import { useNavigate } from 'react-router-dom'

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const { createUser, isLoading } = useCreateUser();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // gọi API đăng ký
      const data = await createUser({ name, email, password });
      console.log('Đăng ký thành công:', data); 
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      // lỗi đã được toast trong onError của useMutation
      console.error('Đăng ký thất bại:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Image */}
      <div className="w-full md:w-1/2 bg-blue-50 flex items-center justify-center p-6">
        <div className="relative max-w-md">
          <img
            src={LungImage}
            alt="Lung Cancer Awareness"
            className="rounded-lg shadow-md w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <Card className="w-full max-w-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Đăng ký</CardTitle>
            <CardDescription className="text-center text-base">Hệ thống quản lý và phân tích dữ liệu của bệnh ung thư phổi</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên người dùng</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <UserIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="name"
                    type="text"
                    placeholder="hoangvk"
                    className="pl-10"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <MailIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <LockIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    type={showPass ? "text" : "password"}
                    className="pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPass ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Đang xử lý" : "Đăng ký"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              Đã có tài khoản?{" "}
              <a href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Đăng nhập tại đây
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default Register;