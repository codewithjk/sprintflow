import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../useAuth";
import { useEffect } from "react";

function InviteHandlingPage() {
  const { token } = useParams();
  const { isLoading, verifyInvitation, invitation, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      verifyInvitation(token);
    }
  }, [token]);

  useEffect(() => {
    if (invitation) {
      navigate("/register", { replace: true });
    }
  }, [invitation, navigate]);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className=" h-full w-full bg-gray-100 p-8 dark:bg-dark-primary">
      <div className="grid grid-cols-1">
        <div className="rounded-lg bg-white p-6 shadow dark:bg-dark-secondary text-center">
          {isLoading && (
            <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
              Verifying invitation...
            </p>
          )}

          {error && (
            <>
              <h3 className="mb-2 text-xl font-semibold text-red-600 dark:text-red-400">
                Invitation Error
              </h3>
              <p className="mb-4 text-gray-700 dark:text-gray-300">{error}</p>
              <button
                onClick={handleGoBack}
                className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
              >
                Go Back
              </button>
            </>
          )}

          {!isLoading && !error && (
            <p className="text-gray-700 dark:text-gray-300">
              Processing invitation...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default InviteHandlingPage;
