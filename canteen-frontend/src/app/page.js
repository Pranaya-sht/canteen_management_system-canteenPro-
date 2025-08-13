'use client';
import React, { useState } from "react";
import './globals.css'
import { useRouter } from "next/navigation";

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm shadow-sm py-4 px-6 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          </div>
          <span className="text-xl font-bold text-indigo-900">CanteenPro</span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-indigo-800 font-medium hover:text-indigo-600 transition">Home</a>
          <a href="#features" className="text-indigo-800 font-medium hover:text-indigo-600 transition">Features</a>
          <a href="#about" className="text-indigo-800 font-medium hover:text-indigo-600 transition">About</a>
          <a href="#contact" className="text-indigo-800 font-medium hover:text-indigo-600 transition">Contact</a>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative inline-block">
            {/* Main Button */}
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="hidden md:inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-medium shadow-md"
            >
              Get Started
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => router.push("/register")}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Register
                </button>
                <button
                  onClick={() => router.push("/login")}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Login
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((s) => !s)}
            className="md:hidden p-2 rounded-md bg-white/60 hover:bg-white/75"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 shadow-md py-4 px-6">
          <div className="flex flex-col space-y-3">
            <a href="#" className="text-indigo-800 font-medium">Home</a>
            <a href="#features" className="text-indigo-800 font-medium">Features</a>
            <a href="#about" className="text-indigo-800 font-medium">About</a>
            <a href="#contact" className="text-indigo-800 font-medium">Contact</a>
            <div className="pt-2">
              <a href="/student" className="block text-center bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium shadow-md">Student Portal</a>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <header className="container mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-900 leading-tight mb-4">
            Revolutionize Your Campus <span className="text-indigo-600">Dining Experience</span>
          </h1>

          <p className="text-lg text-gray-700 mb-8 max-w-xl">
            CanteenPro streamlines canteen operations, speeds up service, and helps managers reduce waste with real-time insights.
            Pre-order, pay cashless, and collect — all in a few taps.
          </p>

          <div className="flex flex-wrap gap-4">
            <a href="/student" className="inline-flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:bg-indigo-700 transition transform hover:-translate-y-1">
              Student Portal
            </a>


          </div>

          <ul className="mt-8 flex flex-wrap gap-4 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Trusted</span>
              <span>Used by 200+ campuses</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Eco</span>
              <span>Reduce food waste by smart analytics</span>
            </li>
          </ul>
        </div>

        <div className="md:w-1/2 flex justify-center relative">
          {/* decorative animated blobs */}
          <div className="absolute -top-6 -left-6 w-44 h-44 rounded-full bg-indigo-600 opacity-10 animate-blob blob-delay-0" />
          <div className="absolute -bottom-6 -right-6 w-36 h-36 rounded-full bg-indigo-400 opacity-20 animate-blob blob-delay-2000" />

          {/* Card mockup */}
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
            <div className="flex items-center mb-6">
              <div className="bg-indigo-50 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="ml-4 font-bold text-xl text-gray-800">Today's Special</h3>
            </div>

            <div className="space-y-4">

              <MenuItem
                name="Veggie Delight"
                desc="Fresh vegetables with signature sauce"
                price={120}
                tag="Bestseller"
                tagColor="green"
                image="/images/veggie-delight.jpg"
              />


              <MenuItem
                name="Chicken Supreme"
                desc="Grilled chicken with herbs and spices"
                price={180}
                tag="New"
                tagColor="yellow"
                image="/images/chicken-supreme.png"
              />

              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-indigo-800">Order now to get 15% off!</span>
                  <button className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-full">Use code: FRESH15</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">Why Choose CanteenPro?</h2>
            <p className="text-gray-600 text-lg">A complete platform for modern campus dining experiences.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard title="Cashless Payments" desc="Secure and convenient digital payment options for a seamless dining experience." />
            <FeatureCard title="Real-time Tracking" desc="Monitor orders, inventory, and sales in real-time for efficient management." />
            <FeatureCard title="Detailed Analytics" desc="Gain insights into sales patterns, popular items, and customer preferences." />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">What Our Users Say</h2>
            <p className="text-gray-600">Hear from students and managers who transformed their campus dining experience.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Testimonial name="Nischal Shakya" role="Student, prime collage" text={`"CanteenPro has completely changed how I order food on campus. I can pre-order during lectures and just pick up my food without waiting in line."`} image="/images/nischal.jpg" />
            <Testimonial name="Nischal Shakya" role="Canteen Manager, prime collage" text={`"The analytics dashboard has helped us reduce food waste by 30% and increase sales by optimizing our menu."`} image="/images/nischal.jpg" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-blue-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Transform Your Campus Dining?</h2>
          <p className="text-indigo-100 text-lg max-w-2xl mx-auto mb-8">Join hundreds of institutions that have revolutionized their canteen management with CanteenPro.</p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/student" className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-bold shadow-lg hover:bg-indigo-50 transition">Student Portal</a>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-xl font-bold mb-4">CanteenPro</h3>
              <p className="mb-4">Revolutionizing campus dining experiences with innovative technology solutions.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">(fb)</a>
                <a href="#" className="text-gray-400 hover:text-white">(tw)</a>
                <a href="#" className="text-gray-400 hover:text-white">(ig)</a>
              </div>
            </div>

            <div>
              <h4 className="text-white text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition">Home</a></li>
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Testimonials</a></li>
                <li><a href="#contact" className="hover:text-white transition">Contact Us</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition">Support Center</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white text-lg font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start"><span className="mr-2">📍</span>123 Campus Road, Education City</li>
                <li className="flex items-center"><span className="mr-2">📞</span>+91 98765 43210</li>
                <li className="flex items-center"><span className="mr-2">✉️</span>info@canteenpro.com</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
            <p>© {new Date().getFullYear()} CanteenPro. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Inline styles for blob animation (keeps everything in one file) */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite ease-in-out; }
        .blob-delay-0 { animation-delay: 0s; }
        .blob-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
}

function MenuItem({ name, desc, price, tag, tagColor, image }) {
  const tagBg =
    tagColor === "green"
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";

  return (
    <div className="flex items-start">
      {image ? (
        <img
          src={image}
          alt={name}
          className="w-16 h-16 rounded-xl object-cover border-2 border-gray-200"
        />
      ) : (
        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex-shrink-0" />
      )}

      <div className="ml-4">
        <h4 className="font-bold text-gray-800">{name}</h4>
        <p className="text-gray-600 text-sm">{desc}</p>
        <div className="flex items-center mt-1">
          <span className="text-indigo-600 font-bold">₹{price}</span>
          {tag && (
            <span
              className={`ml-2 text-xs px-2 py-1 rounded-full ${tagBg}`}
            >
              {tag}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}




function FeatureCard({ title, desc }) {
  return (
    <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl p-8 shadow-lg border border-indigo-100">
      <div className="bg-indigo-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}

function Testimonial({ name, role, text, image }) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <div className="flex items-center mb-6">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-16 h-16 rounded-xl object-cover border-2 border-gray-200"
          />
        ) : (
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
        )}

        <div className="ml-4">
          <h4 className="font-bold text-gray-800">{name}</h4>
          <p className="text-indigo-600">{role}</p>
        </div>
      </div>

      <p className="text-gray-600 italic mb-4">{text}</p>

      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    </div>
  );
}



