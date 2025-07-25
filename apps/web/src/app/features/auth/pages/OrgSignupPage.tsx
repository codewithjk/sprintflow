import React, { useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../useAuth";

export const OrganizationSignup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    description: "",
    logoUrl: "",
    website: "",
    industry: "",
    location: "",
    phoneNumber: "",
    role: 'organization',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [showOtp, setShowOtp] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const { signup ,verifyOrganization } = useAuth();

  const validate = () => {
    const errs: typeof errors = {};
    if (!form.name) errs.name = "Organization name is required";
    if (!form.email) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Invalid email format";
    }
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "Min 6 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await signup(form);
      setShowOtp(true);
      toast.success("OTP sent to your email");
      startTimer();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Signup failed");
    }
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
      await verifyOrganization(form, otp.join(""));
      toast.success("Organization account verified!");
      setForm({
        name: "",
        email: "",
        password: "",
        description: "",
        logoUrl: "",
        website: "",
        industry: "",
        location: "",
        phoneNumber: "",
        role: "organization",
      });
      navigate("/org/login");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "OTP verification failed");
      setOtp(["", "", "", ""]);
    }
  };

  const handleResendOtp = async () => {
    try {
      await signup(form);
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
      <h2 className="text-4xl font-Poppins font-semibold text-black text-center">Organization Signup</h2>
      <p className="text-center text-lg font-medium py-3 text-[#00000099]">
        Home . Organization Signup
      </p>
      <div className="w-full flex justify-center">
        <div className="md:w-[480px] p-8 bg-white shadow rounded-lg">
          <h3 className="text-3xl font-semibold text-center mb-4">Create Organization</h3>

          {!showOtp ? (
            <form onSubmit={handleSubmit}>
              {/* Basic Fields */}
              {[
                { label: "Organization Name", key: "name" },
                { label: "Email", key: "email" },
                { label: "Website", key: "website" },
                { label: "Phone Number", key: "phoneNumber" },
                { label: "Industry", key: "industry" },
                { label: "Location", key: "location" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block mb-1">{label}</label>
                  <input
                    className="w-full p-2 border mb-2 rounded"
                    value={form[key as keyof typeof form]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                  />
                  {errors[key] && (
                    <p className="text-red-500 text-sm">{errors[key]}</p>
                  )}
                </div>
              ))}

              {/* Password */}
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

              {/* Description */}
              <label className="block mb-1">Description</label>
              <textarea
                className="w-full p-2 border mb-2 rounded"
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded mt-2"
              >
                Signup
              </button>
            </form>
          ) : (
            <div>
              <h3 className="text-lg font-medium text-center mb-3">Enter OTP</h3>
              <div className="flex justify-center gap-3 mb-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
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
