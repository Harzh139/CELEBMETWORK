// pdf.controller.ts
import { Controller, Post, Res, Body } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { Response } from 'express';

@Controller('pdf')
export class PdfController {
  constructor(private pdfService: PdfService) {}

  @Post('generate')
  async generate(@Body('html') html: string, @Res() res: Response) {
    const pdf = await this.pdfService.generatePdfFromHtml(html);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=profile.pdf');
    res.end(pdf);
  }
}
