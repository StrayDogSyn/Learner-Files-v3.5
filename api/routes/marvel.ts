import express, { Request, Response } from 'express';
import crypto from 'crypto';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// for esm mode
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const router = express.Router();

// Marvel API configuration
const MARVEL_BASE_URL = 'https://gateway.marvel.com/v1/public';
const PUBLIC_KEY = process.env.VITE_MARVEL_PUBLIC_KEY;
const PRIVATE_KEY = process.env.VITE_MARVEL_PRIVATE_KEY;

// Generate MD5 hash for Marvel API authentication
function generateHash(timestamp: string): string {
  const message = timestamp + PRIVATE_KEY + PUBLIC_KEY;
  return crypto.createHash('md5').update(message).digest('hex');
}

// Build authenticated URL
function buildAuthenticatedUrl(endpoint: string, params: Record<string, string> = {}): string {
  if (!PUBLIC_KEY || !PRIVATE_KEY) {
    throw new Error('Marvel API keys not configured');
  }

  const timestamp = Date.now().toString();
  const hash = generateHash(timestamp);

  const urlParams = new URLSearchParams({
    ts: timestamp,
    apikey: PUBLIC_KEY,
    hash,
    ...params
  });

  return `${MARVEL_BASE_URL}${endpoint}?${urlParams.toString()}`;
}

// Generic Marvel API proxy
async function proxyMarvelRequest(endpoint: string, params: Record<string, string> = {}) {
  try {
    const url = buildAuthenticatedUrl(endpoint, params);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Marvel API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.code !== 200) {
      throw new Error(`Marvel API error: ${data.status}`);
    }

    return data;
  } catch (error) {
    console.error('Marvel API proxy error:', error);
    throw error;
  }
}

// Get characters
router.get('/characters', async (req: Request, res: Response) => {
  try {
    const { limit, offset, name, nameStartsWith, orderBy } = req.query;
    
    const params: Record<string, string> = {};
    if (limit) params.limit = limit as string;
    if (offset) params.offset = offset as string;
    if (name) params.name = name as string;
    if (nameStartsWith) params.nameStartsWith = nameStartsWith as string;
    if (orderBy) params.orderBy = orderBy as string;

    const data = await proxyMarvelRequest('/characters', params);
    res.json(data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch characters',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get character by ID
router.get('/characters/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await proxyMarvelRequest(`/characters/${id}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch character',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get comics
router.get('/comics', async (req: Request, res: Response) => {
  try {
    const { limit, offset, title, titleStartsWith, orderBy, characters } = req.query;
    
    const params: Record<string, string> = {};
    if (limit) params.limit = limit as string;
    if (offset) params.offset = offset as string;
    if (title) params.title = title as string;
    if (titleStartsWith) params.titleStartsWith = titleStartsWith as string;
    if (orderBy) params.orderBy = orderBy as string;
    if (characters) params.characters = characters as string;

    const data = await proxyMarvelRequest('/comics', params);
    res.json(data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch comics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Search characters
router.get('/search/characters', async (req: Request, res: Response) => {
  try {
    const { query, limit } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Query parameter is required'
      });
    }

    const params: Record<string, string> = {
      nameStartsWith: query as string
    };
    if (limit) params.limit = limit as string;

    const data = await proxyMarvelRequest('/characters', params);
    res.json(data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to search characters',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Test connection
router.get('/test', async (req: Request, res: Response) => {
  try {
    const data = await proxyMarvelRequest('/characters', { limit: '1' });
    res.json({
      success: true,
      message: 'Marvel API connection successful',
      data: {
        total: data.data.total,
        count: data.data.count
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Marvel API connection failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;