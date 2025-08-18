import { useState, useEffect } from "react";
import { Camera, Moon, Sun, User } from "lucide-react";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { useAuth } from "../../auth/useAuth";
import { setIsDarkMode } from "../../../store/globalSlice";
import Header from "../../../components/ui/header";
import { toast } from "react-toastify";
import { useOrganizations } from "../useOrganization";
import Image from "../../../components/ui/images";
import { useFileUpload } from "../../../hooks/useFileUpload";

export const OrgSettingsPage = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { updateProfile } = useOrganizations();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const stripeCustomerPortalLink = import.meta.env
    .VITE_STRIPE_CUSTOMER_PORTAL_LINK;

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    description: "",
    phoneNumber: "",
    industry: "",
    location: "",
    profileUrl: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const {
    files,
    loading: fileUploadLoading,
    error: fileUploadError,
    uploadFile,
  } = useFileUpload();

  useEffect(() => {
    if (files.length > 0) {
      setPreviewImage(files[0].previewLink);
      profileData.profileUrl = files[0].previewLink;
    }
  }, [files]);

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      setProfileData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        description: user.description || "",
        phoneNumber: user.phoneNumber || "",
        industry: user.industry || "",
        location: user.location || "",
        profileUrl: user.profileUrl || "",
      }));
    }
  }, [user]);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!profileData.name) errs.name = "Name is required";
    if (!profileData.email || !/\S+@\S+\.\S+/.test(profileData.email))
      errs.email = "Valid email is required";
    if (
      profileData.phoneNumber &&
      !/^[\d+\-() ]{7,20}$/.test(profileData.phoneNumber)
    )
      errs.phoneNumber = "Invalid phone number";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSizeInMB = 5;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (file.size > maxSizeInBytes) {
      toast.error(`File size must be less than ${maxSizeInMB}MB`);
      return;
    }

    await uploadFile([file]);
  };

  const handleThemeToggle = () => {
    dispatch(setIsDarkMode(!isDarkMode));
  };

  const handleProfileSave = () => {
    if (!validate()) return;
    try {
      if (user)
        updateProfile({
          id: user?.id,
          data: profileData,
          role: "organization",
        });
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error(error);
      toast.error(error);
    }
  };

  return (
    <div className="flex w-full flex-col p-8 space-y-6 max-w-3xl text-gray-900 dark:text-gray-100 transition-colors">
      <Header name="Settings" />

      {/* Profile Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Profile</h2>

        {/* Profile Image Upload */}
        <div className="flex items-center gap-4">
          <label
            htmlFor="imageInput"
            className=" group relative top-0  w-20 h-20 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600"
          >
            {previewImage || profileData.profileUrl ? (
              <>
                <Image
                  src={previewImage || profileData.profileUrl}
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-slate-100 dark:text-white  opacity-70" />
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                <User className="w-8 h-8 text-gray-500" />
              </div>
            )}
          </label>
          <div>
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm file:text-sm file:border file:px-2 file:py-1 file:rounded file:cursor-pointer dark:file:bg-gray-800"
              disabled={fileUploadLoading}
              hidden
            />
            {fileUploadLoading && (
              <p className="text-xs text-gray-500">Uploading...</p>
            )}
            {fileUploadError && (
              <p className="text-xs text-red-500">{fileUploadError}</p>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Name", name: "name", value: profileData.name },
            { label: "Email", name: "email", value: profileData.email },
            {
              label: "Phone Number",
              name: "phoneNumber",
              value: profileData.phoneNumber,
            },
            {
              label: "Industry",
              name: "industry",
              value: profileData.industry,
            },
          ].map(({ label, name, value }) => (
            <div key={name}>
              <label className="block text-sm font-medium mb-1">{label}</label>
              <input
                name={name}
                value={value}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:border-gray-600"
              />
              {errors[name] && (
                <p className="text-xs text-red-500">{errors[name]}</p>
              )}
            </div>
          ))}

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              name="location"
              value={profileData.location}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:border-gray-600"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={profileData.description}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:border-gray-600"
              rows={3}
            />
          </div>
        </div>

        <button
          onClick={handleProfileSave}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Save Changes
        </button>
      </section>

      {/* Billing Section */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Billing</h2>
        <a
          className="inline-block px-4 py-2 border border-gray-400 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          href={`${stripeCustomerPortalLink}?prefilled_email=${user?.email}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to Stripe Billing Portal
        </a>
      </section>

      {/* Theme Toggle */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Theme</h2>
        <button
          onClick={handleThemeToggle}
          className="flex items-center gap-2 px-4 py-2 border rounded border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {isDarkMode ? <Sun /> : <Moon />}
          Toggle to {isDarkMode ? "Light" : "Dark"} Mode
        </button>
      </section>
    </div>
  );
};
