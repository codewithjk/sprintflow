import React, { useRef, useState } from "react";
import { useAuth } from "../useAuth";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import GoogleSignInButton from "../../../components/ui/buttons/GoogleSignInButton";
import { Link, useNavigate } from "react-router-dom";
import { OrganizationSelector } from "../../../components/ui/inputs/OrganizationSelector";

export const UserRegistrationPage = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [showOtp, setShowOtp] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  //todo : pass orgId with form data, get it from redux state

  const [selectedOrgId, setSelectedOrgId] = useState("");

  const { signup, verifyOtp, invitation, } = useAuth();
  console.log(invitation)
if(!invitation)return <> no invitation</>

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
  //   if (!form.orgId) {
  //   newErrors.orgId = "Please select an organization";
  // }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await signup({...form,role:"user"});
      setShowOtp(true);
      setCanResend(false);
      setTimer(60);
      startTimer();
      toast.success("OTP sent to your email");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Registration failed");
    }
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await verifyOtp({ ...form, otp: otp.join(""),orgId:invitation?.orgId });
      toast.success("Account verified!");

      setForm({ name: "", email: "", password: "" });
      navigate('/login', { replace: true });
      
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "OTP verification failed");
      setOtp(["", "", "", ""]);
    }
  };

  const handleResendOtp = async () => {
    try {
      await signup({...form,role:"user"});
      setTimer(60);
      setCanResend(false);
      startTimer();
      toast.success("OTP resent");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="w-full py-10 min-h-[85vh] bg-[#f1f1f1]">
      <h2 className="text-4xl font-Poppins font-semibold text-black text-center ">Registration</h2>
      <p className="text-center text-lg font-medium py-3 text-[#00000099]">
          Home . Register
      </p>
      <div className="w-full flex justify-center">
        <div className="md:w-[480px] p-8 bg-white shadow rounded-lg">
          <h3 className="text-3xl font-semibold text-center md-2">
              Register with SprintFlow
            </h3>
            {/* <p className="text-center text-gray-500 mb-4">
              Already have an account?
              <Link to={"/login"} className="text-blue-500">
                Log in
              </Link>
            </p> */}
            {/* <GoogleSignInButton /> */}
            {/* <div className="flex items-center my-5 text-gray-400 text-sm">
              <div className="flex-1 border-t border-gray-300" />
              <span className="px-3">or sign up with email</span>
              <div className="flex-1 border-t border-gray-300" />
          </div> */}
           {!showOtp ? (
        <form onSubmit={handleFormSubmit}>
          <label className="block mb-1">Name</label>
          <input
            className="w-full p-2 border mb-2 rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <label className="block mb-1">Email</label>
          <input
            className="w-full p-2 border mb-2 rounded"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <label className="block mb-1">Password</label>
          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              className="w-full p-2 border mb-2 rounded"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {!passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
              )}
              
      {/* <label className="block mb-1">Organization</label>
              <OrganizationSelector
  value={selectedOrgId}
  onChange={(id) => {
    setSelectedOrgId(id);
   setForm({...form,orgId:id}) // update form state
  }}
/>
{errors.orgId && (
  <p className="text-red-500 text-sm mt-1">{errors.orgId}</p>
)} */}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded mt-3"
          >
            Register
              </button>

        </form>
      ) : (
        <div>
          <h3 className="text-lg font-medium text-center mb-3">Enter OTP</h3>
          <div className="flex justify-center gap-3 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el }}
                maxLength={1}
                className="w-10 h-10 text-center border rounded"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
              />
            ))}
          </div>
          <button
            onClick={handleVerifyOtp}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Verify OTP
          </button>
          <p className="text-center text-sm mt-3">
            {canResend ? (
              <button
                onClick={handleResendOtp}
                className="text-blue-500 underline"
              >
                Resend OTP
              </button>
            ) : (
              `Resend OTP in ${timer}s`
            )}
                </p>
                
        </div>
      )}
        </div>
       </div>
      
    </div>
  );
};
