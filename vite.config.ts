import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Actions provides owner/repository. This avoids hard-coded Pages paths.
const repository = process.env.GITHUB_REPOSITORY?.split('/').pop();
const base = process.env.GITHUB_PAGES === 'true'
  ? (repository ? `/${repository}/` : '/SBau-/')
  : '/';

export default defineConfig({ base, plugins: [react()] });
