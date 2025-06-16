#!/usr/bin/env node

/**
 * SVG Web Optimizer – Usage Instructions
 *
 * This script optimizes SVGs for web use:
 * - Sets fill to "currentColor"
 * - Removes Inkscape/Sodipodi bloat
 * - Applies SVGO optimization
 * - Outputs into "./optimized/"
 *
 * Run it like this:
 *
 * 1. Optimize all .svg files in current folder:
 *    node svg-weboptimizer.js
 *
 * 2. Optimize specific files:
 *    node svg-weboptimizer.js icon1.svg icon2.svg
 *
 * 3. Make it executable and run from anywhere:
 *    chmod +x svg-weboptimizer.js
 *    ./svg-weboptimizer.js icon1.svg icon2.svg
 *
 * Dependencies:
 *    npm install svgo fs-extra jsdom fast-glob
 *
 * Output:
 *    Creates ./optimized/ folder in current directory
 */

import { promises as fs } from 'fs';
import { join, basename, resolve } from 'path';
import { optimize } from 'svgo';
import { JSDOM } from 'jsdom';
import fse from 'fs-extra';
import fastGlob from 'fast-glob';
const { sync: globSync } = fastGlob;

// Set output directory
const OUTPUT_DIR = resolve('./optimized');

// Get input files from CLI args or default to all .svg in current dir
const inputFiles = process.argv.slice(2);
let filesToProcess = [];

function getFilesInCurrentDir() {
  return globSync(['*.svg']);
}

if (inputFiles.length > 0) {
  // Resolve files relative to current working directory
  filesToProcess = inputFiles.map(f => resolve(f));
} else {
  filesToProcess = getFilesInCurrentDir();
}

// Ensure output directory exists
await fse.ensureDir(OUTPUT_DIR);

console.log(`Processing SVGs from: ${process.cwd()}`);
console.log(`Output to: ${OUTPUT_DIR}`);

console.log('Files found:', filesToProcess);

for (const file of filesToProcess) {
  try {
    const filename = basename(file);
    console.log(`Processing: ${filename}`);

    // Read file contents
    let svgContent = await fs.readFile(file, 'utf8');

    // Parse SVG as DOM
    const dom = new JSDOM(svgContent, { contentType: 'image/svg+xml' });
    const document = dom.window.document;

    // Replace fill in both attributes and inline styles
    const elements = document.querySelectorAll('*');
    elements.forEach(el => {
      if (el.hasAttribute('fill')) {
        el.setAttribute('fill', 'currentColor');
      }

      if (el.hasAttribute('style')) {
        const style = el.getAttribute('style')
          .replace(/fill:[^;]+/gi, 'fill:currentColor');
        el.setAttribute('style', style);
      }
    });

    // Remove Inkscape/Sodipodi-related attributes and elements
    function removeInkscapeData(element) {
      const attrs = Array.from(element.attributes || []);
      for (const attr of attrs) {
        if (
          attr.name.startsWith('inkscape:') ||
          attr.name.startsWith('sodipodi:')
        ) {
          element.removeAttribute(attr.name);
        }
      }
    }

    function walkDOM(node) {
      if (node.nodeType === 1) {
        removeInkscapeData(node);

        // Remove known editor-specific elements
        const namedViews = node.querySelectorAll('sodipodi\\:namedview, inkscape\\:grid');
        namedViews.forEach(el => el.remove());

        for (const child of node.children) {
          walkDOM(child);
        }
      }
    }

    walkDOM(document.documentElement);

    // Serialize back to string
    const serializer = new dom.window.XMLSerializer();
    svgContent = serializer.serializeToString(document.documentElement);

    // Apply SVGO optimization
    const result = optimize(svgContent, {
      plugins: [
        'removeXMLProcInst',
        'removeComments',
        'removeMetadata',
        'removeTitle',
        'removeDesc',
        'removeUselessDefs',
        'removeEditorsNSData',
        'removeEmptyAttrs',
        'removeHiddenElems',
        'removeEmptyText',
        'removeEmptyContainers',
        {
          name: 'removeViewBox',
          params: { active: false },
        },
        {
          name: 'convertColors',
          params: { active: false },
        },
      ],
    });

    // Write optimized SVG
    const outputPath = join(OUTPUT_DIR, filename);
    await fs.writeFile(outputPath, result.data, 'utf8');
  } catch (err) {
    console.error(`Error processing "${file}":`, err.message);
  }
}

console.log(`Optimization complete! Files saved to: ${OUTPUT_DIR}`);
