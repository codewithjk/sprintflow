import { useState } from "react";
import { useAuth } from "../useAuth";

export const VerifyOtp = () => {
  const [form, setForm] = useState({ email: '', otp: '' });
  const { verifyOtp } = useAuth();

  const handleSubmit = async () => {
    try {
      await verifyOtp(form);
      // navigate to login
    } catch (err) {
      toast.error('Invalid OTP');
    }
  };

  return (
    <>verigy</>
  );
};
