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

async function buildMcpServer() {
  console.log('🏗️ Building MCP server...');

  // Ensure dist-mcp directory exists
  if (fs.existsSync('./dist-mcp')) {
    console.log('Cleaning dist-mcp directory...');
    fs.rmSync('./dist-mcp', { recursive: true, force: true });
  }
  fs.mkdirSync('./dist-mcp', { recursive: true });

  try {
    // Build MCP server
    await build({
      entryPoints: ['./utils/mcp-server/index.ts'],
      outfile: './dist-mcp/index.js',
      bundle: true,
      minify: false, // For easier debugging
      format: 'esm',
      platform: 'node',
      loader: {
        '.ts': 'ts',
      },
      external: ['child_process', 'fs', 'path', 'os', 'util'],
      define: {
        'process.env.NODE_ENV': '"production"',
      }
    });

    console.log('✅ MCP server compiled successfully.');

    // Create README for MCP server
    const mcpReadme = `# Katana Foundry MCP Server

This is a Model Context Protocol (MCP) server for Foundry that provides tools
for interacting with Katana blockchain via the command line.

## Usage

To use this MCP server with Cursor, add the following to your Cursor config:

\`\`\`json
"mcpServers": {
  "foundry": {
    "command": "bun",
    "args": [
      "${path.resolve('./dist-mcp/index.js')}"
    ],
    "env": {
      "PRIVATE_KEY": "0xYourPrivateKeyHere",
      "RPC_URL": "http://localhost:8545"
    }
  }
}
\`\`\`

The \`PRIVATE_KEY\` and \`RPC_URL\` environment variables are optional. If not provided,
the RPC URL will default to http://localhost:8545.
`;

    fs.writeFileSync('./dist-mcp/README.md', mcpReadme);
    console.log('✅ MCP server README created.');

  } catch (error) {
    console.error('❌ MCP server build failed:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  if (process.argv.includes('--mcp-only')) {
    buildMcpServer();
  } else {
    buildProject();
  }
}

export { buildProject, buildMcpServer }; 