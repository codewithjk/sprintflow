
import { Link } from "react-router-dom";
import Button from "../components/ui/buttons/Button";

export default function LandingPage() {
  return (
    <main className="bg-gray-950 text-white">
     

      {/* Navbar */}
      <header className="w-full border-b border-gray-800 p-4 sticky top-0 z-50 bg-gray-950">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">Sprint<span className="text-blue-500">Flow</span></h1>
          <nav className="hidden md:flex gap-6">
            <a href="#features" className="hover:text-blue-500">Features</a>
            <a href="#pricing" className="hover:text-blue-500">Pricing</a>
            <a href="#about" className="hover:text-blue-500">About</a>
            <a href="#contact" className="hover:text-blue-500">Contact</a>
          </nav>
          <div className="flex gap-2">
            <Link to="/login">
              <Button variant="outline" className="border-white text-white hover:border-blue-500 hover:text-blue-500">Login</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-blue-600 hover:bg-blue-700">Signup</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-6">
          Empower Your Team with <span className="text-blue-500">SprintFlow</span>
        </h2>
        <p className="max-w-2xl text-lg text-gray-400 mb-8">
          Seamless project tracking, real-time communication, and powerful team collaboration — all in one place.
        </p>
        <Link to="/signup">
          <Button className="bg-blue-600 hover:bg-blue-700">Get Started Free</Button>
        </Link>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6">Features</h3>
          <div className="grid md:grid-cols-3 gap-8 text-left mt-8">
            {[
              { title: "Project Management", desc: "Organize projects with tasks, modules, and members. Set priorities and track progress easily." },
              { title: "Real-Time Chat", desc: "Collaborate instantly with your team using our integrated group chat." },
              { title: "Video Meetings", desc: "Schedule and host meetings directly from your dashboard." },
              { title: "Role-Based Access", desc: "Secure access control to limit who can manage tasks, meetings, and users." },
              { title: "Email & OAuth", desc: "Signup with email, Google, or GitHub. Includes email verification." },
              { title: "Clean UI & Dark Mode", desc: "A modern interface that's easy to use and looks stunning in dark mode." },
            ].map((f, i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-6 shadow hover:shadow-lg transition">
                <h4 className="text-xl font-semibold mb-2">{f.title}</h4>
                <p className="text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6">Simple Pricing</h3>
          <p className="text-gray-400 mb-8">Start free. Upgrade when your team grows.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Free",
                price: "₹0",
                features: ["Up to 3 Projects", "10 Users", "Basic Chat"],
                highlight: false,
              },
              {
                name: "Pro",
                price: "₹499/mo",
                features: ["Unlimited Projects", "Unlimited Users", "Meetings + Chat", "Priority Support"],
                highlight: true,
              },
              {
                name: "Enterprise",
                price: "Contact Us",
                features: ["Custom Access", "Dedicated Server", "Onboarding Assistance"],
                highlight: false,
              },
            ].map((plan, idx) => (
              <div key={idx} className={`rounded-lg p-6 border ${plan.highlight ? "border-blue-500 bg-blue-900" : "border-gray-700 bg-gray-800"}`}>
                <h4 className="text-xl font-semibold mb-2">{plan.name}</h4>
                <p className="text-3xl font-bold mb-4">{plan.price}</p>
                <ul className="text-left text-gray-300 space-y-2 mb-6">
                  {plan.features.map((f, i) => (
                    <li key={i}>• {f}</li>
                  ))}
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Choose {plan.name}</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">About Us</h3>
          <p className="text-gray-400">
            SprintFlow was built by a passionate team of developers who believe that managing projects shouldn't be hard.
            Our mission is to help teams work better together with intuitive tools and powerful features.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">Contact Us</h3>
          <p className="text-gray-400 mb-6">
            Have questions or feedback? Reach out to us and we’ll get back to you within 24 hours.
          </p>
          <form className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <input type="text" placeholder="Your Name" className="p-3 rounded bg-gray-800 text-white" />
            <input type="email" placeholder="Your Email" className="p-3 rounded bg-gray-800 text-white" />
            <textarea rows={4} placeholder="Your Message" className="p-3 rounded bg-gray-800 text-white md:col-span-2"></textarea>
            <Button className="bg-blue-600 hover:bg-blue-700 md:col-span-2">Send Message</Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-center p-4 border-t border-gray-800 text-gray-500">
        © {new Date().getFullYear()} SprintFlow. All rights reserved.
      </footer>
    </main>
  );
}
