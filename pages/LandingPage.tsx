

import React, { useState } from 'react';
import LoginPage from './LoginPage';

const Feature: React.FC<{ icon: React.ReactElement; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="bg-brand-light-card dark:bg-brand-navy p-6 rounded-lg border border-brand-light-border dark:border-brand-gray/50 text-center transform hover:-translate-y-2 transition-transform duration-300">
    <div className="flex justify-center mb-4 text-brand-red">{icon}</div>
    <h3 className="text-xl font-bold text-brand-light-text dark:text-white mb-2">{title}</h3>
    <p className="text-brand-light-gray dark:text-gray-400 text-sm">{children}</p>
  </div>
);

const PricingCard: React.FC<{
  plan: string;
  price: string;
  description: string;
  features: string[];
  isFeatured?: boolean;
  ctaLink: string;
}> = ({ plan, price, description, features, isFeatured, ctaLink }) => {
  return (
    <div className={`border rounded-lg p-8 flex flex-col ${isFeatured ? 'border-brand-red scale-105 bg-brand-navy' : 'border-brand-light-border dark:border-brand-gray bg-brand-light-card dark:bg-brand-navy'}`}>
      <h3 className={`text-2xl font-bold ${isFeatured ? 'text-white' : 'text-brand-light-text dark:text-white'}`}>{plan}</h3>
      <p className={`mt-2 ${isFeatured ? 'text-gray-300' : 'text-brand-light-gray dark:text-gray-400'}`}>{description}</p>
      <div className="mt-6">
        <span className={`text-5xl font-black tracking-tight ${isFeatured ? 'text-white' : 'text-brand-light-text dark:text-white'}`}>${price}</span>
        <span className={` ${isFeatured ? 'text-gray-300' : 'text-brand-light-gray dark:text-gray-400'}`}>/ month</span>
      </div>
      <ul className={`mt-8 space-y-4 text-sm flex-grow ${isFeatured ? 'text-gray-300' : 'text-brand-light-gray dark:text-gray-300'}`}>
        {features.map(feature => (
          <li key={feature} className="flex items-start">
            <svg className="w-5 h-5 text-brand-lime mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <a href={ctaLink} target="_blank" rel="noopener noreferrer" className={`mt-8 block text-center font-bold py-3 px-4 rounded-lg transition-colors ${isFeatured ? 'bg-brand-lime text-brand-ink hover:bg-green-400' : 'bg-brand-blue text-white hover:bg-blue-700'}`}>
        Get Started
      </a>
    </div>
  );
};


const LandingPage: React.FC = () => {
    const [showLogin, setShowLogin] = useState(false);
    
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href')?.substring(1);
        if (targetId) {
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

  return (
    <>
    {showLogin && <LoginPage onClose={() => setShowLogin(false)} />}
    <div className="bg-brand-light-bg dark:bg-brand-ink text-brand-light-text dark:text-gray-300 font-sans">
      {/* Header */}
      <header className="sticky top-0 bg-brand-light-card/80 dark:bg-brand-navy/80 backdrop-blur-lg border-b border-brand-light-border dark:border-brand-gray z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-black tracking-tighter text-brand-light-text dark:text-white uppercase">
              TRUE<span className="text-brand-red">X</span>PANSE
            </h1>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" onClick={handleNavClick} className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-brand-red">Features</a>
              <a href="#pricing" onClick={handleNavClick} className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-brand-red">Pricing</a>
            </nav>
            <button onClick={() => setShowLogin(true)} className="bg-brand-blue text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700 transition text-sm">
                Login / Sign Up
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section
          className="relative text-center py-24 sm:py-40 px-4 bg-cover bg-center bg-no-repeat border-b border-brand-light-border dark:border-brand-gray"
          style={{ backgroundImage: `url('https://storage.googleapis.com/aistudio-hosting/images/superhero-mat.jpg')` }}
        >
          <div className="absolute inset-0 bg-brand-ink bg-opacity-70"></div>
          <div className="relative z-10">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-white uppercase" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
              STOP GUESSING. START DOMINATING.
            </h1>
            <p className="max-w-3xl mx-auto mt-4 text-lg text-gray-200 font-semibold tracking-wide">
              Harness world-class KPIs, unbreakable accountability, and AI-powered strategy to turn massive action into predictable revenue. This is your command center.
            </p>
            <div className="mt-8">
              <a href="#pricing" onClick={handleNavClick} className="bg-brand-red text-white font-bold py-4 px-8 rounded-lg hover:bg-red-700 transition-transform transform hover:scale-105 inline-block shadow-lg">
                Choose Your Plan
              </a>
            </div>
          </div>
        </section>


        {/* Features Section */}
        <section id="features" className="py-20 sm:py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-brand-light-text dark:text-white mb-12">The Command Center for Your Ambition</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Feature title="Clarity Through Action" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}>
                Log every call, every meeting, every win. Build unstoppable momentum with a system that translates daily grind into measurable progress.
              </Feature>
              <Feature title="Data-Driven Dominance" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}>
                 Stop flying blind. Your revenue, pipeline, and conversion rates are monitored in real-time on a dashboard that turns critical KPIs into winning decisions.
              </Feature>
              <Feature title="Your AI Strategy Partner" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}>
                Generate powerful sales scripts, overcome objections with smart talking points, and get daily challenges that push you beyond your limits.
              </Feature>
               <Feature title="Scale Your Success" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}>
                 From a solo powerhouse to a growing team, MAT scales with you. Onboard new reps, monitor team performance, and build a consistent culture of winning.
              </Feature>
            </div>
          </div>
        </section>


        {/* Pricing Section */}
        <section id="pricing" className="py-20 sm:py-24 px-4 bg-brand-light-bg dark:bg-brand-ink">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-light-text dark:text-white">An Unfair Advantage is Priceless.</h2>
            <p className="mt-4 text-brand-light-gray dark:text-gray-400">Invest in the system that pays for itself. Choose your plan.</p>
          </div>
          <div className="max-w-7xl mx-auto mt-16 grid lg:grid-cols-3 gap-8">
            <PricingCard
              plan="Pro"
              price="97"
              description="For the driven individual committed to peak performance."
              features={[
                'Full Daily Action Tracking',
                'Personal KPI Dashboards',
                'AI Coaching & Content Generation',
                'Hot Lead Management',
                'Revenue & Client Tracking',
                'Daily AI Challenges'
              ]}
              ctaLink="https://buy.stripe.com/test_1"
            />
            <PricingCard
              plan="Elite"
              price="247"
              description="For serious business builders and small teams."
              features={[
                'Includes up to 5 users',
                'All Pro features, plus:',
                'Team Control Panel',
                'Team Performance Dashboards',
                'Advanced KPI Analytics',
                'Priority Support'
              ]}
              isFeatured={true}
              ctaLink="https://buy.stripe.com/test_2"
            />
            <PricingCard
              plan="Dominion"
              price="497"
              description="For leaders building an empire."
              features={[
                'Includes up to 15 users',
                'All Elite features, plus:',
                'AI Revenue Analysis',
                'AI Performance Evaluations',
                'Dedicated Account Manager',
                'API Access (Coming Soon)'
              ]}
              ctaLink="https://buy.stripe.com/test_3"
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-brand-light-card dark:bg-brand-navy border-t border-brand-light-border dark:border-brand-gray">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">&copy; {new Date().getFullYear()} TRUE<span className="text-brand-red">X</span>PANSE. All rights reserved. Take massive action.</p>
        </div>
      </footer>
    </div>
    </>
  );
};

export default LandingPage;
