export const pricingList = [
    {
      title: "Monthly",
      price: 10,
      description: "Monthly plan with affordable price.",
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