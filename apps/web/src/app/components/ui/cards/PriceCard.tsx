
import { CheckIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../features/auth/useAuth";



export const PricingCard = ({ plan }) => {
  const { user } = useAuth();
  return (
    <div
      className={`rounded-lg border p-6 shadow-md transition duration-300 ${
        plan.popular
          ? "border-purple-500 bg-purple-50 dark:bg-purple-950 dark:border-purple-400"
          : "border-gray-200 dark:border-gray-700 dark:bg-gray-800"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{plan.title}</h3>
        {plan.popular && (
          <span className="text-sm px-2 py-1 bg-purple-600 text-white rounded-full">
            Most Popular
          </span>
        )}
      </div>
      <div className="text-3xl font-bold text-gray-900 dark:text-white">
        ${plan.price}
        <span className="text-base font-normal text-gray-600 dark:text-gray-300">
          {plan.billing}
        </span>
      </div>
      <p className="mt-2 text-gray-600 dark:text-gray-300">{plan.description}</p>

      <div className="mt-4">
         <Link
      to={plan.paymentLink+`?prefilled_email=${user?.email}&orgId=${user?.id}`}
      target="_blank"
      className="block w-full text-center py-2 px-4 rounded bg-purple-600 hover:bg-purple-700 text-white font-medium transition"
    >
      {plan.buttonText}
    </Link>
      </div>

      <ul className="mt-6 space-y-3 text-sm text-gray-700 dark:text-gray-200">
        {plan.benefits.map((benefit) => (
          <li key={benefit} className="flex items-center">
            <CheckIcon className="text-purple-500 mr-2" fontSize="small" />
            {benefit}
          </li>
        ))}
      </ul>
    </div>
  );
};


