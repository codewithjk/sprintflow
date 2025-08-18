import Navbar from "../../../components/ui/navbar";

export const BlockedPage = () => {
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL
  return (
    <>
      <Navbar />
      <section className="py-20 px-4 sm:px-8 lg:px-24 bg-white dark:bg-gray-900 transition-colors duration-300 min-h-screen flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Access <span className="text-red-600">Restricted</span>
        </h2>

        <p className="mt-4 text-gray-700 dark:text-gray-300 max-w-xl">
          Your account has been <span className="font-semibold text-red-500">blocked by an admin</span>. 
          To regain access, please contact the administrator.
        </p>

        <a
          href={`mailto:${adminEmail}`}
          className="mt-8 inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded transition-colors duration-200"
        >
          Contact Admin
        </a>
      </section>
    </>
  );
};
