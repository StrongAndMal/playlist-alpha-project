import React from 'react';
import { Link } from 'react-router-dom';
import { DocumentTextIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';

const TermsOfServicePage: React.FC = () => {
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
          <DocumentTextIcon className="h-10 w-10 text-blue-500 mr-4" />
          <h1 className="text-3xl font-bold">Terms of Service</h1>
        </div>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 mb-6">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">Introduction</h2>
          <p className="mb-4">
            Welcome to My Playlist Finder. By accessing or using our website and services, you agree to be bound by these 
            Terms of Service. If you disagree with any part of these terms, you may not access our service.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">Accounts</h2>
          <p className="mb-4">
            When you create an account with us, you must provide accurate, complete, and up-to-date information. You are 
            responsible for safeguarding the password that you use to access our service and for any activities or actions 
            under your password.
          </p>
          <p className="mb-4">
            You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of 
            any breach of security or unauthorized use of your account.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">Intellectual Property</h2>
          <p className="mb-4">
            Our service and its original content, features, and functionality are and will remain the exclusive property of 
            My Playlist Finder and its licensors. The service is protected by copyright, trademark, and other laws of both 
            the United States and foreign countries.
          </p>
          <p className="mb-4">
            Our trademarks and trade dress may not be used in connection with any product or service without the prior 
            written consent of My Playlist Finder.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">User-Generated Content</h2>
          <p className="mb-4">
            By posting, uploading, sharing, or otherwise transmitting content on or through our service, you grant us a 
            non-exclusive, royalty-free, worldwide, perpetual, and irrevocable right to use, copy, modify, adapt, publish, 
            translate, create derivative works from, distribute, and display such content throughout the world in any media.
          </p>
          <p className="mb-4">
            You represent and warrant that you own or control all rights in and to the content you provide, and that the content 
            does not violate these Terms or any applicable law.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">Third-Party Services</h2>
          <p className="mb-4">
            Our service allows you to connect with third-party services, particularly Spotify. Your use of such third-party 
            services is governed by their respective terms of service and privacy policies. My Playlist Finder is not responsible 
            for the content, policies, or practices of any third-party service.
          </p>
          <p className="mb-4">
            By connecting your Spotify account to our service, you are giving us permission to access, store, and use certain 
            information from your Spotify account in accordance with our Privacy Policy and the permissions you grant.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">Prohibited Uses</h2>
          <p className="mb-4">
            You may use our service only for lawful purposes and in accordance with these Terms. You agree not to use our service:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>In any way that violates any applicable federal, state, local, or international law or regulation</li>
            <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail," "chain letter," or "spam"</li>
            <li>To impersonate or attempt to impersonate My Playlist Finder, a My Playlist Finder employee, another user, or any other person or entity</li>
            <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the service, or which may harm My Playlist Finder or users of the service or expose them to liability</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">Termination</h2>
          <p className="mb-4">
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including, without limitation, if you breach these Terms.
          </p>
          <p className="mb-4">
            Upon termination, your right to use our service will immediately cease. If you wish to terminate your account, you may simply discontinue using our service or delete your account.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">Limitation of Liability</h2>
          <p className="mb-4">
            In no event shall My Playlist Finder, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Your access to or use of or inability to access or use the service</li>
            <li>Any conduct or content of any third party on the service</li>
            <li>Any content obtained from the service</li>
            <li>Unauthorized access, use, or alteration of your transmissions or content</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">Disclaimer</h2>
          <p className="mb-4">
            Your use of our service is at your sole risk. The service is provided on an "AS IS" and "AS AVAILABLE" basis. The service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
          </p>
          <p className="mb-4">
            My Playlist Finder, its subsidiaries, affiliates, and its licensors do not warrant that a) the service will function uninterrupted, secure, or available at any particular time or location; b) any errors or defects will be corrected; c) the service is free of viruses or other harmful components; or d) the results of using the service will meet your requirements.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>
          <p className="mb-4">
            By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the service.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">Governing Law</h2>
          <p className="mb-4">
            These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
          </p>
          <p className="mb-4">
            Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p className="mb-4">
            If you have any questions about these Terms, please contact us at:
          </p>
          <div className="bg-gray-800 p-4 rounded-md">
            <p className="mb-1"><strong>Email:</strong> terms@myplaylistfinder.com</p>
            <p className="mb-1"><strong>Address:</strong> 123 Music Avenue, Suite 789</p>
            <p><strong>Attention:</strong> Legal Department</p>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex justify-between items-center">
            <Link to="/privacy" className="text-blue-400 hover:text-blue-300">
              Privacy Policy
            </Link>
            <Link to="/" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage; 