import { useState } from "react";
import { useAuth } from "../useAuth";

export const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { signup } = useAuth();

  const handleSubmit = async () => {
    try {
      await signup(form);
      // navigate to verify page
    } catch (err) {
      toast.error('Signup failed');
    }
  };

  return (
    <>signup</>
  );
};
