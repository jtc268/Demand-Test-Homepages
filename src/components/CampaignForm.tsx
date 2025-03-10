import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import axios from 'axios';

interface CampaignFormProps {
  initialValues?: {
    name: string;
    slug: string;
    description: string;
    active: boolean;
    template: string;
    config: {
      title: string;
      subtitle: string;
      ctaText: string;
      thankYouMessage: string;
      colors: {
        primary: string;
        secondary: string;
        background: string;
        text: string;
      };
      logoUrl: string;
      heroImageUrl: string;
    };
  };
  isEditing?: boolean;
}

const defaultInitialValues = {
  name: '',
  slug: '',
  description: '',
  active: true,
  template: 'default',
  config: {
    title: '',
    subtitle: '',
    ctaText: 'Join the Waitlist',
    thankYouMessage: 'Thank you for your interest! We\'ll keep you updated.',
    colors: {
      primary: '#0ea5e9',
      secondary: '#0284c7',
      background: '#f0f9ff',
      text: '#0c4a6e',
    },
    logoUrl: '',
    heroImageUrl: '',
  },
};

const CampaignSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  slug: Yup.string()
    .required('Slug is required')
    .matches(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
    .min(3, 'Slug must be at least 3 characters'),
  description: Yup.string(),
  active: Yup.boolean(),
  template: Yup.string().required('Template is required'),
  config: Yup.object().shape({
    title: Yup.string().required('Title is required'),
    subtitle: Yup.string(),
    ctaText: Yup.string(),
    thankYouMessage: Yup.string(),
    colors: Yup.object().shape({
      primary: Yup.string(),
      secondary: Yup.string(),
      background: Yup.string(),
      text: Yup.string(),
    }),
    logoUrl: Yup.string().url('Must be a valid URL'),
    heroImageUrl: Yup.string().url('Must be a valid URL'),
  }),
});

const CampaignForm: React.FC<CampaignFormProps> = ({ initialValues = defaultInitialValues, isEditing = false }) => {
  const router = useRouter();
  
  const handleSubmit = async (values: typeof initialValues, { setSubmitting, setStatus }: any) => {
    try {
      if (isEditing) {
        // Update existing campaign
        await axios.put(`/api/campaigns/${initialValues._id}`, values);
      } else {
        // Create new campaign
        await axios.post('/api/campaigns', values);
      }
      
      router.push('/dashboard');
    } catch (error: any) {
      setStatus({
        error: error.response?.data?.message || 'An error occurred while saving the campaign',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={CampaignSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, status, values, setFieldValue }) => (
        <Form className="space-y-8">
          {status?.error && (
            <div className="bg-red-50 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{status.error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Campaign Name
                  </label>
                  <Field
                    type="text"
                    name="name"
                    id="name"
                    className="input"
                    placeholder="My Awesome Product"
                  />
                  <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
                </div>
                
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                    URL Slug
                  </label>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">/c/</span>
                    <Field
                      type="text"
                      name="slug"
                      id="slug"
                      className="input"
                      placeholder="my-awesome-product"
                    />
                  </div>
                  <ErrorMessage name="slug" component="div" className="mt-1 text-sm text-red-600" />
                </div>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <Field
                  as="textarea"
                  name="description"
                  id="description"
                  rows={3}
                  className="input"
                  placeholder="A brief description of your campaign"
                />
                <ErrorMessage name="description" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              
              <div className="flex items-center">
                <Field
                  type="checkbox"
                  name="active"
                  id="active"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                  Active (publicly visible)
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Landing Page Content</h3>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label htmlFor="config.title" className="block text-sm font-medium text-gray-700 mb-1">
                  Page Title
                </label>
                <Field
                  type="text"
                  name="config.title"
                  id="config.title"
                  className="input"
                  placeholder="Introducing Our Amazing Product"
                />
                <ErrorMessage name="config.title" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              
              <div>
                <label htmlFor="config.subtitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Subtitle (Optional)
                </label>
                <Field
                  type="text"
                  name="config.subtitle"
                  id="config.subtitle"
                  className="input"
                  placeholder="Sign up to get early access and exclusive updates"
                />
                <ErrorMessage name="config.subtitle" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="config.ctaText" className="block text-sm font-medium text-gray-700 mb-1">
                    Button Text
                  </label>
                  <Field
                    type="text"
                    name="config.ctaText"
                    id="config.ctaText"
                    className="input"
                    placeholder="Join the Waitlist"
                  />
                  <ErrorMessage name="config.ctaText" component="div" className="mt-1 text-sm text-red-600" />
                </div>
                
                <div>
                  <label htmlFor="config.thankYouMessage" className="block text-sm font-medium text-gray-700 mb-1">
                    Thank You Message
                  </label>
                  <Field
                    type="text"
                    name="config.thankYouMessage"
                    id="config.thankYouMessage"
                    className="input"
                    placeholder="Thank you for your interest! We'll keep you updated."
                  />
                  <ErrorMessage name="config.thankYouMessage" component="div" className="mt-1 text-sm text-red-600" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="config.logoUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    Logo URL (Optional)
                  </label>
                  <Field
                    type="text"
                    name="config.logoUrl"
                    id="config.logoUrl"
                    className="input"
                    placeholder="https://example.com/logo.png"
                  />
                  <ErrorMessage name="config.logoUrl" component="div" className="mt-1 text-sm text-red-600" />
                </div>
                
                <div>
                  <label htmlFor="config.heroImageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    Hero Image URL (Optional)
                  </label>
                  <Field
                    type="text"
                    name="config.heroImageUrl"
                    id="config.heroImageUrl"
                    className="input"
                    placeholder="https://example.com/hero.jpg"
                  />
                  <ErrorMessage name="config.heroImageUrl" component="div" className="mt-1 text-sm text-red-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="btn btn-secondary mr-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Campaign' : 'Create Campaign'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CampaignForm; 