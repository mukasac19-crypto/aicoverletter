import { NextPage } from 'next';

const AboutUsPage: NextPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">About Us</h1>
      <div className="prose lg:prose-xl">
        <p>
          Welcome to our company, your number one source for all things career. We're dedicated to giving you the very best of our services, with a focus on dependability, customer service and uniqueness.
        </p>
        <p>
          Founded in 2024, our company has come a long way from its beginnings. When we first started out, our passion for helping other people be more eco-friendly, providing the best equipment for his fellow musicians drove us to do intense research, and gave us the impetus to turn hard work and inspiration into to a booming online store. We now serve customers all over the world, and are thrilled to be a part of the quirky, eco-friendly, fair trade wing of the industry.
        </p>
        <p>
          We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.
        </p>
      </div>
    </div>
  );
};

export default AboutUsPage;
