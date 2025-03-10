import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

interface LandingPageProps {
  campaign: {
    id: string;
    name: string;
    slug: string;
    config: {
      title: string;
      subtitle?: string;
      ctaText?: string;
      thankYouMessage?: string;
      colors?: {
        primary?: string;
        secondary?: string;
        background?: string;
        text?: string;
      };
      logoUrl?: string;
      heroImageUrl?: string;
    };
  };
}

const SignupSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  name: Yup.string(),
});

const LandingPage: React.FC<LandingPageProps> = ({ campaign }) => {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (values: { email: string; name?: string }, { setSubmitting }: any) => {
    try {
      await axios.post('/api/subscribe', {
        email: values.email,
        name: values.name || '',
        campaignId: campaign.id,
      });
      
      setSubmitted(true);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const {
    title,
    subtitle,
    ctaText = 'Join the Waitlist',
    thankYouMessage = 'Thank you for your interest! We\'ll keep you updated.',
    logoUrl,
    heroImageUrl,
  } = campaign.config;

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{title}</title>
        <meta name="description" content={subtitle} />
      </Head>

      <header className="py-6 px-4 sm:px-6 lg:px-8 bg-white shadow-sm">
        <div className="container mx-auto max-w-6xl flex justify-between items-center">
          {logoUrl ? (
            <div className="h-10 w-auto">
              <Image src={logoUrl} alt="Logo" width={120} height={40} />
            </div>
          ) : (
            <div className="text-xl font-bold text-primary-600">{campaign.name}</div>
          )}
        </div>
      </header>

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xl text-gray-600 mb-8">
                  {subtitle}
                </p>
              )}

              {!submitted ? (
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <Formik
                    initialValues={{ email: '', name: '' }}
                    validationSchema={SignupSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ isSubmitting }) => (
                      <Form>
                        <div className="mb-4">
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Name (Optional)
                          </label>
                          <Field
                            type="text"
                            name="name"
                            id="name"
                            className="input"
                            placeholder="Your name"
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                          </label>
                          <Field
                            type="email"
                            name="email"
                            id="email"
                            className="input"
                            placeholder="you@example.com"
                            required
                          />
                          <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                        
                        {error && (
                          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                            {error}
                          </div>
                        )}
                        
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn btn-primary w-full py-3"
                        >
                          {isSubmitting ? 'Submitting...' : ctaText}
                        </button>
                      </Form>
                    )}
                  </Formik>
                </div>
              ) : (
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h3 className="text-xl font-semibold text-green-800 mb-2">Success!</h3>
                  <p className="text-green-700">{thankYouMessage}</p>
                </div>
              )}
            </div>
            
            <div className="hidden md:block">
              {heroImageUrl ? (
                <div className="relative h-[400px] w-full rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src={heroImageUrl}
                    alt="Hero"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              ) : (
                <div className="bg-primary-100 h-[400px] rounded-lg flex items-center justify-center">
                  <span className="text-primary-600 text-lg font-medium">
                    Add a hero image in your campaign settings
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} {campaign.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 