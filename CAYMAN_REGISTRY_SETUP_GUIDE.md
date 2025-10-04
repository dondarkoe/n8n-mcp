# Cayman Islands Registry Scraper & Analysis - Complete Setup Guide

## 🎯 Project Overview

This automated workflow monitors the Cayman Islands Judicial Registry for new Financial Services winding-up petitions and petitions, extracts case details from scanned PDFs using AI vision analysis, and delivers daily reports to Slack with historical logging in Google Sheets.

**Key Features:**
- ✅ Daily automated monitoring (8 AM Cayman time)
- ✅ PDF extraction from Box.com via headless browser automation
- ✅ GPT-4o Vision analysis of scanned legal documents
- ✅ Structured extraction of 5 critical data points
- ✅ Automated Slack reporting to #tma-intel
- ✅ Historical logging in Google Sheets
- ✅ Duplicate prevention and error handling

## 📋 Prerequisites

### Required API Keys & Accounts

1. **n8n Cloud Instance**
   - Active n8n Cloud account
   - API access enabled

2. **Firecrawl API Key**
   - Account: https://firecrawl.dev
   - Purpose: Web scraping with JavaScript rendering
   - Cost: ~$0.01-0.05 per scrape

3. **OpenAI API Key**
   - Account: https://platform.openai.com
   - Purpose: GPT-4o Vision PDF analysis
   - Cost: ~$0.01-0.03 per document

4. **Google Service Account**
   - Google Cloud Project with Sheets API enabled
   - Service account with Sheets read/write permissions

5. **Slack OAuth App**
   - Slack workspace with #tma-intel channel
   - OAuth app with `channels:read` and `chat:write` permissions

### Existing Resources (Already Configured)
- ✅ Google Sheets: `1LCCdNUXauOt4UXF5sGXr-9foDwzarHHMoC6HvrlXdGs`
- ✅ Slack Channel: `#tma-intel` (ID: `C09B46WHGBE`)
- ✅ Firecrawl API Key: Configured

## 🚀 Deployment Instructions

### Step 1: Import Workflow into n8n

1. **Download the workflow file:**
   ```bash
   # File is already created: Cayman-Registry-Complete-Workflow.json
   ```

2. **Import into n8n Cloud:**
   - Go to your n8n Cloud instance
   - Navigate to **Workflows** → **Import**
   - Select `Cayman-Registry-Complete-Workflow.json`
   - Click **Import**

3. **Verify import successful:**
   - Workflow should appear as "Cayman Islands Registry Scraper & Analysis"
   - All nodes should be visible in the canvas

### Step 2: Configure API Credentials in n8n

#### 1. OpenAI API Key Setup
```bash
# In n8n Cloud:
1. Go to Credentials → New Credential
2. Select "OpenAI API Key"
3. Enter your OpenAI API key
4. Name: "OpenAI API Key"
5. Save credential
```

#### 2. Google Sheets Setup (if not already configured)
```bash
# In n8n Cloud:
1. Go to Credentials → New Credential
2. Select "Google Sheets OAuth2 API"
3. Authenticate with Google account that has access to the sheet
4. Name: "Google Sheets account"
5. Save credential
```

#### 3. Slack OAuth Setup (if not already configured)
```bash
# In n8n Cloud:
1. Go to Credentials → New Credential
2. Select "Slack OAuth2 API"
3. Authenticate with Slack workspace
4. Ensure #tma-intel channel access
5. Name: "Slack account"
6. Save credential
```

### Step 3: Update Credential IDs in Workflow

**Important:** The workflow JSON contains placeholder credential IDs. You need to update these with your actual credential IDs.

1. **Open the workflow in n8n editor**
2. **Click on each credential node** to see current IDs
3. **Update the following in the JSON:**

```json
{
  "credentials": {
    "openAiApi": {
      "id": "YOUR_OPENAI_CREDENTIAL_ID",
      "name": "OpenAI API Key"
    },
    "googleSheetsOAuth2Api": {
      "id": "AN61B811XT6j8wL2",
      "name": "Google Sheets account"
    },
    "slackOAuth2Api": {
      "id": "50evDPBNTBzBSYf0",
      "name": "Slack account"
    }
  }
}
```

### Step 4: Test Individual Components

#### Test 1: Basic Scraping (No PDF Processing)
1. **Temporarily disable** nodes after "Filter New Cases Only"
2. **Execute workflow manually**
3. **Verify outputs:**
   - ✅ "Parse & Filter Petitions" shows extracted cases with `dataVw` and `wpNonce`
   - ✅ "Filter New Cases Only" shows only new cases
   - ✅ Google Sheets logging works

#### Test 2: WordPress AJAX Call
1. **Enable** "Get Box File via WordPress AJAX" node only
2. **Execute workflow**
3. **Verify:**
   - ✅ HTTP request succeeds (status 200)
   - ✅ Response contains `success: true` and `data.fid` + `data.t`

#### Test 3: PDF Download
1. **Enable** through "Download PDF from Box.com"
2. **Execute workflow**
3. **Verify:**
   - ✅ PDF downloads successfully
   - ✅ File appears in binary data

#### Test 4: GPT-4o Vision Analysis
1. **Enable** through "GPT-4o Vision PDF Analysis"
2. **Execute workflow**
3. **Verify:**
   - ✅ OpenAI API call succeeds
   - ✅ Response contains structured analysis
   - ✅ "Parse AI Analysis Results" extracts data correctly

#### Test 5: Full End-to-End Test
1. **Enable all nodes**
2. **Execute complete workflow**
3. **Verify:**
   - ✅ Google Sheets receives new row with all data
   - ✅ Slack receives formatted report
   - ✅ No errors in execution log

## 💰 Cost Estimates

### Monthly Operating Costs (Conservative Estimates)

| Service | Usage | Cost/Month |
|---------|-------|------------|
| **Firecrawl** | 30 scrapes/day × 30 days | $9-15 |
| **OpenAI GPT-4o Vision** | 10 PDFs/day × 30 days × $0.02 | $6-12 |
| **n8n Cloud** | Workflow hosting | $0-20* |
| **Total** | | **$15-47/month** |

*Free tier available for n8n Cloud

### Cost Optimization Tips
- Monitor actual usage in first month
- Batch process multiple cases if volume increases
- Consider GPT-4o mini for simpler documents (cheaper)
- Use webhooks instead of polling if real-time alerts needed

## 🔧 Troubleshooting Guide

### Common Issues & Solutions

#### 1. WordPress AJAX Failures
**Error:** `WordPress AJAX failed for case`
**Solutions:**
- Check if `wpNonce` is being extracted correctly
- Verify `data-vw` attribute format
- Try manual AJAX call with browser dev tools

#### 2. Box.com Download Failures
**Error:** PDF download fails
**Solutions:**
- Check if Box URL is constructed correctly
- Verify token is valid (tokens expire)
- Try downloading manually in browser

#### 3. GPT-4o Vision Timeouts
**Error:** OpenAI API timeout
**Solutions:**
- Reduce `maxTokens` from 2000 to 1500
- Enable longer timeout in OpenAI node settings
- Check PDF file size (<10MB recommended)

#### 4. Google Sheets Permission Errors
**Error:** Sheets API permission denied
**Solutions:**
- Verify service account has edit access to the sheet
- Check sheet is shared with service account email
- Re-authenticate Google Sheets credential

#### 5. Slack Message Failures
**Error:** Slack API errors
**Solutions:**
- Verify bot has access to #tma-intel channel
- Check channel ID is correct (`C09B46WHGBE`)
- Re-authenticate Slack credential

### Debug Mode Instructions

1. **Enable execution logging:**
   ```bash
   # In n8n workflow settings:
   - Enable "Save Successful Executions"
   - Enable "Save Failed Executions"
   - Set log level to "Debug"
   ```

2. **Check execution history:**
   - Go to workflow → Executions tab
   - Click on failed executions for details
   - Check input/output data for each node

3. **Manual testing:**
   - Use "Execute workflow" button for testing
   - Check "Wait for Webhook" for debugging
   - Use "Test step" on individual nodes

## 📊 Monitoring & Maintenance

### Daily Monitoring
1. **Check n8n execution logs** for failures
2. **Monitor Google Sheets** for new entries
3. **Verify Slack reports** are being sent
4. **Track API costs** (OpenAI, Firecrawl)

### Weekly Maintenance
1. **Review execution success rate**
2. **Check for new case types** that might need filtering
3. **Update API rate limits** if hitting quotas
4. **Backup Google Sheets data**

### Monthly Maintenance
1. **Review and optimize costs**
2. **Update dependencies** (n8n nodes, APIs)
3. **Test complete workflow** end-to-end
4. **Review and archive old data** if needed

## 🔄 Workflow Logic Deep Dive

### Data Flow Architecture
```
Registry Page → Firecrawl → Parse Cases → Filter New → WordPress AJAX → Box Download → PDF → GPT-4o Vision → Parse Results → Sheets + Slack
```

### Key Processing Nodes

1. **Parse & Filter Petitions**
   - Extracts `data-vw` button attributes
   - Gets WordPress `ajax_nonce` for authentication
   - Filters for Financial Services petitions only
   - Prioritizes Winding Up petitions

2. **Get Box File via WordPress AJAX**
   - Calls `https://judicial.ky/wp-admin/admin-ajax.php`
   - Sends `action=get_bfile`, `fid=286692767087`, `fname`, `security`
   - Receives Box.com file ID and temporary access token

3. **GPT-4o Vision PDF Analysis**
   - Structured prompt for 5 data extraction points
   - Handles scanned PDF text recognition
   - Returns JSON-formatted analysis

4. **Parse AI Analysis Results**
   - Robust JSON parsing with fallback handling
   - Structures data for Sheets and Slack
   - Error handling for malformed AI responses

## 🚨 Critical Dependencies

### External Services
- **Cayman Islands Registry**: Must remain accessible
- **Box.com CDN**: PDF hosting service
- **WordPress AJAX**: File access mechanism
- **Firecrawl**: JavaScript rendering for scraping

### Failure Points
1. **Registry website changes** (HTML structure, AJAX endpoints)
2. **Box.com URL format changes**
3. **WordPress nonce mechanism updates**
4. **API rate limiting** (OpenAI, Firecrawl)

### Backup Plans
1. **Alternative scraping services** (ScrapingBee if Firecrawl fails)
2. **Manual PDF retrieval** process if Box URLs break
3. **Alternative AI services** (Claude Vision if GPT-4o issues)
4. **Email notifications** as Slack backup

## 📈 Success Metrics

### Performance Targets
- **Execution Time:** <5 minutes for typical daily run
- **Success Rate:** >95% successful case processing
- **Cost Efficiency:** <$0.50 per processed case
- **Data Accuracy:** >90% accurate AI extractions

### Monitoring Dashboard
Consider creating a simple dashboard with:
- Daily execution status
- Cases processed count
- API costs tracking
- Error rate monitoring

## 🎉 Post-Deployment Checklist

- [ ] Workflow imported successfully
- [ ] All API credentials configured
- [ ] Individual component tests passed
- [ ] End-to-end test completed
- [ ] Slack notifications verified
- [ ] Google Sheets logging confirmed
- [ ] Error handling tested
- [ ] Cost monitoring set up
- [ ] Documentation shared with team

## 📞 Support & Maintenance

For ongoing support:
1. **Monitor n8n execution logs** regularly
2. **Track API costs** via service dashboards
3. **Update credentials** before expiration
4. **Test workflow** after any external service changes

**Estimated Setup Time:** 2-3 hours
**Estimated Monthly Cost:** $15-47
**Maintenance Time:** 15-30 minutes/week

---

*This workflow represents a sophisticated automation that handles complex web scraping, AI document analysis, and multi-platform integration. Regular monitoring and occasional updates will ensure continued reliable operation.*
