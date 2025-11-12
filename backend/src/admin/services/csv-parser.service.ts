import { Injectable, BadRequestException } from '@nestjs/common';
import { BulkHealthDataDto } from '../dto/bulk-upload.dto';

@Injectable()
export class CsvParserService {
  /**
   * Parse CSV content into BulkHealthDataDto array
   */
  parseHealthDataCsv(fileContent: string): BulkHealthDataDto[] {
    const lines = fileContent.trim().split('\n');
    
    if (lines.length < 2) {
      throw new BadRequestException('CSV must have header row and at least one data row');
    }

    // Parse header
    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    
    // Validate required fields
    const requiredFields = ['userid', 'testdate', 'height', 'weight'];
    const missingFields = requiredFields.filter((field) => !headers.includes(field));
    
    if (missingFields.length > 0) {
      throw new BadRequestException(`Missing required fields: ${missingFields.join(', ')}`);
    }

    const healthDataArray: BulkHealthDataDto[] = [];
    const errors: string[] = [];

    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = this.parseCSVLine(lines[i]);
        
        if (values.length !== headers.length) {
          errors.push(`Row ${i + 1}: Column count mismatch`);
          continue;
        }

        const healthData: any = {};

        headers.forEach((header, index) => {
          const value = values[index].trim();
          if (value) {
            healthData[this.mapHeaderToField(header)] = this.parseValue(header, value);
          }
        });

        // Validate required fields
        if (!healthData.userId || !healthData.testDate || !healthData.height || !healthData.weight) {
          errors.push(`Row ${i + 1}: Missing required fields`);
          continue;
        }

        healthDataArray.push(healthData as BulkHealthDataDto);
      } catch (error) {
        errors.push(`Row ${i + 1}: ${error.message}`);
      }
    }

    if (errors.length > 0 && healthDataArray.length === 0) {
      throw new BadRequestException(`CSV parsing failed:\n${errors.join('\n')}`);
    }

    return healthDataArray;
  }

  /**
   * Parse a single CSV line, handling quoted values
   */
  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current);
    return result;
  }

  /**
   * Map CSV header to DTO field name
   */
  private mapHeaderToField(header: string): string {
    const mapping: Record<string, string> = {
      'userid': 'userId',
      'testdate': 'testDate',
      'height': 'height',
      'weight': 'weight',
      'waistcircumference': 'waistCircumference',
      'systolicbp': 'systolicBP',
      'diastolicbp': 'diastolicBP',
      'restingheartrate': 'restingHeartRate',
      'fastingglucose': 'fastingGlucose',
      'hba1c': 'hba1c',
      'totalcholesterol': 'totalCholesterol',
      'ldlcholesterol': 'ldlCholesterol',
      'hdlcholesterol': 'hdlCholesterol',
      'triglycerides': 'triglycerides',
      'serumcreatinine': 'serumCreatinine',
      'egfr': 'egfr',
      'alt': 'alt',
      'ast': 'ast',
      'hemoglobin': 'hemoglobin',
      'tsh': 'tsh',
      'crp': 'crp',
      'vitamind': 'vitaminD',
      'vitaminb12': 'vitaminB12',
      'smokingstatus': 'smokingStatus',
      'alcoholconsumption': 'alcoholConsumption',
      'physicalactivityminutes': 'physicalActivityMinutes',
      'dietquality': 'dietQuality',
      'annualcheckup': 'annualCheckup',
    };

    return mapping[header] || header;
  }

  /**
   * Parse value based on field type
   */
  private parseValue(header: string, value: string): any {
    // Boolean fields
    if (header === 'annualcheckup') {
      return value.toLowerCase() === 'true' || value === '1' || value.toLowerCase() === 'yes';
    }

    // Enum fields
    if (['smokingstatus', 'alcoholconsumption', 'dietquality'].includes(header)) {
      return value.toLowerCase();
    }

    // Numeric fields
    if (!['userid', 'testdate', 'smokingstatus', 'alcoholconsumption', 'dietquality'].includes(header)) {
      const num = parseFloat(value);
      if (isNaN(num)) {
        throw new Error(`Invalid number: ${value}`);
      }
      return num;
    }

    return value;
  }
}

