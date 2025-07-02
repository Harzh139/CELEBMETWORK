// backend/src/pdf/pdf.service.ts
import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class PdfService {
  async generatePdfFromHtml(htmlContent: string): Promise<Buffer> {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfData: Uint8Array = await page.pdf({ format: 'A4' });
    await browser.close();
    return Buffer.from(pdfData);
  }
}
