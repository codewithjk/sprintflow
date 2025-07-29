import { PricingCard } from "../../../components/ui/cards/PriceCard";


export const PlansPage = () => {
  const pricingList = [
    {
      title: "Monthly",
      price: 10,
      description: "For larger teams with advanced features.",
      buttonText: "Buy Now",
      benefits: ["Unlimited Projects", "Team Assignments", "Video Meetings"],
      billing: "/month",
      href: "/signup",
      paymentLink: import.meta.env.VITE_STRIPE_MONTHLY_PLAN_LINK,
      popular: true,
    },
    {
      title: "Yearly",
      price: 99,
      description: "Yearly plan for large organizations.",
      buttonText: "Buy Now",
      benefits: ["Custom Workflows", "Dedicated Support", "Admin Control"],
      billing: "/year",
      href: "/signup",
      paymentLink: import.meta.env.VITE_STRIPE_YEARLY_PLAN_LINK,
      popular: false,
    },
  ];

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


