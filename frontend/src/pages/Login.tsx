import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'
import LungImage from '@/assets/lung-cancer.png' 
import { Label } from '@/components/ui/label'
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { useLoginUser } from '@/api/UserApi'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();

  const { loginUser } = useLoginUser();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const data = await loginUser({ email, password });
      if (data?.token) {
        const storage = rememberMe ? localStorage : sessionStorage
        storage.setItem("token", data.token)
        storage.setItem("email", data.user.email)
        // Điều hướng ngay khi login thành công:
        navigate("/")
      }
    } catch (err) {
      console.error('Đăng nhập thất bại:', err);
    } finally {
      setIsLoading(false)
    }
  }

  // const handleRememberMeChange = () => {
  //   setRememberMe(!rememberMe);
  // }

  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Image */}
      <div className="w-full md:w-1/2 bg-blue-50 flex items-center justify-center p-6">
        <div className="relative max-w-md">
          <img
            src={LungImage}
            alt="Lung Cancer Awareness"
            className="rounded-lg shadow-md w-full h-full object-cover"
          />
          {/* <div className="absolute bottom-4 left-4 bg-white/80 p-3 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-blue-800">Lung Cancer Awareness</h2>
            <p className="text-sm text-gray-700">Early detection saves lives</p>
          </div> */}
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <Card className="w-full max-w-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Đăng nhập</CardTitle>
            <CardDescription className="text-center text-base">Hệ thống quản lý và phân tích dữ liệu của bệnh ung thư phổi</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mật khẩu</Label>
                  {/* <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                    Forgot password?
                  </a> */}
                </div>
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
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(val) => {
                    // val có thể là true | false | "indeterminate"
                    setRememberMe(val === true)
                  }}
                />
                <Label htmlFor="remember" className="text-sm font-medium leading-none">
                  Nhớ mật khẩu
                </Label>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Đang xử lý" : "Đăng nhập"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              Chưa có tài khoản?{" "}
              <a href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                Đăng ký ngay
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}

export default Login;