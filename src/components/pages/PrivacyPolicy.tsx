import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  React.useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-white">
      <h1 className="text-3xl font-bold mb-8 text-center">Privacy Policy</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3 text-blue-400">1. Introduction</h2>
          <p className="mb-2">At My Playlist Finder, we respect your privacy and are committed to protecting it through our compliance with this policy.</p>
          <p>This Privacy Policy describes the types of information we may collect from you or that you may provide when you visit our website and our practices for collecting, using, maintaining, protecting, and disclosing that information.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-blue-400">2. Information We Collect</h2>
          <p className="mb-2">We collect several types of information from and about users of our website, including:</p>
          <ul className="list-disc pl-5 space-y-1 mb-2">
            <li>Personal information such as name, email address, and username when you register for an account</li>
            <li>Information about your internet connection, the equipment you use to access our website, and usage details</li>
            <li>Records and copies of your correspondence if you contact us</li>
            <li>Details of transactions you carry out through our website</li>
            <li>Your search queries on the website</li>
          </ul>
          <p>We collect this information directly from you when you provide it to us, automatically as you navigate through the site, and from third parties, such as when you connect with other platforms.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-blue-400">3. How We Use Your Information</h2>
          <p className="mb-2">We use information that we collect about you or that you provide to us:</p>
          <ul className="list-disc pl-5 space-y-1 mb-2">
            <li>To present our website and its contents to you</li>
            <li>To provide you with information, products, or services that you request from us</li>
            <li>To fulfill any other purpose for which you provide it</li>
            <li>To provide you with notices about your account</li>
            <li>To improve our website and user experience</li>
            <li>To allow you to participate in interactive features on our website</li>
            <li>In any other way we may describe when you provide the information</li>
            <li>For any other purpose with your consent</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-blue-400">4. Disclosure of Your Information</h2>
          <p className="mb-2">We may disclose aggregated information about our users, and information that does not identify any individual, without restriction.</p>
          <p className="mb-2">We may disclose personal information that we collect or you provide as described in this privacy policy:</p>
          <ul className="list-disc pl-5 space-y-1 mb-2">
            <li>To our subsidiaries and affiliates</li>
            <li>To contractors, service providers, and other third parties we use to support our business</li>
            <li>To a buyer or other successor in the event of a merger, divestiture, restructuring, reorganization, dissolution, or other sale</li>
            <li>To fulfill the purpose for which you provide it</li>
            <li>For any other purpose disclosed by us when you provide the information</li>
            <li>With your consent</li>
          </ul>
          <p>We may also disclose your personal information to comply with any court order, law, or legal process, or to establish or exercise our legal rights or defend against legal claims.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-blue-400">5. Data Security</h2>
          <p className="mb-2">We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure.</p>
          <p>Unfortunately, the transmission of information via the internet is not completely secure. Although we do our best to protect your personal information, we cannot guarantee the security of your personal information transmitted to our website.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-blue-400">6. Your Choices About Our Collection and Use</h2>
          <p className="mb-2">You can review and change your personal information by logging into the website and visiting your account profile page.</p>
          <p>You may also send us an email to request access to, correct or delete any personal information that you have provided to us. We cannot delete your personal information except by also deleting your user account.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-blue-400">7. Changes to Our Privacy Policy</h2>
          <p className="mb-2">It is our policy to post any changes we make to our privacy policy on this page. If we make material changes to how we treat our users' personal information, we will notify you by email or through a notice on the website home page.</p>
          <p>The date the privacy policy was last revised is identified at the top of the page. You are responsible for ensuring we have an up-to-date active and deliverable email address for you, and for periodically visiting our website and this privacy policy to check for any changes.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-blue-400">8. Contact Information</h2>
          <p className="mb-2">To ask questions or comment about this privacy policy and our privacy practices, contact us at: privacy@myplaylistfinder.com</p>
        </section>
        
        <div className="border-t border-gray-700 pt-6 mt-6">
          <p className="text-center">
            By using My Playlist Finder, you consent to our Privacy Policy and agree to its terms.
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

export default PrivacyPolicy; 