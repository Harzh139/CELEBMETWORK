// backend/src/celebrity/celebrity.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Celebrity } from './celebrity.entity';
import { CelebrityService } from './celebrity.service';
import { CelebrityController } from './celebrity.controller';
import { PdfModule } from '../pdf/pdf.module'; // <-- Add this import

@Module({
  imports: [TypeOrmModule.forFeature([Celebrity]), PdfModule], // <-- Add PdfModule here
  providers: [CelebrityService],
  controllers: [CelebrityController],
})
export class CelebrityModule {}
