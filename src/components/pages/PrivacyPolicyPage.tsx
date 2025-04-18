import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheckIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/" className="text-gray-400 hover:text-white inline-flex items-center">
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            Back to Home
          </Link>
        </div>
        
        <div className="flex items-center mb-8">
          <ShieldCheckIcon className="h-10 w-10 text-green-500 mr-4" />
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
        </div>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 mb-6">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">Introduction</h2>
          <p className="mb-4">
            Welcome to My Playlist Finder. We respect your privacy and are committed to protecting your personal data. 
            This privacy policy will inform you about how we look after your personal data when you visit our website 
            and tell you about your privacy rights and how the law protects you.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">The Data We Collect</h2>
          <p className="mb-4">
            When you use My Playlist Finder, we collect and process the following types of personal information:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Account information (name, email, username, password)</li>
            <li>Profile information (display name, bio, profile picture)</li>
            <li>Your Spotify account information (when you connect via OAuth)</li>
            <li>
              Information about your playlists, including those you create, save, or interact with through our service
            </li>
            <li>Your preferences and settings within our service</li>
            <li>Usage data (how you interact with our service, which features you use, etc.)</li>
            <li>Technical data (IP address, browser type, device information)</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">How We Use Your Data</h2>
          <p className="mb-4">
            We use your personal information for the following purposes:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>To create and manage your account</li>
            <li>To provide the core functionality of finding and discovering playlists</li>
            <li>To connect with your Spotify account and access your playlists</li>
            <li>
              To personalize your experience and provide recommendations based on your preferences and activity
            </li>
            <li>To communicate with you about updates, features, or support requests</li>
            <li>To improve our service based on user feedback and usage patterns</li>
            <li>To ensure the security and proper functioning of our platform</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">Third-Party Services</h2>
          <p className="mb-4">
            Our service integrates with Spotify's API and potentially other third-party services. When you connect your 
            Spotify account, you are also agreeing to Spotify's terms of service and privacy policy. We only access the 
            Spotify data that you explicitly authorize.
          </p>
          <p className="mb-4">
            We may use analytics providers (like Google Analytics) to help us understand how users interact with our service. 
            These providers may use cookies and similar technologies to collect information about your use of our website.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">Data Security</h2>
          <p className="mb-4">
            We implement appropriate security measures to protect your personal data from accidental loss, unauthorized access, 
            alteration, or disclosure. We limit access to your personal data to employees and contractors who have a business 
            need to know.
          </p>
          <p className="mb-4">
            However, no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive 
            to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">Your Data Rights</h2>
          <p className="mb-4">
            Depending on your location, you may have the following rights regarding your personal data:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>The right to access your personal data</li>
            <li>The right to correct inaccurate or incomplete data</li>
            <li>The right to delete your data (under certain circumstances)</li>
            <li>The right to restrict processing of your data</li>
            <li>The right to data portability</li>
            <li>The right to object to how your data is used</li>
          </ul>
          <p className="mb-4">
            To exercise any of these rights, please contact us at the information provided at the end of this policy.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">Cookies and Tracking</h2>
          <p className="mb-4">
            We use cookies and similar tracking technologies to track activity on our website and store certain information. 
            Cookies are files with a small amount of data that may include an anonymous unique identifier.
          </p>
          <p className="mb-4">
            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do 
            not accept cookies, you may not be able to use some portions of our service.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">Children's Privacy</h2>
          <p className="mb-4">
            Our service is not intended for individuals under the age of 16. We do not knowingly collect personal data from 
            children under 16. If we become aware that we have collected personal data from a child under 16, we take steps 
            to remove that information from our servers.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">Changes to This Privacy Policy</h2>
          <p className="mb-4">
            We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy 
            policy on this page and updating the "Last updated" date at the top of this policy.
          </p>
          <p className="mb-4">
            You are advised to review this privacy policy periodically for any changes. Changes to this privacy policy are 
            effective when they are posted on this page.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this privacy policy or our practices, please contact us at:
          </p>
          <div className="bg-gray-800 p-4 rounded-md">
            <p className="mb-1"><strong>Email:</strong> privacy@myplaylistfinder.com</p>
            <p className="mb-1"><strong>Address:</strong> 123 Music Avenue, Suite 789</p>
            <p><strong>Attention:</strong> Privacy Officer</p>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex justify-between items-center">
            <Link to="/terms" className="text-blue-400 hover:text-blue-300">
              Terms of Service
            </Link>
            <Link to="/" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage; 