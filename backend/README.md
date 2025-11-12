# HealthScore Bureau - Backend API

## Overview
NestJS-based REST API for the HealthScore Bureau application with comprehensive health scoring algorithms.

## Features
- ✅ JWT Authentication & Authorization
- ✅ PostgreSQL Database with TypeORM
- ✅ Comprehensive Health Scoring Algorithm (100 points total)
  - Clinical/Vitals: 30 points
  - Laboratory/Biomarkers: 50 points
  - Lifestyle & Preventive: 20 points
- ✅ Auto-calculation of BMI and eGFR
- ✅ Score interpretation (Excellent/Good/Fair/Needs Attention)
- ✅ RESTful API endpoints
- ✅ Input validation with class-validator

## Tech Stack
- **Framework:** NestJS 11.x
- **Database:** PostgreSQL
- **ORM:** TypeORM 0.3.x
- **Authentication:** JWT (Passport)
- **Validation:** class-validator, class-transformer

## Installation

```bash
# Install dependencies
npm install

# Set up environment variables
# Edit .env file with your database credentials

# Build the project
npm run build

# Start development server
npm run start:dev

# Start production server
npm run start:prod
```

## Environment Variables

```env
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=devxpert
DB_NAME=health_score
JWT_SECRET=healthscore-secret-key-change-in-production
PORT=3001
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get current user profile (protected)

### Users
- `GET /users/me` - Get current user details (protected)
- `PATCH /users/me` - Update user profile (protected)

### Health Data
- `POST /health-data` - Create new health data entry (protected)
- `GET /health-data` - Get all health data for current user (protected)
- `GET /health-data/latest` - Get latest health data (protected)
- `GET /health-data/:id` - Get specific health data entry (protected)
- `GET /health-data/:id/score-breakdown` - Get detailed score breakdown (protected)
- `PATCH /health-data/:id` - Update health data entry (protected)
- `DELETE /health-data/:id` - Delete health data entry (protected)

## Health Scoring Algorithm

### Clinical/Vitals Category (0-30 points)

#### A. Anthropometry (0-10 points)
- BMI scoring based on Asian/Indian population standards
- Waist circumference risk assessment
- Gender-specific thresholds

#### B. Blood Pressure (0-10 points)
- Normal: <120/80 mmHg (10 points)
- Elevated: 120-129/<80 (7 points)
- Stage 1 Hypertension: 130-139/80-89 (4 points)
- Stage 2 Hypertension: ≥140/≥90 (0 points)

#### C. Heart & Cardio (0-10 points)
- Resting heart rate assessment
- ECG findings consideration

### Laboratory/Biomarkers Category (0-50 points)

#### A. Glycemic Control (0-10 points)
- Fasting Plasma Glucose
- HbA1c levels

#### B. Lipid Profile (0-10 points)
- LDL, HDL, Triglycerides
- Gender-specific HDL targets

#### C. Renal Function (0-6 points)
- eGFR (auto-calculated using CKD-EPI equation)
- Urine ACR

#### D. Liver Function (0-6 points)
- ALT, AST, ALP, Total Bilirubin

#### E. Hematology/CBC (0-6 points)
- Hemoglobin, WBC, Platelets
- Gender-specific ranges

#### F. Thyroid (0-4 points)
- TSH, Free T4

#### G. Inflammation/Cardiac Risk (0-4 points)
- hs-CRP, NT-proBNP

#### H. Vitamins/Micronutrients (0-4 points)
- Vitamin D, B12, Urinalysis

### Lifestyle & Preventive Category (0-20 points)

#### A. Smoking & Tobacco (0-5 points)
#### B. Alcohol Use (0-3 points)
#### C. Physical Activity (0-5 points)
#### D. Diet Quality (0-4 points)
#### E. Preventive Care (0-3 points)

## Score Interpretation Bands

- **85-100:** Excellent (Blue #0070C0)
- **70-84:** Good (Green #4CAF50)
- **50-69:** Fair (Orange #FF9800)
- **0-49:** Needs Attention (Red #F44336)

## Database Schema

### Users Table
- id (UUID, PK)
- email (unique)
- password (hashed)
- fullName
- phone
- dateOfBirth
- gender (M/F/O)
- city
- profilePhoto
- isActive
- createdAt, updatedAt

### Health Data Table
- id (UUID, PK)
- userId (FK to Users)
- testDate
- All clinical measurements
- All laboratory values
- All lifestyle data
- Calculated scores (clinical, lab, lifestyle, overall)
- scoreInterpretation
- createdAt, updatedAt

## Auto-Calculations

1. **BMI:** Automatically calculated from height and weight
2. **eGFR:** Calculated using CKD-EPI equation from creatinine, age, and gender
3. **Scores:** All category and overall scores calculated automatically on create/update

## Development

```bash
# Watch mode
npm run start:dev

# Build
npm run build

# Format code
npm run format
```

## API Usage Example

### Register User
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "fullName": "John Doe",
    "dateOfBirth": "1990-01-01",
    "gender": "M",
    "city": "Mumbai"
  }'
```

### Create Health Data
```bash
curl -X POST http://localhost:3001/health-data \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "testDate": "2025-11-12",
    "height": 175,
    "weight": 70,
    "waistCircumference": 85,
    "systolicBP": 120,
    "diastolicBP": 80,
    "restingHeartRate": 72,
    "fastingGlucose": 95,
    "hba1c": 5.5,
    "ldlCholesterol": 100,
    "hdlCholesterol": 50,
    "triglycerides": 140,
    "smokingStatus": "Never smoker",
    "alcoholUse": "Low",
    "physicalActivityMinutes": 180,
    "fruitsVegetablesServings": 5,
    "processedFoodFrequency": "Low",
    "screeningsUpToDate": true
  }'
```

## License
MIT

