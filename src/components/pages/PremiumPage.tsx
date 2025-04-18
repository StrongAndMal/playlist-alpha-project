import React, { useState } from 'react';
import { 
  ChartBarIcon, 
  CogIcon, 
  CreditCardIcon, 
  SparklesIcon, 
  DevicePhoneMobileIcon, 
  GlobeAltIcon, 
  BoltIcon, 
  ScaleIcon, 
  MagnifyingGlassIcon, 
  ShieldCheckIcon, 
  Squares2X2Icon, 
  BookmarkIcon, 
  FingerPrintIcon, 
  CursorArrowRippleIcon,
  StarIcon,
  MusicalNoteIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import FlippableCard from '../common/FlippableCard';
import { hasUserPremium, isUserAdmin } from '../../services/PopupService';

const premiumFeatures = [
  {
    name: 'Advanced Analytics',
    description: 'Get detailed insights on playlist metrics, listening patterns, and musical preferences',
    icon: ChartBarIcon,
    gradient: 'from-purple-500 to-indigo-600',
  },
  {
    name: 'Smart Filtering',
    description: 'Use powerful filters to discover exactly the playlists that match your specific musical criteria',
    icon: CogIcon,
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    name: 'Deep Playlist Analysis',
    description: 'Dive into comprehensive analysis of playlist moods, genre distribution, and audio features',
    icon: MusicalNoteIcon,
    gradient: 'from-rose-500 to-pink-600',
  },
  {
    name: 'Premium Badges',
    description: 'Showcase your premium status with exclusive badges that highlight your membership longevity',
    icon: StarIcon,
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    name: 'Unlimited Saves',
    description: 'Save unlimited playlists and tracks to your collection for easy access anytime',
    icon: BookmarkIcon,
    gradient: 'from-emerald-500 to-green-600',
  },
  {
    name: 'Spotify Integration',
    description: 'Export your discoveries directly to Spotify with just one click',
    icon: MusicalNoteIcon,
    gradient: 'from-red-500 to-pink-600',
  },
];

const interactiveFeatures = [
  {
    name: 'Enhanced Hover Preview',
    description: 'Hover over any song or playlist to instantly see detailed information and audio feature metrics',
    icon: CursorArrowRippleIcon,
    gradient: 'from-indigo-500 to-blue-600',
  },
  {
    name: 'Deep-Dive Discovery',
    description: 'Find similar playlists, explore listener comments, and uncover musical connections through advanced algorithms',
    icon: MagnifyingGlassIcon,
    gradient: 'from-pink-500 to-purple-600',
  },
  {
    name: 'Profile Collection',
    description: 'All your saved items are stored in your profile for easy access across devices',
    icon: UserGroupIcon,
    gradient: 'from-amber-500 to-yellow-600',
  },
  {
    name: 'Cross-Platform Experience',
    description: 'Seamless experience across web and mobile with synchronized collections',
    icon: DevicePhoneMobileIcon,
    gradient: 'from-green-500 to-teal-600',
  },
];

const freeFeatures = [
  {
    name: 'Basic Playlist Discovery',
    description: 'Explore curated playlists with limited filtering options',
    icon: GlobeAltIcon,
  },
  {
    name: 'Standard Search',
    description: 'Search playlists by simple criteria like genre or mood',
    icon: MagnifyingGlassIcon,
  },
  {
    name: 'Limited Saves',
    description: 'Save up to 10 playlists to your collection',
    icon: BookmarkIcon,
  },
  {
    name: 'Basic Playlist Info',
    description: 'View basic information about playlists and tracks',
    icon: MusicalNoteIcon,
  },
];

// FAQ data
const faqs = [
  {
    question: "What's the difference between free and premium membership?",
    answer: "Free membership gives you basic access to discover playlists with limited filtering options. Premium unlocks advanced analytics, unlimited saves, detailed audio feature analysis, premium badges, and the ability to export directly to Spotify."
  },
  {
    question: "Can I export playlists to Spotify?",
    answer: "Yes, premium members can export discoveries directly to their Spotify account with just one click. This makes it easy to save and listen to playlists you find through our platform."
  },
  {
    question: "How does the hover preview feature work?",
    answer: "Premium members can hover over any song or playlist to instantly see detailed information including audio features, popularity metrics, mood analysis, and more - all without having to click through to a new page."
  },
  {
    question: "What are premium badges?",
    answer: "Premium badges are exclusive profile indicators that showcase your premium status and membership longevity. Different badges are unlocked based on how long you've been a premium member, adding a unique visual element to your profile."
  },
  {
    question: "Is there a discount for annual subscriptions?",
    answer: "Yes! Annual subscriptions offer a 33% discount compared to monthly pricing, making it the most cost-effective option for music enthusiasts."
  }
];

const PremiumPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [isButtonAnimating, setIsButtonAnimating] = useState(false);
  const isPremiumUser = hasUserPremium();
  const isAdmin = isUserAdmin();

  const handlePremiumButtonClick = () => {
    setIsButtonAnimating(true);
    // In a real app, this would redirect to payment page after animation
    setTimeout(() => {
      setIsButtonAnimating(false);
      alert('Redirecting to payment options...');
    }, 600);
  };

  // Monthly and annual pricing
  const pricing = {
    monthly: {
      price: 5.99,
      period: 'month'
    },
    annual: {
      price: 47.88, // $3.99/month billed annually - 33% discount
      period: 'year'
    }
  };

  // Free tier card component
  const FreeTierCard = () => (
    <div className="h-full rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
        <h2 className="text-2xl leading-8 font-semibold">Free</h2>
        <p className="mt-4 text-blue-100">Basic access to discover playlists</p>
        <p className="mt-8">
          <span className="text-4xl font-extrabold">$0</span>
          <span className="text-base font-medium text-blue-200">/forever</span>
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">What's included</h3>
          <ul className="mt-4 space-y-4">
            {freeFeatures.map((feature) => (
              <li key={feature.name} className="flex items-start">
                <div className="flex-shrink-0">
                  <feature.icon className="h-5 w-5 text-blue-500" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{feature.name}</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{feature.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6">
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
          >
            Get started
          </Button>
        </div>
      </div>
    </div>
  );

  // Premium tier front card
  const PremiumFrontCard = () => (
    <div className="h-full rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl leading-8 font-semibold">Premium</h2>
          {!isPremiumUser && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-300 text-indigo-800">
              Popular
            </span>
          )}
        </div>
        <p className="mt-4 text-indigo-100">Full access to premium features</p>
        <div className="mt-8 flex items-end">
          <span className="text-4xl font-extrabold">${pricing[billingCycle].price}</span>
          <span className="text-base font-medium text-indigo-200 ml-2">/{pricing[billingCycle].period}</span>
        </div>
        {billingCycle === 'annual' && (
          <p className="mt-2 text-sm text-indigo-200">Save 33% vs. monthly</p>
        )}
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          <div className="flex items-center">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">What's included</h4>
            <div className="ml-2 text-xs text-indigo-500">(Click to see more details)</div>
          </div>
          <ul className="mt-4 space-y-4">
            {premiumFeatures.slice(0, 4).map((feature) => (
              <li key={feature.name} className="flex items-start">
                <div className="flex-shrink-0">
                  <feature.icon className="h-5 w-5 text-indigo-500" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{feature.name}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            animate={isButtonAnimating ? { scale: [1, 1.1, 0.9, 1.05, 1] } : {}}
          >
            <Button
              variant="primary"
              size="lg"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
              onClick={handlePremiumButtonClick}
            >
              {isPremiumUser ? 'Manage Subscription' : 'Get Premium'}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );

  // Premium tier back card with additional details
  const PremiumBackCard = () => (
    <div className="h-full rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 bg-gradient-to-br from-purple-700 to-indigo-600 text-white">
        <h2 className="text-2xl leading-8 font-semibold">Premium Details</h2>
        <p className="mt-2 text-indigo-100">Everything in Free, plus:</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6">
        <ul className="space-y-4">
          {premiumFeatures.map((feature) => (
            <li key={feature.name} className="flex items-start">
              <div className="flex-shrink-0">
                <feature.icon className="h-5 w-5 text-indigo-500" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{feature.name}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{feature.description}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Click the card to return to subscription options</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-900">
      {/* Hero section */}
      <div className="relative overflow-hidden">
        <div className="relative pt-10 pb-16 sm:pb-24">
          <div className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24 sm:px-6">
            <div className="text-center">
              <motion.h1 
                className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="block">Elevate Your Music Discovery</span>
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                  with Premium Features
                </span>
              </motion.h1>
              <motion.p 
                className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Unlock powerful analytical tools that bring music discovery to the next level. Deep data insights, advanced filtering, and seamless Spotify integration.
              </motion.p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-gray-800">
        <div className="pt-12 px-4 sm:px-6 lg:px-8 lg:pt-20">
          <div className="text-center">
            <h2 className="text-lg leading-6 font-semibold text-indigo-400 uppercase tracking-wider">Pricing</h2>
            <p className="mt-2 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              Choose the right plan for you
            </p>
            <p className="mt-3 max-w-4xl mx-auto text-xl text-gray-300 sm:mt-5 sm:text-2xl">
              Experience the full potential of My Playlist Finder with our premium features
            </p>

            {/* Billing toggle */}
            <div className="mt-12 flex justify-center">
              <div className="relative bg-gray-700 p-0.5 rounded-lg flex">
                <button
                  type="button"
                  className={`relative py-2 px-6 rounded-md text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    billingCycle === 'monthly'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-gray-300 hover:text-white'
                  }`}
                  onClick={() => setBillingCycle('monthly')}
                >
                  Monthly billing
                </button>
                <button
                  type="button"
                  className={`relative py-2 px-6 rounded-md text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    billingCycle === 'annual'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-gray-300 hover:text-white'
                  }`}
                  onClick={() => setBillingCycle('annual')}
                >
                  Annual billing
                  <span className="absolute -top-2 -right-1 px-1.5 py-0.5 rounded-full text-xs bg-green-500 text-white">Save 33%</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pb-12 lg:mt-20 lg:pb-20">
          <div className="relative z-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-8" style={{ minHeight: '520px' }}>
                {/* Free Tier */}
                <div className="lg:mt-0 h-full">
                  <FreeTierCard />
                </div>

                {/* Premium Tier - Flippable */}
                <div className="mt-10 lg:mt-0 h-full">
                  <FlippableCard
                    frontContent={<PremiumFrontCard />}
                    backContent={<PremiumBackCard />}
                    className="h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature section with grid */}
      <div className="relative bg-gray-900 py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl">
          <h2 className="text-base font-semibold tracking-wider text-indigo-400 uppercase">Premium Experience</h2>
          <p className="mt-2 text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">
              Elevate Your Music Discovery Journey
            </span>
          </p>
          <p className="mt-5 max-w-prose mx-auto text-xl text-gray-300">
            Our premium features are designed for the true music enthusiast who wants to discover, analyze, and enjoy playlists at a deeper, more meaningful level.
          </p>
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {premiumFeatures.map((feature) => (
                <motion.div 
                  key={feature.name} 
                  className="pt-6"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className={`flow-root rounded-lg px-6 pb-8 h-full bg-gradient-to-br ${feature.gradient}`}>
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-transparent border-2 border-white rounded-md shadow-lg">
                          <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-white tracking-tight">{feature.name}</h3>
                      <p className="mt-5 text-base text-white text-opacity-80">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Features section */}
      <div className="relative bg-gray-800 py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl">
          <h2 className="text-base font-semibold tracking-wider text-indigo-400 uppercase">Enhanced Interactions</h2>
          <p className="mt-2 text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-500">
              Discover Music in New Ways
            </span>
          </p>
          <p className="mt-5 max-w-prose mx-auto text-xl text-gray-300">
            Premium unlocks powerful interactive features that transform how you discover and interact with music.
          </p>
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {interactiveFeatures.map((feature) => (
                <motion.div 
                  key={feature.name} 
                  className="pt-6"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className={`flow-root rounded-lg px-6 pb-8 h-full bg-gradient-to-br ${feature.gradient}`}>
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-transparent border-2 border-white rounded-md shadow-lg">
                          <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-white tracking-tight">{feature.name}</h3>
                      <p className="mt-5 text-base text-white text-opacity-80">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-900">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div>
              <h2 className="text-3xl font-extrabold text-white">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                  Frequently asked questions
                </span>
              </h2>
              <p className="mt-4 text-lg text-gray-400">
                Can't find the answer you're looking for? Contact our support team.
              </p>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-2">
              <dl className="space-y-12">
                {faqs.map((faq, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <dt className="text-lg leading-6 font-medium text-white">
                      {faq.question}
                    </dt>
                    <dd className="mt-2 text-base text-gray-400">
                      {faq.answer}
                    </dd>
                  </motion.div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-3xl font-extrabold text-white sm:text-4xl"
            whileInView={{ scale: [0.9, 1.05, 1] }}
            transition={{ duration: 0.8 }}
          >
            <span className="block">Elevate your music experience</span>
          </motion.h2>
          <p className="mt-4 text-lg leading-6 text-indigo-100">
            Get premium today and unlock comprehensive analytics, seamless Spotify integration, and much more. Discover music the way it was meant to be experienced.
          </p>
          <motion.div 
            className="mt-8"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="primary"
              size="lg"
              className="bg-white text-indigo-600 hover:bg-gray-100"
              onClick={handlePremiumButtonClick}
            >
              Start your free trial
            </Button>
          </motion.div>
          <p className="mt-2 text-sm text-indigo-100">
            No credit card required. Cancel anytime.
          </p>
        </div>
      </div>

      {/* Admin section - only visible if user is an admin */}
      {isAdmin && (
        <div className="bg-gray-900 border-t border-gray-800 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white">Admin Controls</h2>
            <p className="mt-2 text-gray-400">Special controls for site administrators.</p>
            
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Button
                variant="secondary"
                className="text-sm"
              >
                Edit Premium Features
              </Button>
              <Button
                variant="secondary"
                className="text-sm"
              >
                Manage User Accounts
              </Button>
              <Button
                variant="secondary"
                className="text-sm"
              >
                View Analytics
              </Button>
              <Button
                variant="secondary"
                className="text-sm"
              >
                System Settings
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumPage;