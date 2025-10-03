# Registry Workflow - PDF Extraction Fix

## Problem
The "Scrape for PDF Link" node is getting the wrong URL (Microsoft Edge download link) because the website uses JavaScript buttons with `data-vw` attributes, not direct PDF links.

## Solution Summary
Call the WordPress AJAX endpoint directly with the extracted `data-vw` button value and WordPress nonce to get Box.com file access.

## Manual Fix Instructions

### Step 1: Update "Parse & Filter Petitions1" Code

**Add** this function to extract `data-vw` attribute:

```javascript
// UPDATED Parse & Filter Petitions code
const md = $json?.data?.markdown || "";
const html = $json?.data?.html || "";

// Extract WordPress nonce for later use
const nonceMatch = html.match(/ajax_nonce["'\s:]+["']([a-f0-9]+)["']/i);
const wpNonce = nonceMatch ? nonceMatch[1] : null;

// Function to extract data-vw from button
function getButtonDataVw(cause) {
  if (!cause) return null;
  const idx = html.indexOf(cause);
  if (idx === -1) return null;

  const start = html.lastIndexOf("<tr", idx);
  const end = html.indexOf("</tr>", idx);
  if (start === -1 || end === -1) return null;

  const row = html.slice(start, end + 5);
  const vwMatch = row.match(/data-vw="([^"]+)"/i);
  return vwMatch ? vwMatch[1] : null;
}

// Parse markdown table rows
const lines = md.split("\n").filter(l => l.startsWith("|"));
if (lines.length < 2) return [];

const dataLines = lines.filter(l => !l.includes("---")).slice(1);

// Build case objects with data-vw codes
const cases = dataLines.map(row => {
  const cols = row.split("|").map(c => c.trim());
  const causeNumber = cols[1] || "";
  const filingDate = cols[2] || "";
  const title = cols[3] || "";
  const subject = cols[4] || "";
  const register = cols[5] || "";
  const dataVw = getButtonDataVw(causeNumber);

  return { causeNumber, filingDate, title, subject, register, dataVw, wpNonce };
});

// Filter for Financial Services + Petitions
let petitions = cases.filter(c => {
  const subject = (c.subject || "").toLowerCase();
  const register = (c.register || "").toLowerCase();
  
  const isFinancialServices = register.includes("financial") && !register.includes("family");
  const isTargetPetition = subject.includes("winding up") || subject.includes("petition");
  
  return isFinancialServices && isTargetPetition && c.dataVw;
});

// Sort by priority
petitions.sort((a, b) => {
  const aIsWindingUp = (a.subject || "").toLowerCase().includes("winding up");
  const bIsWindingUp = (b.subject || "").toLowerCase().includes("winding up");
  if (aIsWindingUp && !bIsWindingUp) return -1;
  if (!aIsWindingUp && bIsWindingUp) return 1;
  return 0;
});

return petitions.map(c => ({ json: c }));
```

### Step 2: Delete "Scrape for PDF Link" Node
This Firecrawl node is no longer needed.

### Step 3: Replace "Find PDF Link" with HTTP Request Node

**Node Configuration**:
- **Name**: "Get Box File via WordPress"
- **Method**: POST
- **URL**: `https://judicial.ky/wp-admin/admin-ajax.php`
- **Send Body**: ON
- **Body Content Type**: Form-Data
- **Body Parameters**:
  - `action`: `get_bfile`
  - `fid`: `286692767087`
  - `fname`: `={{ $json.dataVw }}`
  - `security`: `={{ $json.wpNonce }}`

### Step 4: Add Code Node After WordPress Call

**Name**: "Extract Box Download URL"

```javascript
// Extract Box.com download URL from WordPress response
const caseData = $('Filter New Cases Only1').item.json;
const response = $json;

if (!response.success || !response.data) {
  console.log('WordPress API response:', JSON.stringify(response));
  throw new Error(`WordPress API failed for case ${caseData.causeNumber}`);
}

const boxFileId = response.data.fid;
const token = response.data.t;

// Construct Box.com download URL  
const downloadUrl = `https://api.box.com/2.0/files/${boxFileId}/content?access_token=${token}`;

return [{
  json: {
    ...caseData,
    pdfUrl: downloadUrl,
    boxFileId: boxFileId
  }
}];
```

### Step 5: Update Connections

**Flow should be**:
```
Any New Cases?1 
  → Get Box File via WordPress 
  → Extract Box Download URL 
  → Download PDF File 
  → Extract PDF Text1
  → (rest of workflow)
```

## Why This Works

1. **Extracts data-vw**: Gets button value like "FSD2025027209292025PFS"
2. **Extracts nonce**: Gets WordPress security token from page
3. **Calls WordPress**: Same endpoint the website uses
4. **Gets Box.com access**: Returns file ID + temporary token
5. **Downloads PDF**: Direct from Box.com

## Testing

1. Execute workflow manually
2. Check "Parse & Filter Petitions1" output has `dataVw` and `wpNonce` fields
3. Check "Get Box File via WordPress" returns Box.com file data
4. Verify PDF downloads successfully

## If It Still Fails

The WordPress nonce may have session/IP restrictions. In that case, you'll need ScrapingBee ($49/month) which handles JavaScript execution and authentication automatically.
