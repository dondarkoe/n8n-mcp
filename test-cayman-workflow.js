#!/usr/bin/env node

/**
 * Cayman Islands Registry Workflow - Component Test Script
 *
 * This script helps test individual components of the workflow
 * before full deployment to n8n Cloud.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Test configuration
const TEST_CONFIG = {
  registryUrl: 'https://judicial.ky/public-registers/?register=Financial+Services',
  wordpressAjaxUrl: 'https://judicial.ky/wp-admin/admin-ajax.php',
  testCaseNumber: 'FSD2025027209292025PFS', // Example case number
  outputDir: './test-output'
};

// Create output directory
if (!fs.existsSync(TEST_CONFIG.outputDir)) {
  fs.mkdirSync(TEST_CONFIG.outputDir, { recursive: true });
}

/**
 * Test 1: Registry Page Scraping
 */
async function testRegistryScraping() {
  console.log('🧪 Testing registry page scraping...');

  return new Promise((resolve, reject) => {
    const request = https.get(TEST_CONFIG.registryUrl, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        // Save raw HTML for inspection
        fs.writeFileSync(
          path.join(TEST_CONFIG.outputDir, 'registry-raw.html'),
          data
        );

        // Check for key indicators
        const hasMarkdownTable = data.includes('| Cause');
        const hasDataVwButtons = data.includes('data-vw=');
        const hasAjaxNonce = data.includes('ajax_nonce');

        const results = {
          success: response.statusCode === 200,
          statusCode: response.statusCode,
          contentLength: data.length,
          hasMarkdownTable,
          hasDataVwButtons,
          hasAjaxNonce,
          sampleDataVw: data.match(/data-vw="([^"]+)"/)?.[1] || 'Not found',
          sampleNonce: data.match(/ajax_nonce["'\s:]+["']([a-f0-9]+)["']/)?.[1] || 'Not found'
        };

        console.log('✅ Registry scraping results:', results);
        resolve(results);
      });
    });

    request.on('error', (error) => {
      console.error('❌ Registry scraping failed:', error.message);
      reject(error);
    });

    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

/**
 * Test 2: WordPress AJAX Call
 */
async function testWordPressAjax(dataVw, wpNonce) {
  console.log('🧪 Testing WordPress AJAX call...');

  if (!dataVw || !wpNonce) {
    throw new Error('Missing dataVw or wpNonce for AJAX test');
  }

  const postData = new URLSearchParams({
    action: 'get_bfile',
    fid: '286692767087',
    fname: dataVw,
    security: wpNonce
  }).toString();

  const options = {
    hostname: 'judicial.ky',
    path: '/wp-admin/admin-ajax.php',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData),
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    }
  };

  return new Promise((resolve, reject) => {
    const request = https.request(options, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        try {
          const jsonResponse = JSON.parse(data);

          // Save response for inspection
          fs.writeFileSync(
            path.join(TEST_CONFIG.outputDir, 'wordpress-ajax-response.json'),
            JSON.stringify(jsonResponse, null, 2)
          );

          const results = {
            success: response.statusCode === 200,
            statusCode: response.statusCode,
            hasSuccess: jsonResponse.success === true,
            hasFileData: !!(jsonResponse.data?.fid && jsonResponse.data?.t),
            boxFileId: jsonResponse.data?.fid || 'Not found',
            token: jsonResponse.data?.t ? '[PRESENT]' : 'Not found'
          };

          console.log('✅ WordPress AJAX results:', results);
          resolve(results);
        } catch (error) {
          console.error('❌ Failed to parse AJAX response:', error.message);
          console.error('Raw response:', data.substring(0, 500));
          reject(error);
        }
      });
    });

    request.on('error', (error) => {
      console.error('❌ WordPress AJAX request failed:', error.message);
      reject(error);
    });

    request.write(postData);
    request.end();

    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error('AJAX request timeout'));
    });
  });
}

/**
 * Test 3: Box.com URL Construction and Access
 */
async function testBoxUrlConstruction(boxFileId, token) {
  console.log('🧪 Testing Box.com URL construction...');

  if (!boxFileId || !token) {
    throw new Error('Missing boxFileId or token for Box.com test');
  }

  const boxUrl = `https://api.box.com/2.0/files/${boxFileId}/content?access_token=${token}`;

  console.log(`📦 Constructed Box URL: ${boxUrl.replace(token, '[TOKEN]')}`);

  // Test HEAD request to verify URL accessibility
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.box.com',
      path: `/2.0/files/${boxFileId}/content?access_token=${token}`,
      method: 'HEAD'
    };

    const request = https.request(options, (response) => {
      const results = {
        success: response.statusCode === 200,
        statusCode: response.statusCode,
        contentType: response.headers['content-type'] || 'Not found',
        contentLength: response.headers['content-length'] || 'Not found',
        isPdf: (response.headers['content-type'] || '').includes('pdf')
      };

      console.log('✅ Box.com URL test results:', results);
      resolve(results);
    });

    request.on('error', (error) => {
      console.error('❌ Box.com URL test failed:', error.message);
      reject(error);
    });

    request.setTimeout(15000, () => {
      request.destroy();
      reject(new Error('Box.com test timeout'));
    });
  });
}

/**
 * Main test execution
 */
async function runAllTests() {
  console.log('🚀 Starting Cayman Registry Workflow Component Tests\n');

  try {
    // Test 1: Registry scraping
    const scrapingResults = await testRegistryScraping();

    if (!scrapingResults.success) {
      throw new Error('Registry scraping failed - cannot continue');
    }

    // Test 2: WordPress AJAX (if we found test data)
    if (scrapingResults.sampleDataVw !== 'Not found' && scrapingResults.sampleNonce !== 'Not found') {
      console.log(`\n📋 Using test data: dataVw=${scrapingResults.sampleDataVw}, nonce=${scrapingResults.sampleNonce}`);

      const ajaxResults = await testWordPressAjax(
        scrapingResults.sampleDataVw,
        scrapingResults.sampleNonce
      );

      if (ajaxResults.hasFileData) {
        // Test 3: Box.com URL
        await testBoxUrlConstruction(ajaxResults.boxFileId, '[TOKEN]');
      }
    } else {
      console.log('\n⚠️  No test data found in scraped page - manual testing required');
      console.log('To test manually:');
      console.log('1. Open https://judicial.ky/public-registers/?register=Financial+Services');
      console.log('2. Find a case with Preview button');
      console.log('3. Inspect the button to get data-vw attribute');
      console.log('4. Look for ajax_nonce in page source');
    }

    console.log('\n🎉 Component testing completed!');
    console.log('\n📁 Check test-output/ directory for detailed results');
    console.log('\n🔄 Next steps:');
    console.log('1. Import Cayman-Registry-Complete-Workflow.json into n8n');
    console.log('2. Configure API credentials (OpenAI, Google Sheets, Slack)');
    console.log('3. Update credential IDs in workflow JSON');
    console.log('4. Test workflow step by step in n8n');
    console.log('5. Enable full automation');

  } catch (error) {
    console.error('\n❌ Testing failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Check your internet connection');
    console.error('2. Verify the Cayman Islands registry website is accessible');
    console.error('3. Check if any firewall/proxy is blocking requests');
    console.error('4. Try running the test again in a few minutes');

    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log('Cayman Registry Workflow Test Script');
  console.log('');
  console.log('Usage: node test-cayman-workflow.js [options]');
  console.log('');
  console.log('Options:');
  console.log('  --help, -h    Show this help message');
  console.log('  --verbose     Enable verbose logging');
  console.log('');
  console.log('This script tests the core components of the Cayman Registry workflow');
  console.log('before deployment to ensure everything works correctly.');
  process.exit(0);
}

// Run tests
runAllTests().catch(error => {
  console.error('💥 Test execution failed:', error);
  process.exit(1);
});
