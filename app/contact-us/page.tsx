import { NextPage } from 'next';

const ContactUsPage: NextPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
      <div className="prose lg:prose-xl">
        <p>
          If you have any questions, please feel free to contact us.
        </p>
        <p>
          Email: support@careerthings.ai
        </p>
      </div>
    </div>
  );
};

export default ContactUsPage;
