import React, { useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../useAuth";
import { Listbox } from "@headlessui/react";
import { industries } from "../../../constants/industries.constants";

export const OrganizationSignup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    description: "",
    profileUrl: "",
    website: "",
    industry: "",
    location: "",
    phoneNumber: "",
    role: "organization",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [showOtp, setShowOtp] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const { signup, verifyOrganization, isLoading , signUpLoading, signupError } = useAuth();

  const validate = () => {
    const errs: typeof errors = {};

    // Name
    if (!form.name.trim()) {
      errs.name = "Organization name is required";
    }

    // Email
    if (!form.email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Invalid email format";
    }

    // Password
    if (!form.password) {
      errs.password = "Password is required";
    } else if (form.password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }

    // Confirm Password (assuming you have confirmPassword state)
    if (form.password !== confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }

    // Phone Number
    if (
      form.phoneNumber.trim() &&
      !/^[\d+\-() ]{7,15}$/.test(form.phoneNumber)
    ) {
      errs.phoneNumber = "Invalid phone number";
    }

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
      await signup({ ...form, role: "organization" });
      setShowOtp(true);
      toast.success("OTP sent to your email");
      startTimer();
    } catch (err: any) {
       toast.error(err.message);
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
      await verifyOrganization({ ...form, role: "organization" }, otp.join(""));
      toast.success("Organization account verified!");
      setForm({
        name: "",
        email: "",
        password: "",
        description: "",
        profileUrl: "",
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
      await signup({ ...form, role: "organization" });
      setTimer(60);
      setCanResend(false);
      startTimer();
      toast.success("OTP resent");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="w-full py-10 overflow-scroll h-full bg-[#f1f1f1]">
      <h2 className="text-4xl font-Poppins font-semibold text-black text-center">
        Organization Signup
      </h2>
      <p className="text-center text-lg font-medium py-3 text-[#00000099]">
        Home . Organization Signup
      </p>
      <div className="w-full flex justify-center">
        <div className="md:w-[480px] p-8 bg-white shadow rounded-lg">
          <h3 className="text-3xl font-semibold text-center mb-4">
            Create Organization
          </h3>
          <p className="text-center text-gray-500 mb-4">
            Already have an account?
            <Link to={"/org/login"} className="text-blue-500">
              Log in
            </Link>
          </p>
          {!showOtp ? (
            <form onSubmit={handleSubmit}>
              {/* Basic Fields */}
              {[
                { label: "Organization Name", key: "name" },
                { label: "Email", key: "email" },
                { label: "Website", key: "website" },
                { label: "Phone Number", key: "phoneNumber" },
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

              {/* Industry Dropdown */}
              <div className="mb-2">
                <label className="block mb-1">Industry</label>
                <Listbox
                  value={form.industry}
                  onChange={(value) => {
                    setForm({ ...form, industry: value });
                    setErrors((prev) => ({ ...prev, industry: "" }));
                  }}
                >
                  <div className="relative">
                    <Listbox.Button className="w-full border p-2 rounded bg-white text-left">
                      {form.industry || "Select industry"}
                    </Listbox.Button>
                    <Listbox.Options className="absolute z-10 w-full bg-white border mt-1 max-h-60 overflow-auto rounded">
                      {industries.map((industry) => (
                        <Listbox.Option
                          key={industry}
                          value={industry}
                          className={({ active }) =>
                            `px-4 py-2 cursor-pointer ${
                              active ? "bg-gray-100" : ""
                            }`
                          }
                        >
                          {industry}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Listbox>
                {errors.industry && (
                  <p className="text-red-500 text-sm">{errors.industry}</p>
                )}
              </div>

              {/* Password */}
              <label className="block mb-1">Password</label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  className="w-full p-2 border mb-2 rounded"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {!passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <label className="block mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  className="w-full p-2 border mb-2 rounded"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                disabled={signUpLoading}
              >
                {signUpLoading ? "Signing in..." : "Sign up"}
              </button>
            </form>
          ) : (
            <div>
              <h3 className="text-lg font-medium text-center mb-3">
                Enter OTP
              </h3>
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
