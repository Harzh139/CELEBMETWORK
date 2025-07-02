// backend/src/celebrity/celebrity.controller.ts
import { Controller, Post, Body, Get, Param, ParseIntPipe, Res } from '@nestjs/common';
import { CelebrityService } from './celebrity.service';
import { Response } from 'express';
import { PdfService } from '../pdf/pdf.service';

@Controller('celebrities')
export class CelebrityController {
  constructor(
    private readonly celebService: CelebrityService,
    private readonly pdfService: PdfService, // Inject PdfService
  ) {}

  @Post('search')
  async search(@Body('prompt') prompt: string) {
    // This will call your AI suggestion method
    return this.celebService.searchSuggestions(prompt);
  }

  @Post()
  create(@Body() data) {
    return this.celebService.createCelebrity(data);
  }

  @Get()
  getAll() {
    return this.celebService.getAll();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.celebService.getOne(id);
  }

  @Get(':id/pdf')
  async downloadPdf(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response
  ) {
    const celeb = await this.celebService.getOne(id);
    if (!celeb) {
      return res.status(404).send('Celebrity not found');
    }

    // Generate HTML for the PDF
    const html = `
      <html>
        <head>
          <title>${celeb.name} Profile</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 2rem; }
            h1 { color: #6b21a8; }
            .label { font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>${celeb.name}</h1>
          <p><span class="label">Category:</span> ${celeb.genre}</p>
          <p><span class="label">Fanbase:</span> ${celeb.fanbase}</p>
          <p><span class="label">Location:</span> ${celeb.country}</p>
          ${celeb.description ? `<p><span class="label">Description:</span> ${celeb.description}</p>` : ''}
          ${celeb.instagram ? `<p><span class="label">Instagram:</span> ${celeb.instagram}</p>` : ''}
          ${celeb.youtube ? `<p><span class="label">YouTube:</span> ${celeb.youtube}</p>` : ''}
          ${celeb.imdb ? `<p><span class="label">IMDB:</span> ${celeb.imdb}</p>` : ''}
        </body>
      </html>
    `;

    // Generate PDF (using your PdfService)
    const pdf = await this.pdfService.generatePdfFromHtml(html);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${celeb.name}-profile.pdf`);
    res.end(pdf);
  }
}
