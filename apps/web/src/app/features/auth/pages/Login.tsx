import { useState } from "react";
import { useAuth } from "../useAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import GoogleSignInButton from "../../../components/ui/buttons/GoogleSignInButton";
import { toast } from "react-toastify";



export const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' ,role:"user" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  

  const { user,login, isLoading } = useAuth ();

  //routing 
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/home";

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!form.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await login(form, "user");
      toast.success("Login successful");
      navigate("/home", { replace: true });
    } catch(error :any) {
      toast.error(error?.response?.data?.message || "Login failed");
    }
  };
  return (
   <div className="w-full py-10 min-h-[85vh] bg-[#f1f1f1]">
      <h1 className="text-4xl font-Poppins font-semibold text-black text-center">
        Login
      </h1>
      <p className="text-center text-lg font-medium py-3 text-[#00000099]">
        Home . Login
      </p>
      <div className="w-full flex justify-center">
        <div className="md:w-[480px] p-8 bg-white shadow rounded-lg">
          <h3 className="text-3xl font-semibold text-center mb-2">
            Login to Sprint Flow
          </h3>
          <p className="text-center text-gray-500 mb-4">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-500">
              Sign up
            </Link>
          </p>
          <GoogleSignInButton/>
          <div className="flex items-center my-5 text-gray-400 text-sm">
            <div className="flex-1 border-t border-gray-300" />
            <span className="px-3">or sign in with email</span>
            <div className="flex-1 border-t border-gray-300" />
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email input */}
            <label htmlFor="user-email" className="block text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="user-email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
              className="w-full p-2 border border-black outline-0 rounded mb-1"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}

            {/* Password input */}
            <label htmlFor="user-password" className="block text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={passwordVisible ? 'text' : 'password'}
                id="user-password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="min 6 characters"
                className="w-full p-2 border border-black outline-0 rounded mb-1"
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400"
              >
                {passwordVisible ? <Eye /> : <EyeOff />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}

            {/* Forgot Password */}
            <div className="flex justify-between items-center my-4">
              <Link to="/forgot-password" className="text-blue-500 text-sm">
                Forgot Password?
              </Link>
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full text-lg bg-black text-white py-2 rounded-lg"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
