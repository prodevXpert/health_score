import { Controller, Get, Header } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Header('Content-Type', 'text/html')
  getServerInfo() {
    return this.getHtmlPage();
  }

  @Get('health')
  healthCheck() {
    return { status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() };
  }

  private getHtmlPage() {
    const currentDate = new Date().toLocaleString();
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HealthScore Bureau API</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh; padding: 20px; color: #333;
        }
        .container { max-width: 1200px; margin: 0 auto; }
        .header {
            background: white; border-radius: 15px; padding: 40px; margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2); text-align: center;
        }
        .header h1 { color: #667eea; font-size: 2.5em; margin-bottom: 10px; }
        .status {
            display: inline-block; background: #10b981; color: white;
            padding: 8px 20px; border-radius: 20px; font-weight: 600; margin-top: 10px;
        }
        .version { color: #666; margin-top: 10px; }
        .grid {
            display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px; margin-bottom: 30px;
        }
        .card {
            background: white; border-radius: 15px; padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .card h2 {
            color: #667eea; margin-bottom: 20px; font-size: 1.5em;
            border-bottom: 3px solid #667eea; padding-bottom: 10px;
        }
        .card h3 { color: #764ba2; margin-top: 20px; margin-bottom: 10px; font-size: 1.2em; }
        .endpoint-list { list-style: none; }
        .endpoint-list li {
            padding: 12px; margin: 8px 0; background: #f3f4f6;
            border-radius: 8px; border-left: 4px solid #667eea;
        }
        .endpoint-list li a { color: #667eea; text-decoration: none; font-weight: 600; }
        .endpoint-list li a:hover { text-decoration: underline; }
        .feature-list { list-style: none; }
        .feature-list li { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
        .feature-list li:before { content: "✓ "; color: #10b981; font-weight: 700; margin-right: 8px; }
        .score-category { background: #f9fafb; padding: 15px; border-radius: 8px; margin: 10px 0; }
        .score-category .total { font-size: 1.5em; color: #667eea; font-weight: 700; }
        .subcategory {
            display: flex; justify-content: space-between;
            padding: 8px 0; border-bottom: 1px solid #e5e7eb;
        }
        .interpretation {
            display: flex; align-items: center; padding: 12px;
            margin: 8px 0; border-radius: 8px; background: #f9fafb;
        }
        .badge {
            min-width: 80px; padding: 5px 10px; border-radius: 5px;
            text-align: center; font-weight: 700; color: white; margin-right: 15px;
        }
        .badge.blue { background: #3b82f6; }
        .badge.green { background: #10b981; }
        .badge.orange { background: #f59e0b; }
        .badge.red { background: #ef4444; }
        .cta-button {
            display: inline-block; background: #667eea; color: white;
            padding: 15px 30px; border-radius: 8px; text-decoration: none;
            font-weight: 600; margin: 10px 10px 10px 0; transition: all 0.3s;
        }
        .cta-button:hover {
            background: #764ba2; transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
        .footer { text-align: center; color: white; margin-top: 30px; padding: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏥 HealthScore Bureau API</h1>
            <div class="status">● Server Running</div>
            <p class="version">Version 1.0.0 | ${currentDate}</p>
            <div style="margin-top: 20px;">
                <a href="/api" class="cta-button">📚 API Documentation</a>
                <a href="/health" class="cta-button">🔍 Health Check</a>
            </div>
        </div>

        <div class="grid">
            <div class="card">
                <h2>🔗 API Endpoints</h2>
                <ul class="endpoint-list">
                    <li><a href="/api">/api</a> - Interactive API Documentation (Swagger)</li>
                    <li><a href="/health">/health</a> - Health Check</li>
                    <li>/auth/register - Register New User</li>
                    <li>/auth/login - User Login</li>
                    <li>/auth/profile - Get User Profile</li>
                    <li>/users/me - Current User Details</li>
                    <li>/health-data - Health Data Management</li>
                </ul>
            </div>

            <div class="card">
                <h2>✨ Key Features</h2>
                <ul class="feature-list">
                    <li>JWT Authentication</li>
                    <li>Comprehensive Health Scoring (100 points)</li>
                    <li>Clinical/Vitals Assessment (30 points)</li>
                    <li>Laboratory/Biomarkers Analysis (50 points)</li>
                    <li>Lifestyle & Preventive Care (20 points)</li>
                    <li>Auto BMI & eGFR Calculation</li>
                    <li>Score Interpretation & Color Coding</li>
                    <li>PostgreSQL Database</li>
                </ul>
            </div>
        </div>

        <div class="card">
            <h2>📊 Scoring System Breakdown</h2>

            <div class="score-category">
                <h3>Clinical/Vitals Category</h3>
                <div class="total">30 Points Total</div>
                <div class="subcategory"><span>Anthropometry (BMI, Waist)</span><strong>10 pts</strong></div>
                <div class="subcategory"><span>Blood Pressure</span><strong>10 pts</strong></div>
                <div class="subcategory"><span>Heart & Cardio (HR, ECG)</span><strong>10 pts</strong></div>
            </div>

            <div class="score-category">
                <h3>Laboratory/Biomarkers Category</h3>
                <div class="total">50 Points Total</div>
                <div class="subcategory"><span>Glycemic Control (FPG, HbA1c)</span><strong>8 pts</strong></div>
                <div class="subcategory"><span>Lipid Profile (LDL, HDL, TG)</span><strong>8 pts</strong></div>
                <div class="subcategory"><span>Renal Function (Creatinine, eGFR)</span><strong>6 pts</strong></div>
                <div class="subcategory"><span>Liver Function (ALT, AST, Bilirubin)</span><strong>6 pts</strong></div>
                <div class="subcategory"><span>Hematology (Hemoglobin, WBC, Platelets)</span><strong>6 pts</strong></div>
                <div class="subcategory"><span>Thyroid Function (TSH)</span><strong>6 pts</strong></div>
                <div class="subcategory"><span>Inflammation (CRP)</span><strong>5 pts</strong></div>
                <div class="subcategory"><span>Vitamins (D, B12)</span><strong>5 pts</strong></div>
            </div>

            <div class="score-category">
                <h3>Lifestyle & Preventive Category</h3>
                <div class="total">20 Points Total</div>
                <div class="subcategory"><span>Smoking Status</span><strong>5 pts</strong></div>
                <div class="subcategory"><span>Alcohol Consumption</span><strong>3 pts</strong></div>
                <div class="subcategory"><span>Physical Activity</span><strong>5 pts</strong></div>
                <div class="subcategory"><span>Diet Quality</span><strong>4 pts</strong></div>
                <div class="subcategory"><span>Preventive Care</span><strong>3 pts</strong></div>
            </div>
        </div>

        <div class="card">
            <h2>🎯 Score Interpretation Bands</h2>

            <div class="interpretation">
                <div class="badge blue">85-100</div>
                <div>
                    <strong>Excellent Health</strong>
                    <p style="color: #666; margin-top: 5px;">Outstanding health metrics across all categories</p>
                </div>
            </div>

            <div class="interpretation">
                <div class="badge green">70-84</div>
                <div>
                    <strong>Good Health</strong>
                    <p style="color: #666; margin-top: 5px;">Generally healthy with minor areas for improvement</p>
                </div>
            </div>

            <div class="interpretation">
                <div class="badge orange">50-69</div>
                <div>
                    <strong>Fair Health</strong>
                    <p style="color: #666; margin-top: 5px;">Needs improvement in several health areas</p>
                </div>
            </div>

            <div class="interpretation">
                <div class="badge red">0-49</div>
                <div>
                    <strong>Needs Attention</strong>
                    <p style="color: #666; margin-top: 5px;">Requires immediate medical attention and lifestyle changes</p>
                </div>
            </div>
        </div>

        <div class="footer">
            <p>💾 Database: PostgreSQL (health_score) | 🔐 Authentication: JWT Bearer Token</p>
            <p style="margin-top: 10px;">© 2025 HealthScore Bureau API - Comprehensive Health Assessment System</p>
        </div>
    </div>
</body>
</html>`;
  }
}
