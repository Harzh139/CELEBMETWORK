// pdf.module.ts
import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';

@Module({
  providers: [PdfService],
  controllers: [PdfController],
  exports: [PdfService], // <-- Add this line
})
export class PdfModule {}
