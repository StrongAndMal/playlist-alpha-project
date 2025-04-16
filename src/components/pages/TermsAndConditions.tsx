import React from 'react';
import { Link } from 'react-router-dom';

const TermsAndConditions: React.FC = () => {
  React.useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-white">
      <h1 className="text-3xl font-bold mb-8 text-center">Terms and Conditions</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3 text-blue-400">1. Introduction</h2>
          <p className="mb-2">Welcome to My Playlist Finder. By using our platform, you agree to these Terms and Conditions, which constitute a legally binding agreement.</p>
          <p>These terms apply to all visitors, users, and others who access or use our service.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-blue-400">2. User Accounts</h2>
          <p className="mb-2">When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.</p>
          <p className="mb-2">You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.</p>
          <p>You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-blue-400">3. User Content</h2>
          <p className="mb-2">Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for the content that you post, including its legality, reliability, and appropriateness.</p>
          <p className="mb-2">By posting content on our platform, you grant us the right to use, modify, publicly perform, publicly display, reproduce, and distribute such content on and through the service.</p>
          <p>You agree that this license includes the right for us to make your content available to other users of the service, who may also use your content subject to these Terms.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-blue-400">4. Intellectual Property</h2>
          <p className="mb-2">The service and its original content (excluding user-provided content), features, and functionality are and will remain the exclusive property of My Playlist Finder and its licensors.</p>
          <p>Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of My Playlist Finder.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-blue-400">5. Termination</h2>
          <p className="mb-2">We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
          <p>Upon termination, your right to use the service will immediately cease. If you wish to terminate your account, you may simply discontinue using the service.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-blue-400">6. Limitation of Liability</h2>
          <p className="mb-2">In no event shall My Playlist Finder, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-blue-400">7. Changes to Terms</h2>
          <p className="mb-2">We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.</p>
          <p>By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-blue-400">8. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at support@myplaylistfinder.com.</p>
        </section>
        
        <div className="border-t border-gray-700 pt-6 mt-6">
          <p className="text-center">
            By using My Playlist Finder, you acknowledge that you have read and understood these Terms and Conditions and agree to be bound by them.
          </p>
        </div>
        
        <div className="text-center mt-6">
          <Link to="/" className="text-blue-400 hover:text-blue-300">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions; 