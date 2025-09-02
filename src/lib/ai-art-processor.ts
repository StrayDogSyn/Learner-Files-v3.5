import { AIArtwork } from '../types/gallery';

interface ImageOptimizationOptions {
  quality?: number; // 0-100
  maxWidth?: number;
  maxHeight?: number;
  format?: 'webp' | 'jpeg' | 'png';
  progressive?: boolean;
  preserveMetadata?: boolean;
}

interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  size: number;
  colorSpace?: string;
  hasAlpha?: boolean;
  dpi?: number;
  exif?: Record<string, any>;
  aiMetadata?: {
    model?: string;
    prompt?: string;
    negativePrompt?: string;
    seed?: number;
    steps?: number;
    cfgScale?: number;
    sampler?: string;
    generatedAt?: Date;
  };
}

interface ProcessingResult {
  originalUrl: string;
  optimizedUrl: string;
  thumbnailUrl: string;
  metadata: ImageMetadata;
  processingTime: number;
  compressionRatio: number;
}

interface BatchProcessingOptions {
  concurrency?: number;
  onProgress?: (completed: number, total: number) => void;
  onError?: (error: Error, item: any) => void;
}

interface ArtworkEnhancement {
  id: string;
  title: string;
  description: string;
  tags: string[];
  style: string;
  mood: string;
  colors: string[];
  composition: string;
  technique: string;
  inspiration?: string;
  artisticValue: number; // 1-10
  technicalQuality: number; // 1-10
}

class AIArtProcessor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private worker?: Worker;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
    this.initializeWorker();
  }

  /**
   * Initialize web worker for heavy processing tasks
   */
  private initializeWorker(): void {
    try {
      // In a real implementation, this would load an actual worker
      // For now, we'll simulate worker functionality
      console.log('AI Art Processor initialized');
    } catch (error) {
      console.warn('Web Worker not available, falling back to main thread');
    }
  }

  /**
   * Process and optimize a single AI artwork
   */
  async processArtwork(
    imageUrl: string,
    options: ImageOptimizationOptions = {}
  ): Promise<ProcessingResult> {
    const startTime = performance.now();
    
    try {
      // Load the image
      const image = await this.loadImage(imageUrl);
      
      // Extract metadata
      const metadata = await this.extractMetadata(image, imageUrl);
      
      // Optimize the image
      const optimizedUrl = await this.optimizeImage(image, options);
      
      // Generate thumbnail
      const thumbnailUrl = await this.generateThumbnail(image);
      
      const processingTime = performance.now() - startTime;
      const compressionRatio = this.calculateCompressionRatio(metadata.size, optimizedUrl);
      
      return {
        originalUrl: imageUrl,
        optimizedUrl,
        thumbnailUrl,
        metadata,
        processingTime,
        compressionRatio
      };
    } catch (error) {
      console.error('Failed to process artwork:', error);
      throw new Error(`Artwork processing failed: ${error}`);
    }
  }

  /**
   * Batch process multiple artworks
   */
  async batchProcessArtworks(
    imageUrls: string[],
    options: ImageOptimizationOptions = {},
    batchOptions: BatchProcessingOptions = {}
  ): Promise<ProcessingResult[]> {
    const { concurrency = 3, onProgress, onError } = batchOptions;
    const results: ProcessingResult[] = [];
    const errors: Error[] = [];
    
    // Process in batches to avoid overwhelming the browser
    for (let i = 0; i < imageUrls.length; i += concurrency) {
      const batch = imageUrls.slice(i, i + concurrency);
      
      const batchPromises = batch.map(async (url, index) => {
        try {
          const result = await this.processArtwork(url, options);
          results.push(result);
          onProgress?.(results.length, imageUrls.length);
          return result;
        } catch (error) {
          const err = error as Error;
          errors.push(err);
          onError?.(err, { url, index: i + index });
          return null;
        }
      });
      
      await Promise.all(batchPromises);
    }
    
    if (errors.length > 0) {
      console.warn(`Batch processing completed with ${errors.length} errors`);
    }
    
    return results;
  }

  /**
   * Enhance artwork with AI-powered analysis
   */
  async enhanceArtworkMetadata(artwork: AIArtwork): Promise<ArtworkEnhancement> {
    try {
      // Simulate AI analysis - in a real implementation, this would call an AI service
      const enhancement = await this.analyzeArtworkWithAI(artwork);
      
      return {
        id: artwork.id,
        title: enhancement.title || artwork.title,
        description: enhancement.description || artwork.description,
        tags: [...new Set([...artwork.tags, ...enhancement.suggestedTags])],
        style: enhancement.detectedStyle || artwork.style,
        mood: enhancement.mood,
        colors: enhancement.dominantColors,
        composition: enhancement.composition,
        technique: enhancement.technique,
        inspiration: enhancement.inspiration,
        artisticValue: enhancement.artisticValue,
        technicalQuality: enhancement.technicalQuality
      };
    } catch (error) {
      console.error('Failed to enhance artwork metadata:', error);
      // Return basic enhancement based on existing data
      return this.createBasicEnhancement(artwork);
    }
  }

  /**
   * Generate responsive image variants
   */
  async generateResponsiveVariants(
    imageUrl: string,
    breakpoints: number[] = [320, 640, 768, 1024, 1280, 1920]
  ): Promise<Record<string, string>> {
    const image = await this.loadImage(imageUrl);
    const variants: Record<string, string> = {};
    
    for (const width of breakpoints) {
      if (width <= image.naturalWidth) {
        const variant = await this.resizeImage(image, width);
        variants[`${width}w`] = variant;
      }
    }
    
    return variants;
  }

  /**
   * Create artwork collections based on similarity
   */
  async createArtworkCollections(artworks: AIArtwork[]): Promise<Record<string, AIArtwork[]>> {
    const collections: Record<string, AIArtwork[]> = {
      'By Style': {},
      'By Model': {},
      'By Color Palette': {},
      'By Mood': {},
      'Similar Compositions': {}
    };
    
    // Group by style
    const styleGroups = this.groupBy(artworks, 'style');
    Object.entries(styleGroups).forEach(([style, items]) => {
      if (items.length > 1) {
        collections['By Style'][style] = items;
      }
    });
    
    // Group by model
    const modelGroups = this.groupBy(artworks, 'model');
    Object.entries(modelGroups).forEach(([model, items]) => {
      if (items.length > 1) {
        collections['By Model'][model] = items;
      }
    });
    
    // Analyze color palettes and group similar ones
    const colorGroups = await this.groupByColorSimilarity(artworks);
    collections['By Color Palette'] = colorGroups;
    
    return collections;
  }

  /**
   * Generate artwork statistics
   */
  generateArtworkStats(artworks: AIArtwork[]) {
    const stats = {
      total: artworks.length,
      byModel: this.countBy(artworks, 'model'),
      byStyle: this.countBy(artworks, 'style'),
      byDimensions: this.analyzeDimensions(artworks),
      averageGenerationTime: this.calculateAverageGenerationTime(artworks),
      mostUsedTags: this.getMostUsedTags(artworks),
      qualityDistribution: this.analyzeQualityDistribution(artworks),
      creationTimeline: this.analyzeCreationTimeline(artworks)
    };
    
    return stats;
  }

  /**
   * Optimize artwork for web display
   */
  async optimizeForWeb(
    artwork: AIArtwork,
    targetSizes: { thumbnail: number; medium: number; large: number } = {
      thumbnail: 300,
      medium: 800,
      large: 1200
    }
  ): Promise<{
    thumbnail: string;
    medium: string;
    large: string;
    original: string;
  }> {
    const image = await this.loadImage(artwork.imageUrl);
    
    const [thumbnail, medium, large] = await Promise.all([
      this.resizeImage(image, targetSizes.thumbnail),
      this.resizeImage(image, targetSizes.medium),
      this.resizeImage(image, targetSizes.large)
    ]);
    
    return {
      thumbnail,
      medium,
      large,
      original: artwork.imageUrl
    };
  }

  // Private helper methods

  private async loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  }

  private async extractMetadata(image: HTMLImageElement, url: string): Promise<ImageMetadata> {
    // In a real implementation, this would extract actual EXIF data
    return {
      width: image.naturalWidth,
      height: image.naturalHeight,
      format: this.getImageFormat(url),
      size: await this.estimateImageSize(url),
      colorSpace: 'sRGB',
      hasAlpha: false,
      dpi: 72
    };
  }

  private async optimizeImage(
    image: HTMLImageElement,
    options: ImageOptimizationOptions
  ): Promise<string> {
    const {
      quality = 85,
      maxWidth = 1920,
      maxHeight = 1080,
      format = 'webp'
    } = options;
    
    // Calculate new dimensions
    const { width, height } = this.calculateOptimalDimensions(
      image.naturalWidth,
      image.naturalHeight,
      maxWidth,
      maxHeight
    );
    
    // Resize canvas
    this.canvas.width = width;
    this.canvas.height = height;
    
    // Draw and compress
    this.ctx.drawImage(image, 0, 0, width, height);
    
    return this.canvas.toDataURL(`image/${format}`, quality / 100);
  }

  private async generateThumbnail(image: HTMLImageElement): Promise<string> {
    const thumbnailSize = 150;
    const { width, height } = this.calculateOptimalDimensions(
      image.naturalWidth,
      image.naturalHeight,
      thumbnailSize,
      thumbnailSize
    );
    
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx.drawImage(image, 0, 0, width, height);
    
    return this.canvas.toDataURL('image/jpeg', 0.8);
  }

  private calculateOptimalDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ): { width: number; height: number } {
    const aspectRatio = originalWidth / originalHeight;
    
    let width = originalWidth;
    let height = originalHeight;
    
    if (width > maxWidth) {
      width = maxWidth;
      height = width / aspectRatio;
    }
    
    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }
    
    return { width: Math.round(width), height: Math.round(height) };
  }

  private async resizeImage(image: HTMLImageElement, targetWidth: number): Promise<string> {
    const aspectRatio = image.naturalHeight / image.naturalWidth;
    const targetHeight = targetWidth * aspectRatio;
    
    this.canvas.width = targetWidth;
    this.canvas.height = targetHeight;
    this.ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
    
    return this.canvas.toDataURL('image/webp', 0.85);
  }

  private calculateCompressionRatio(originalSize: number, optimizedUrl: string): number {
    // Estimate compressed size from data URL
    const base64Length = optimizedUrl.split(',')[1]?.length || 0;
    const estimatedSize = (base64Length * 3) / 4;
    return originalSize > 0 ? originalSize / estimatedSize : 1;
  }

  private async estimateImageSize(url: string): Promise<number> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const contentLength = response.headers.get('content-length');
      return contentLength ? parseInt(contentLength, 10) : 0;
    } catch {
      return 0;
    }
  }

  private getImageFormat(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase();
    return extension || 'unknown';
  }

  private async analyzeArtworkWithAI(artwork: AIArtwork): Promise<any> {
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      title: artwork.title,
      description: `Enhanced description: ${artwork.description}`,
      suggestedTags: ['ai-generated', 'digital-art'],
      detectedStyle: artwork.style,
      mood: this.detectMood(artwork),
      dominantColors: this.extractDominantColors(artwork),
      composition: this.analyzeComposition(artwork),
      technique: 'Digital Generation',
      inspiration: 'Contemporary AI Art',
      artisticValue: Math.floor(Math.random() * 3) + 7, // 7-10
      technicalQuality: Math.floor(Math.random() * 2) + 8 // 8-10
    };
  }

  private createBasicEnhancement(artwork: AIArtwork): ArtworkEnhancement {
    return {
      id: artwork.id,
      title: artwork.title,
      description: artwork.description,
      tags: artwork.tags,
      style: artwork.style,
      mood: 'neutral',
      colors: ['#000000', '#ffffff'],
      composition: 'balanced',
      technique: 'AI Generation',
      artisticValue: 7,
      technicalQuality: 8
    };
  }

  private detectMood(artwork: AIArtwork): string {
    const moodKeywords = {
      'energetic': ['bright', 'vibrant', 'dynamic', 'active'],
      'calm': ['peaceful', 'serene', 'quiet', 'gentle'],
      'dramatic': ['dark', 'intense', 'bold', 'striking'],
      'mysterious': ['shadow', 'hidden', 'enigmatic', 'secret'],
      'joyful': ['happy', 'cheerful', 'bright', 'positive']
    };
    
    const text = `${artwork.title} ${artwork.description} ${artwork.tags.join(' ')}`.toLowerCase();
    
    for (const [mood, keywords] of Object.entries(moodKeywords)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return mood;
      }
    }
    
    return 'neutral';
  }

  private extractDominantColors(artwork: AIArtwork): string[] {
    // In a real implementation, this would analyze the actual image
    const colorPalettes = {
      'photorealistic': ['#8B4513', '#228B22', '#4169E1', '#DC143C'],
      'abstract': ['#FF6347', '#4682B4', '#32CD32', '#FFD700'],
      'surreal': ['#9370DB', '#FF1493', '#00CED1', '#FF8C00'],
      'minimalist': ['#000000', '#FFFFFF', '#808080', '#C0C0C0']
    };
    
    return colorPalettes[artwork.style as keyof typeof colorPalettes] || colorPalettes.abstract;
  }

  private analyzeComposition(artwork: AIArtwork): string {
    const compositions = ['rule-of-thirds', 'centered', 'diagonal', 'symmetrical', 'asymmetrical'];
    return compositions[Math.floor(Math.random() * compositions.length)];
  }

  private groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce((groups, item) => {
      const value = String(item[key]);
      groups[value] = groups[value] || [];
      groups[value].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  }

  private countBy<T>(array: T[], key: keyof T): Record<string, number> {
    return array.reduce((counts, item) => {
      const value = String(item[key]);
      counts[value] = (counts[value] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
  }

  private async groupByColorSimilarity(artworks: AIArtwork[]): Promise<Record<string, AIArtwork[]>> {
    // Simplified color grouping - in reality, this would use color analysis
    const colorGroups: Record<string, AIArtwork[]> = {
      'Warm Tones': [],
      'Cool Tones': [],
      'Monochrome': [],
      'Vibrant': []
    };
    
    artworks.forEach(artwork => {
      // Simple heuristic based on style and tags
      if (artwork.tags.some(tag => ['warm', 'red', 'orange', 'yellow'].includes(tag.toLowerCase()))) {
        colorGroups['Warm Tones'].push(artwork);
      } else if (artwork.tags.some(tag => ['cool', 'blue', 'green', 'purple'].includes(tag.toLowerCase()))) {
        colorGroups['Cool Tones'].push(artwork);
      } else if (artwork.tags.some(tag => ['black', 'white', 'gray', 'monochrome'].includes(tag.toLowerCase()))) {
        colorGroups['Monochrome'].push(artwork);
      } else {
        colorGroups['Vibrant'].push(artwork);
      }
    });
    
    return colorGroups;
  }

  private analyzeDimensions(artworks: AIArtwork[]) {
    const dimensions = artworks.map(artwork => ({
      width: artwork.dimensions.width,
      height: artwork.dimensions.height,
      ratio: artwork.dimensions.width / artwork.dimensions.height
    }));
    
    return {
      averageWidth: dimensions.reduce((sum, d) => sum + d.width, 0) / dimensions.length,
      averageHeight: dimensions.reduce((sum, d) => sum + d.height, 0) / dimensions.length,
      mostCommonRatio: this.getMostCommonRatio(dimensions),
      sizeDistribution: this.getSizeDistribution(dimensions)
    };
  }

  private calculateAverageGenerationTime(artworks: AIArtwork[]): number {
    const times = artworks
      .map(artwork => artwork.generationSettings?.steps || 20)
      .filter(time => time > 0);
    
    return times.length > 0 ? times.reduce((sum, time) => sum + time, 0) / times.length : 0;
  }

  private getMostUsedTags(artworks: AIArtwork[]): Array<{ tag: string; count: number }> {
    const tagCounts: Record<string, number> = {};
    
    artworks.forEach(artwork => {
      artwork.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private analyzeQualityDistribution(artworks: AIArtwork[]) {
    // Simulate quality analysis based on generation settings
    const qualities = artworks.map(artwork => {
      const steps = artwork.generationSettings?.steps || 20;
      const cfgScale = artwork.generationSettings?.cfgScale || 7;
      
      // Simple quality heuristic
      let quality = 'medium';
      if (steps >= 50 && cfgScale >= 7) quality = 'high';
      else if (steps <= 20 || cfgScale <= 5) quality = 'low';
      
      return quality;
    });
    
    return this.countBy(qualities.map((q, i) => ({ quality: q })), 'quality');
  }

  private analyzeCreationTimeline(artworks: AIArtwork[]) {
    const timeline = artworks
      .map(artwork => ({
        date: new Date(artwork.createdAt).toISOString().split('T')[0],
        count: 1
      }))
      .reduce((acc, { date }) => {
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    
    return Object.entries(timeline)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  private getMostCommonRatio(dimensions: Array<{ ratio: number }>): string {
    const ratios = dimensions.map(d => {
      const ratio = d.ratio;
      if (Math.abs(ratio - 1) < 0.1) return '1:1';
      if (Math.abs(ratio - 16/9) < 0.1) return '16:9';
      if (Math.abs(ratio - 4/3) < 0.1) return '4:3';
      if (Math.abs(ratio - 3/2) < 0.1) return '3:2';
      return 'other';
    });
    
    const counts = this.countBy(ratios.map(r => ({ ratio: r })), 'ratio');
    return Object.entries(counts).sort(([,a], [,b]) => b - a)[0]?.[0] || 'other';
  }

  private getSizeDistribution(dimensions: Array<{ width: number; height: number }>) {
    const sizes = dimensions.map(d => {
      const pixels = d.width * d.height;
      if (pixels < 500000) return 'small';
      if (pixels < 2000000) return 'medium';
      return 'large';
    });
    
    return this.countBy(sizes.map(s => ({ size: s })), 'size');
  }
}

// Export singleton instance
export const aiArtProcessor = new AIArtProcessor();

// Export class for custom instances
export { AIArtProcessor };

// Export types
export type {
  ImageOptimizationOptions,
  ImageMetadata,
  ProcessingResult,
  BatchProcessingOptions,
  ArtworkEnhancement
};