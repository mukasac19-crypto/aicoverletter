import { NextPage } from 'next';

const TermsOfUsePage: NextPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Terms of Use</h1>
      <div className="prose lg:prose-xl">
        <p>
          Welcome to our website. If you continue to browse and use this website, you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern our relationship with you in relation to this website. If you disagree with any part of these terms and conditions, please do not use our website.
        </p>
        
        <h2 className="text-2xl font-bold mt-6 mb-2">1. Acceptance of Terms</h2>
        <p>
          By using this site, you signify your acceptance of these terms. If you do not agree to these terms, please do not use our site. Your continued use of the site following the posting of changes to these terms will be deemed your acceptance of those changes.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2">2. Description of Service</h2>
        <p>
          Our platform provides users with tools for resume building, cover letter generation, job searching, and interview preparation. We also offer subscription-based services for premium features.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2">3. User Responsibilities</h2>
        <p>
          You are responsible for your own communications and are responsible for the consequences of their posting. You must not, and by using this Website you agree not to, do the following things: post material that is copyrighted, unless you are the copyright owner or have the permission of the copyright owner to post it; post material that reveals trade secrets, unless you own them or have the permission of the owner.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2">4. Intellectual Property</h2>
        <p>
          All content included on the site, such as text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and software, is the property of our company or its content suppliers and protected by international copyright laws.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2">5. Limitation of Liability</h2>
        <p>
          In no event shall our company be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2">6. Governing Law</h2>
        <p>
          These terms and conditions are governed by and construed in accordance with the laws of our country and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2">Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us.
        </p>
      </div>
    </div>
  );
};

export default TermsOfUsePage;
