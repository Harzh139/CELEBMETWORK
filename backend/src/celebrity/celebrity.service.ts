// backend/src/celebrity/celebrity.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Celebrity } from './celebrity.entity';
import { Repository } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config(); // ✅ Load .env before using any env variable

import Groq from 'groq-sdk';
import axios from 'axios';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'fallback',
});

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CX = process.env.GOOGLE_CX;

async function fetchCelebrityImage(celebrityName: string): Promise<string | null> {
  try {
    const url = 'https://www.googleapis.com/customsearch/v1';
    const params = {
      key: GOOGLE_API_KEY,
      cx: GOOGLE_CX,
      q: celebrityName,
      searchType: 'image',
      num: 5, // fetch more to increase chance of a valid image
      safe: 'active',
    };
    const { data } = await axios.get(url, { params });
    if (!data.items) return null;

    for (const item of data.items) {
      const imageUrl = item.link;
      try {
        const head = await axios.head(imageUrl, { timeout: 3000 });
        if (
          head.status === 200 &&
          head.headers['content-type'] &&
          head.headers['content-type'].startsWith('image/')
        ) {
          return imageUrl;
        }
      } catch (err) {
        // Skip broken/bad images
        continue;
      }
    }
    return null;
  } catch {
    return null;
  }
}

@Injectable()
export class CelebrityService {
  constructor(
    @InjectRepository(Celebrity)
    private celebRepo: Repository<Celebrity>,
  ) {}

  async searchSuggestions(intro: string): Promise<{ name: string; imageUrl?: string }[]> {
  const prompt = `Suggest 5 celebrities based on this intro: "${intro}". For each, return a JSON object with "name", "genre", "country", "fanbase" (describe the typical fans, e.g. "Punjabi music lovers"), "imageUrl", "instagram", "youtube", and "imdb". Example: [{"name": "...", "genre": "...", "country": "...", "fanbase": "...", "imageUrl": "...", "instagram": "...", "youtube": "...", "imdb": "..."}]`;
  const result = await groq.chat.completions.create({
    model: 'llama3-70b-8192',
    messages: [{ role: 'user', content: prompt }],
  });
  const content = result.choices[0].message.content ?? '[]';
  console.log('Groq raw response:', content);

  let suggestions: { name: string; imageUrl?: string }[] = [];
  try {
    // Try direct parse
    suggestions = JSON.parse(content);
  } catch {
    // Try to extract JSON array from text
    const match = content.match(/\[.*\]/s);
    if (match) {
      try {
        suggestions = JSON.parse(match[0]);
      } catch {
        suggestions = [];
      }
    }
  }
  return suggestions;
}


  async createCelebrity(data: Partial<Celebrity>) {
  let celebrity = await this.celebRepo.findOne({ where: { name: data.name } });
  if (celebrity) {
    return celebrity; // Just return existing, don't throw error
  }
  celebrity = this.celebRepo.create(data);
  return this.celebRepo.save(celebrity);
}

  async getAll() {
    return this.celebRepo.find();
  }

  async getOne(id: number) {
    return this.celebRepo.findOne({ where: { id } });
  }

  async getCelebritySuggestions(intro: string): Promise<{ name: string; image: string | null }[]> {
    // 1. Use Groq to get 5 celebrity suggestions (with names)
    const suggestions = await this.searchSuggestions(intro);

    // 2. For each suggestion, fetch an image from Google if not already present
    const results = await Promise.all(
      suggestions.map(async (sugg) => ({
        name: sugg.name,
        image: sugg.imageUrl || await fetchCelebrityImage(sugg.name) || '/default-avatar.png',
      }))
    );
    return results;
  }
}
