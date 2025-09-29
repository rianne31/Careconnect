# 🏥 **CARECONNECT PEDIATRIC CANCER AI DEMO GUIDE**

## **Overview**
This guide shows you how to manually demonstrate the AI-powered features of Careconnect, specifically designed for **pediatric cancer patients and their families**. Each step is designed to showcase how AI helps children with cancer find the support they need.

---

## 🚀 **PREREQUISITES**

### **1. Start the Django Server**
```powershell
cd "C:\Users\Ramir Santos\Downloads\Careconnect-main"
venv\Scripts\activate
python manage.py runserver
```

### **2. Access Admin Panel**
- **URL**: `http://127.0.0.1:8000/admin/`
- **Login**: `admin` / `admin123`

---

## 🧠 **STEP 1: PEDIATRIC CANCER PATIENT AI ANALYSIS**

### **1.1 Create a Pediatric Cancer Patient**
1. **In admin**, go to: `API` → `Patient profiles` → `Add patient profile`
2. **Fill in pediatric cancer details**:
   - **Code**: `DEMO001`
   - **Age**: `6` (school-age child)
   - **Diagnosis**: `Acute Lymphoblastic Leukemia (ALL) - High Risk Group`
   - **Needs**: `Financial support for chemotherapy treatments, family counseling services, transportation to children's hospital, educational support during treatment, comfort toys and books for hospital stays, sibling support programs`
3. **Click Save**

### **1.2 Manually Trigger AI Analysis**
1. **Copy the patient ID** from admin
2. **Open a new terminal** and run:
```powershell
# Get JWT token first (PowerShell syntax)
Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/token/" -Method POST -Body "username=admin&password=admin123" -ContentType "application/x-www-form-urlencoded"

# Copy the access token from the response
# Then analyze the pediatric patient (replace <PATIENT_ID> and <TOKEN>)
Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/ai/analysis/<PATIENT_ID>/analyze-patient/" -Method POST -Headers @{"Authorization"="Bearer <TOKEN>"}
```

**For Windows users:** Use the PowerShell commands above instead of curl.
**For Unix/Linux/Mac users:** Use the original curl commands.

### **1.3 Check Pediatric AI Results**
1. **Go back to admin**: `API` → `Patient profiles`
2. **Click on your patient** `DEMO001`
3. **Verify pediatric AI fields**:
   - **AI Priority**: Should show "Critical Pediatric" (18 characters - fits perfectly!)
   - **AI Needs Tags**: Should show `["leukemia", "family", "financial", "chemotherapy", "toddler", "pediatric"]`
   - **AI Urgency Score**: Should show `100` (maximum urgency for critical pediatric cases)
   - **AI Analysis Confidence**: Should show `0.90` (90% confidence in AI analysis)

### **1.4 Show Pediatric Cancer Recommendations**
The AI should have generated these specific recommendations:
- "Contact pediatric oncology team at children's hospital"
- "Connect with pediatric cancer support organizations"
- "Join leukemia support groups for children and families"
- "Contact Leukemia & Lymphoma Society for pediatric resources"
- "Prepare for pediatric chemotherapy side effects"
- "Connect with other families going through chemo"
- "Seek family counseling and support groups"
- "Connect with other pediatric cancer families"

### **1.5 Interpret AI Analysis Results**
**What the AI Analysis Shows:**
- **Priority**: "Critical Pediatric" - The AI correctly identified this as a high-priority pediatric cancer case
- **Tags**: The AI extracted 6 relevant tags from the patient's diagnosis and needs:
  - `leukemia` - Cancer type identification
  - `family` - Family support needs
  - `financial` - Financial assistance requirements
  - `chemotherapy` - Treatment type recognition
  - `toddler` - Age-appropriate categorization
  - `pediatric` - Pediatric focus confirmation
- **Urgency Score**: 100/100 - Maximum urgency due to leukemia diagnosis and young age
- **Confidence**: 0.90 (90%) - High confidence in AI analysis accuracy
- **Recommendations**: 8 specific, actionable recommendations for this patient

**This demonstrates the AI's ability to:**
1. **Understand medical terminology** (leukemia, chemotherapy)
2. **Identify support needs** (family, financial)
3. **Assess urgency** based on cancer type and age
4. **Generate specific recommendations** for pediatric cancer patients
5. **Provide family-focused support** suggestions

---

## 🏷️ **STEP 2: AGE-APPROPRIATE AUCTION AI CATEGORIZATION**

### **2.1 Create a Pediatric Cancer Auction Item**
1. **In admin**, go to: `API` → `Auction items` → `Add auction item`
2. **Fill in pediatric-focused details**:
   - **Title**: `Comfort Care Package for Pediatric Cancer Patients (Ages 6-12)`
   - **Description**: `Complete comfort package including age-appropriate educational toys, art supplies, coloring books, comfort blanket, and hospital-friendly activities designed specifically for school-age pediatric cancer patients. All items are hypoallergenic, hospital-safe, and approved for children undergoing cancer treatment. Includes learning materials to help maintain education during hospital stays.`
   - **Starting bid**: `95.00`
   - **Status**: `Open`
   - **Ends at**: Set to tomorrow's date
   - **Owner**: Select your admin user
3. **Click Save**

### **2.2 Manually Trigger AI Categorization**
1. **Copy the auction ID**
2. **In terminal**, run:
```powershell
curl -X POST "http://127.0.0.1:8000/api/ai/analysis/<AUCTION_ID>/categorize-auction/" \
  -H "Authorization: Bearer <TOKEN>"
```

### **2.3 Check Pediatric AI Results**
1. **Go back to admin**: `API` → `Auction items`
2. **Click on your auction item**
3. **Verify pediatric AI fields**:
   - **AI Category**: Should show "School Age" or "Comfort Items"
   - **AI Tags**: Should show `["pediatric", "school age", "comfort items", "educational", "toy", "book"]`
   - **AI Relevance Score**: Should show `90` or higher
   - **AI Categorization Confidence**: Should show `0.92`
   - **Age Range**: Should show "3-12 years"
   - **Pediatric Appropriate**: Should show "True"

### **2.4 Show Pediatric Matching Suggestions**
The AI should suggest:
- "Add more specific pediatric cancer details to improve categorization"
- "Include age-appropriate information and safety details"
- "Specify age range and safety certifications"
- "Include how the item provides comfort during treatment"

---

## 🤖 **STEP 3: PEDIATRIC CANCER AI RECOMMENDATIONS**

### **3.1 Generate Pediatric Recommendations**
1. **In terminal**, run:
```powershell
curl -X POST "http://127.0.0.1:8000/api/ai/recommendations/generate/" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": <PATIENT_ID>,
    "limit": 5,
    "recommendation_type": "all"
  }'
```

### **3.2 Check Pediatric Cancer Recommendations**
The response should include:
- **Patient Recommendations**: Leukemia & Lymphoma Society, pediatric oncology teams
- **Family Support Recommendations**: Family counseling, sibling support programs
- **Donor Recommendations**: Age-appropriate auction items
- **Pediatric Focus**: `true`
- **Matching Score**: Higher score for pediatric-appropriate items

### **3.3 View Stored Recommendations**
1. **In admin**, go to: `API` → `AI recommendations`
2. **Look for pediatric cancer records**:
   - Recommendation types: `patient`, `family`, `matching`
   - Titles mentioning pediatric cancer
   - High relevance scores for pediatric items

---

## 🔍 **STEP 4: PEDIATRIC AI TAGS EXPLORATION**

### **4.1 View Popular Pediatric Cancer Tags**
1. **In terminal**, run:
```powershell
curl -X GET "http://127.0.0.1:8000/api/ai/tags/popular/" \
  -H "Authorization: Bearer <TOKEN>"
```

### **4.2 View Pediatric-Specific Tags**
1. **In terminal**, run:
```powershell
curl -X GET "http://127.0.0.1:8000/api/ai/tags/category/patient_needs/" \
  -H "Authorization: Bearer <TOKEN>"
```

### **4.3 Check Tag Categories**
Look for tags like:
- `pediatric` (always present)
- `leukemia`, `brain tumor`, `sarcoma`
- `chemotherapy`, `radiation`, `surgery`
- `family`, `sibling`, `educational`
- `infant`, `toddler`, `child`, `adolescent`

---

## 🚀 **STEP 5: PEDIATRIC CANCER BULK AI ANALYSIS**

### **5.1 Create Multiple Pediatric Cancer Patients**
1. **Create Patient 2**:
   - **Code**: `DEMO002`
   - **Age**: `3` (toddler)
   - **Diagnosis**: `Medulloblastoma brain tumor - Post-surgery`
   - **Needs**: `Radiation therapy support, family accommodation near hospital, comfort items for toddlers, sibling support programs`

2. **Create Patient 3**:
   - **Code**: `DEMO003`
   - **Age**: `15` (adolescent)
   - **Diagnosis**: `Ewing Sarcoma - Stage 3`
   - **Needs**: `Aggressive chemotherapy, teen support groups, family financial assistance, educational support during treatment`

### **5.2 Create Age-Appropriate Auction Items**
1. **Create Auction 2**:
   - **Title**: `Toddler Comfort Package (Ages 2-5)`
   - **Description**: `Soft plush toys, baby books, comfort blanket for toddlers with cancer`

2. **Create Auction 3**:
   - **Title**: `Teen Cancer Support Package (Ages 13-18)`
   - **Description**: `Journaling supplies, teen books, technology accessories for adolescent cancer patients`

### **5.3 Run Bulk Pediatric Analysis**
1. **Get all IDs** from admin
2. **In terminal**, run:
```powershell
curl -X POST "http://127.0.0.1:8000/api/ai/analysis/bulk-analyze/" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "patient_ids": [<PATIENT_ID_1>, <PATIENT_ID_2>, <PATIENT_ID_3>],
    "auction_item_ids": [<AUCTION_ID_1>, <AUCTION_ID_2>, <AUCTION_ID_3>],
    "force_reanalysis": false
  }'
```

### **5.4 Check Bulk Results**
The response should show:
- **Patients Analyzed**: 3 (all pediatric cancer patients)
- **Auctions Categorized**: 3 (all age-appropriate items)
- **Pediatric Focus**: All items marked as pediatric-appropriate

---

## 🎯 **STEP 6: PEDIATRIC CANCER PATIENT-DONOR MATCHING**

### **6.1 Get Patient-Donor Matches**
1. **In terminal**, run:
```powershell
curl -X GET "http://127.0.0.1:8000/api/ai/recommendations/matching/<PATIENT_ID>/" \
  -H "Authorization: Bearer <TOKEN>"
```

### **6.2 Check Matching Results**
The response should show:
- **Matching Score**: Higher for pediatric-appropriate items
- **Recommendations**: Age-appropriate auction items
- **Pediatric Focus**: `true` for all recommendations
- **Age Range**: Appropriate for the patient's age group

---

## 🏥 **DEMO HIGHLIGHTS FOR PANELISTS**

### **Key Pediatric Cancer AI Features to Showcase:**

1. **Age-Appropriate Analysis**
   - Show how AI identifies different age groups (infant, toddler, child, adolescent)
   - Demonstrate age-specific urgency scoring
   - Highlight pediatric cancer type identification

2. **Family-Focused Support**
   - Show family support recommendations
   - Highlight sibling support programs
   - Demonstrate family counseling services

3. **Pediatric Cancer Expertise**
   - Show cancer type identification (leukemia, brain tumor, sarcoma)
   - Demonstrate treatment-specific recommendations
   - Highlight pediatric oncology connections

4. **Age-Appropriate Matching**
   - Show how AI matches patients with age-appropriate items
   - Demonstrate pediatric medical equipment categorization
   - Highlight comfort item matching for different age groups

5. **Comprehensive Support**
   - Show financial assistance recommendations
   - Highlight transportation and accommodation support
   - Demonstrate educational support during treatment

---

## 🎬 **DEMO SCRIPT FOR PANELISTS**

### **Opening (2 minutes)**
"Welcome to Careconnect, the world's first AI-powered donation platform specifically designed for pediatric cancer patients. Today, I'll show you how our AI helps children with cancer find the support they need."

### **Patient Analysis Demo (3 minutes)**
"Let me show you how our AI analyzes a 6-year-old leukemia patient. Notice how it automatically identifies the cancer type, assigns pediatric-appropriate priority, and generates family-focused recommendations."

### **Auction Categorization Demo (2 minutes)**
"Now watch as our AI categorizes age-appropriate comfort items. It automatically identifies pediatric focus, age ranges, and provides suggestions for better matching."

### **Recommendations Demo (2 minutes)**
"See how our AI generates comprehensive recommendations, including family support, sibling programs, and age-appropriate resources."

### **Matching Demo (2 minutes)**
"Finally, watch how our AI matches pediatric cancer patients with the most appropriate support items, considering age, cancer type, and family needs."

### **Closing (1 minute)**
"This platform represents the future of pediatric cancer care - where AI ensures every child gets the right support at the right time. Thank you for your attention."

---

## 🚨 **TROUBLESHOOTING**

### **Common Issues:**
1. **Authentication Failed**: Check admin credentials
2. **Patient Not Found**: Verify patient ID in admin
3. **Analysis Failed**: Ensure patient has diagnosis and needs filled
4. **Categorization Failed**: Ensure auction item has title and description

### **Emergency Demo Mode:**
If something fails, you can still show:
- Admin panel with pediatric cancer patients
- AI fields already populated
- Sample recommendations and tags
- Database structure and models

---

## 🎉 **SUCCESS METRICS**

### **What Panelists Should See:**
- ✅ Pediatric cancer patients automatically categorized
- ✅ Age-appropriate priority assessment
- ✅ Cancer type identification
- ✅ Family support recommendations
- ✅ Age-appropriate auction categorization
- ✅ High matching scores for pediatric items
- ✅ Comprehensive pediatric cancer support

### **Key Talking Points:**
- **Innovation**: First AI platform for pediatric cancer
- **Impact**: Helps children find age-appropriate support
- **Family Focus**: Supports entire family, not just patient
- **Scalability**: Can handle thousands of pediatric cases
- **Future**: Foundation for advanced pediatric oncology AI

---

**🎯 This demo showcases how AI can transform pediatric cancer care by ensuring every child gets the right support at the right time!**
