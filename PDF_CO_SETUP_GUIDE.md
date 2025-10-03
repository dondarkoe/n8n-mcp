# PDF.co API Setup Guide for Gazette Scraper

## 🚀 **QUICK SETUP STEPS**

### **Step 1: Get PDF.co API Key**
1. **Go to**: https://pdf.co
2. **Sign up** for free account
3. **Get API key** from dashboard
4. **Free tier**: 1000 pages/month

### **Step 2: No PDF.co Node Installation Needed**
- **We use HTTP Request** instead of a dedicated PDF.co node
- **HTTP Request** calls PDF.co API directly
- **No additional node installation** required

### **Step 3: Import and Configure Workflow**
1. **Import**: `PDF-Optimized Gazette Scraper.json`
2. **Update API key**: Replace `YOUR_PDF_CO_API_KEY` with your actual API key
3. **Test the workflow**

## 🔧 **WORKFLOW STRUCTURE**

```
1. Schedule Trigger → Every Friday
2. Determine Gazette Type → Check date
3. Fetch Gazette Page → Get HTML
4. Extract PDF Link → Find latest PDF
5. Download PDF → Get PDF file
6. Extract PDF Text → PDF.co API
7. Filter Liquidation Section → Extract relevant part
8. Parse Company Details → Extract company data
9. Get Existing Data → Check Google Sheets
10. Filter New Companies → Remove duplicates
11. Format Report → Create report
12. Append to Google Sheet → Save data
```

## ✅ **BENEFITS OF PDF.co**

- **Handles large PDFs** (200+ pages)
- **No file size limits** like Firecrawl
- **Accurate text extraction** from complex layouts
- **Free tier** (1000 pages/month)
- **Reliable processing** for government documents

## 🎯 **NEXT STEPS**

1. **Sign up for PDF.co** and get API key
2. **Install PDF.co node** in n8n
3. **Create credentials** with your API key
4. **Import the updated workflow**
5. **Test with real Cayman gazette PDF**

## 📊 **EXPECTED RESULTS**

- **Real PDF text extraction** from Cayman gazettes
- **Accurate liquidation data** parsing
- **Reliable processing** of large files
- **No more Firecrawl 400 errors**

The workflow is now optimized for large PDF processing! 🚀
