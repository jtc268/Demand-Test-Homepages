const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const TEAM_ID = process.env.TEAM_ID; // Optional: if deploying to a team

async function getAllFiles(dir) {
  const files = await fs.readdir(dir);
  const filelist = [];
  
  for (const file of files) {
    const filepath = path.join(dir, file);
    const stat = await fs.stat(filepath);
    
    if (stat.isDirectory()) {
      if (!['node_modules', '.git', '.next'].includes(file)) {
        filelist.push(...(await getAllFiles(filepath)));
      }
    } else {
      filelist.push(filepath);
    }
  }
  
  return filelist;
}

async function getProjectId() {
  try {
    const response = await axios({
      method: 'get',
      url: 'https://api.vercel.com/v9/projects',
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
      },
    });

    const project = response.data.projects.find(p => p.name === 'demand-testing-platform');
    return project ? project.id : null;
  } catch (error) {
    console.error('Error getting project:', error.message);
    return null;
  }
}

async function deploy() {
  try {
    // 1. Get or create project
    let projectId = await getProjectId();
    
    if (!projectId) {
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
            repo: 'jtc268/Demand-Test-Homepages',
          },
        },
      });
      projectId = createProjectResponse.data.id;
      console.log('Project created:', projectId);
    } else {
      console.log('Using existing project:', projectId);
    }

    // 2. Get all project files
    const files = await getAllFiles('.');
    const deploymentFiles = await Promise.all(
      files.map(async (file) => {
        const content = await fs.readFile(file);
        return {
          file: file.replace(/^\.\//g, ''),
          data: content.toString('base64'),
          encoding: 'base64',
        };
      })
    );

    // 3. Create a new deployment
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
        files: deploymentFiles,
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
    
    // 4. Poll deployment status
    const deploymentId = deploymentResponse.data.id;
    let status = 'INITIALIZING';
    
    while (status !== 'READY' && status !== 'ERROR') {
      await new Promise(resolve => setTimeout(resolve, 5000));
      
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