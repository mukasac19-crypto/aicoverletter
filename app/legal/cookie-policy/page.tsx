import { NextPage } from 'next';

const CookiePolicyPage: NextPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
      <div className="prose lg:prose-xl">
        <p>
          This Cookie Policy explains what cookies are and how we use them. You should read this policy to understand what cookies are, how we use them, the types of cookies we use i.e, the information we collect using cookies and how that information is used, and how to control the cookie preferences.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2">What are cookies?</h2>
        <p>
          Cookies are small text files that are used to store small pieces of information. They are stored on your device when the website is loaded on your browser. These cookies help us make the website function properly, make the website more secure, provide better user experience, and understand how the website performs and to analyze what works and where it needs improvement.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2">How do we use cookies?</h2>
        <p>
          As most of the online services, our website uses first-party and third-party cookies for a number of purposes. The first-party cookies are mostly necessary for the website to function the right way, and they do not collect any of your personally identifiable data.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2">What types of cookies do we use?</h2>
        <p>
          The cookies used on our websites are grouped into the following categories: Essential, Performance, and Functionality.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2">How can I control the cookie preferences?</h2>
        <p>
          Should you decide to change your preferences later through your browsing session, you can click on the “Privacy & Cookie Policy” tab on your screen. This will display the consent notice again enabling you to change your preferences or withdraw your consent entirely.
        </p>
      </div>
    </div>
  );
};

export default CookiePolicyPage;
