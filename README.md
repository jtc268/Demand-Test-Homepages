# Demand Testing Platform

A scalable platform for launching landing pages to gauge demand and collect email sign-ups.

## Features

- Create multiple landing pages with different themes
- Collect email sign-ups
- Send confirmation emails via SendGrid
- Track conversion metrics
- Easy to deploy and scale

## Getting Started

### Prerequisites

- Node.js 14.x or later
- MongoDB (local or Atlas)
- SendGrid account for email functionality

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/demand-testing.git
cd demand-testing
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
Copy the `.env.local.example` file to `.env.local` and fill in your values:
```bash
cp .env.local.example .env.local
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

- `/src/pages` - Next.js pages
- `/src/components` - Reusable React components
- `/src/utils` - Utility functions
- `/src/styles` - Global styles and Tailwind configuration
- `/public` - Static assets

## Deployment

This project can be easily deployed to Vercel, Netlify, or any other Next.js-compatible hosting platform.

## License

MIT 