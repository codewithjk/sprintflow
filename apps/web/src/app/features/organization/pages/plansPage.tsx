import { PricingCard } from "../../../components/ui/cards/PriceCard";
import { pricingList } from "../../../constants/price-list.constants";


export const PlansPage = () => {
 

  return (
    <section className="py-20 px-4 sm:px-8 lg:px-24 bg-white dark:bg-gray-900 transition-colors duration-300">
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
        Get <span className="bg-gradient-to-r from-purple-500 to-indigo-600 text-transparent bg-clip-text uppercase">Unlimited</span> Access
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
        Our plans are built to grow with your team — simple, powerful, and priced for flexibility.
      </p>

      <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-2 gap-8">
        {pricingList.map((plan) => (
          <PricingCard key={plan.title} plan={plan} />
        ))}
      </div>
    </section>
  );
};


