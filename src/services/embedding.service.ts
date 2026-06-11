import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { config } from '@/config/config';
import { LoggerService } from '@/common/logger/logger.service';

@Injectable()
export class EmbeddingService {
  private readonly logger = new LoggerService(EmbeddingService.name);
  private readonly apiKey = config.openrouter.apiKey;
  private readonly model = config.openrouter.embeddingModel;
  private readonly openrouterUrl = 'https://openrouter.ai/api/v1';

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      this.logger.debug(`Generating embedding for text: ${text.substring(0, 50)}...`);

      const response = await axios.post(
        `${this.openrouterUrl}/embeddings`,
        {
          model: this.model,
          input: text,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.data.data || response.data.data.length === 0) {
        throw new Error('No embedding data returned from OpenRouter');
      }

      const embedding = response.data.data[0].embedding;
      this.logger.debug(`✓ Embedding generated with dimension: ${embedding.length}`);

      return embedding;
    } catch (error) {
      this.logger.error(`Embedding generation failed: ${error.message}`);
      throw new Error(`Embedding generation failed: ${error.message}`);
    }
  }

  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    try {
      this.logger.info(`Generating embeddings for ${texts.length} texts`);

      const embeddings = await Promise.all(texts.map((text) => this.generateEmbedding(text)));

      this.logger.info(`✓ Successfully generated ${embeddings.length} embeddings`);
      return embeddings;
    } catch (error) {
      this.logger.error(`Batch embedding generation failed: ${error.message}`);
      throw error;
    }
  }
}