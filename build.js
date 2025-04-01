import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';

async function buildProject() {
  console.log('🏗️ Building project...');

  // Ensure dist directory exists
  if (fs.existsSync('./dist')) {
    console.log('Cleaning dist directory...');
    fs.rmSync('./dist', { recursive: true, force: true });
  }
  fs.mkdirSync('./dist', { recursive: true });

  try {
    // Build TypeScript
    await build({
      entryPoints: ['./src/main.ts'],
      outfile: './dist/main.js',
      bundle: true,
      minify: true,
      format: 'esm',
      platform: 'browser',
      loader: {
        '.ts': 'ts',
      },
      define: {
        'process.env.NODE_ENV': '"production"',
      }
    });

    console.log('✅ TypeScript compiled successfully.');

    // Copy HTML file
    fs.copyFileSync('./src/index.html', './dist/index.html');
    console.log('✅ HTML files copied.');

    // Copy CSS file
    fs.copyFileSync('./src/style.css', './dist/style.css');
    console.log('✅ CSS files copied.');

    // Copy any other static assets if they exist
    const imagesDir = './src/images';
    if (fs.existsSync(imagesDir)) {
      const targetDir = './dist/images';
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      fs.readdirSync(imagesDir).forEach(file => {
        fs.copyFileSync(path.join(imagesDir, file), path.join(targetDir, file));
      });
      console.log('✅ Images copied.');
    }

    console.log('🎉 Build complete! Files written to ./dist');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  buildProject();
}

export { buildProject }; 