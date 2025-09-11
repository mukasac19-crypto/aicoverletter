import { NextPage } from 'next';

const PrivacyPolicyPage: NextPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
      <div className="prose lg:prose-xl">
        <p>
          This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2">1. Information We Collect</h2>
        <p>
          We may collect personal identification information from Users in a variety of ways, including, but not limited to, when Users visit our site, register on the site, place an order, and in connection with other activities, services, features or resources we make available on our Site.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2">2. How We Use Collected Information</h2>
        <p>
          We may collect and use Users personal information for the following purposes: to improve customer service, to personalize user experience, to process payments, to send periodic emails.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2">3. How We Protect Your Information</h2>
        <p>
          We adopt appropriate data collection, storage and processing practices and security measures to protect against unauthorized access, alteration, disclosure or destruction of your personal information, username, password, transaction information and data stored on our Site.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2">4. Sharing Your Personal Information</h2>
        <p>
          We do not sell, trade, or rent Users personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates and advertisers for the purposes outlined above.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2">5. Your Acceptance of These Terms</h2>
        <p>
          By using this Site, you signify your acceptance of this policy. If you do not agree to this policy, please do not use our Site. Your continued use of the Site following the posting of changes to this policy will be deemed your acceptance of those changes.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2">Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
