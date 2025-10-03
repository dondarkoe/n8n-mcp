# PDF4.me API Setup Guide for Gazette Scraper

## 🚀 **QUICK SETUP STEPS**

### **Step 1: Get PDF4.me API Key**
1. **Go to**: https://pdf4me.com
2. **Sign up** for free account
3. **Get API key** from dashboard
4. **Free tier**: 1000 pages/month (better than PDF.co!)

### **Step 2: Install PDF4.me n8n Node**
1. **Open n8n**: http://localhost:5678
2. **Go to Settings** → **Community Nodes**
3. **Search**: "PDF4.me" or "pdf4me"
4. **Install**: "n8n-nodes-pdf4me"
5. **Reload** n8n editor

### **Step 3: Create PDF4.me Credentials**
1. **Go to Credentials** in n8n
2. **Click "New"**
3. **Select "PDF4.me Api"**
4. **Enter your API key**
5. **Name**: "PDF4.me API"
6. **Save**

### **Step 4: Import and Configure Workflow**
1. **Import**: `PDF-Optimized Gazette Scraper.json`
2. **Select credentials** in the PDF4.me node
3. **Test the workflow**

## 🔧 **WORKFLOW STRUCTURE**

```
1. Schedule Trigger → Every Friday
2. Determine Gazette Type → Check date
3. Fetch Gazette Page → Get HTML
4. Extract PDF Link → Find latest PDF
5. Download PDF → Get PDF file
6. Extract PDF Text → PDF4.me API
7. Filter Liquidation Section → Extract relevant part
8. Parse Company Details → Extract company data
9. Get Existing Data → Check Google Sheets
10. Filter New Companies → Remove duplicates
11. Format Report → Create report
12. Append to Google Sheet → Save data
```

## ✅ **BENEFITS OF PDF4.me**

- **Better pricing** than PDF.co
- **Handles large PDFs** (200+ pages)
- **No file size limits** like Firecrawl
- **Accurate text extraction** from complex layouts
- **Free tier** (1000 pages/month)
- **Reliable processing** for government documents
- **Better API documentation**

## 🎯 **API CONFIGURATION**

**Endpoint**: `https://api.pdf4me.com/v1/ExtractText`
**Method**: POST
**Headers**:
- `Content-Type: application/json`
- `Authorization: Bearer YOUR_PDF4ME_API_KEY`

**Body**:
```json
{
  "url": "{{ $json.pdfUrl }}",
  "inline": true
}
```

## 📊 **EXPECTED RESULTS**

- **Real PDF text extraction** from Cayman gazettes
- **Accurate liquidation data** parsing
- **Reliable processing** of large files
- **No more Firecrawl 400 errors**
- **Better performance** than PDF.co

## 🚀 **NEXT STEPS**

1. **Sign up for PDF4.me** and get API key
2. **Import the updated workflow**
3. **Replace `YOUR_PDF4ME_API_KEY`** with your actual API key
4. **Test with real Cayman gazette PDF**

The workflow is now optimized for PDF4.me! 🎯
