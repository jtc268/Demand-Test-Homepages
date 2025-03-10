const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const TEAM_ID = process.env.TEAM_ID; // Optional: if deploying to a team

async function deploy() {
  try {
    // 1. Create a new project (if it doesn't exist)
    const createProjectResponse = await axios({
      method: 'post',
      url: 'https://api.vercel.com/v9/projects',
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      data: {
        name: 'demand-testing-platform',
        framework: 'nextjs',
        gitRepository: {
          type: 'github',
          repo: 'jtc268/Demand-Test-Homepages', // Updated to the new repository
        },
      },
    });

    const projectId = createProjectResponse.data.id;
    console.log('Project created:', projectId);

    // 2. Create a new deployment
    const deploymentResponse = await axios({
      method: 'post',
      url: 'https://api.vercel.com/v13/deployments',
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      data: {
        name: 'demand-testing-platform',
        project: projectId,
        target: 'production',
        routes: [{ src: '/(.*)', dest: '/$1' }],
        functions: {
          'api/**/*.js': {
            memory: 1024,
            maxDuration: 10,
          },
        },
        env: {
          MONGODB_URI: process.env.MONGODB_URI,
          SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
        },
      },
    });

    console.log('Deployment created:', deploymentResponse.data.url);
    
    // 3. Poll deployment status
    const deploymentId = deploymentResponse.data.id;
    let status = 'INITIALIZING';
    
    while (status !== 'READY' && status !== 'ERROR') {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      
      const statusResponse = await axios({
        method: 'get',
        url: `https://api.vercel.com/v13/deployments/${deploymentId}`,
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
        },
      });
      
      status = statusResponse.data.status;
      console.log('Deployment status:', status);
    }

    if (status === 'READY') {
      console.log('Deployment successful!');
    } else {
      console.error('Deployment failed');
    }
  } catch (error) {
    console.error('Deployment error:', error.response?.data || error.message);
  }
}

deploy(); 