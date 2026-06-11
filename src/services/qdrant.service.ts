import { Injectable } from '@nestjs/common';
import { QdrantClient } from '@qdrant/js-client';
import { config } from '@/config/config';
import { EmbeddingService } from './embedding.service';
import { LoggerService } from '@/common/logger/logger.service';

interface Document {
  id: string;
  content: string;
  metadata?: Record<string, any>;
}

interface SearchResult {
  id: string;
  content: string;
  score: number;
  metadata?: Record<string, any>;
}

@Injectable()
export class QdrantService {
  private client: QdrantClient;
  private collectionName = config.qdrant.collectionName;
  private readonly logger = new LoggerService(QdrantService.name);

  constructor(private embeddingService: EmbeddingService) {
    this.client = new QdrantClient({
      url: config.qdrant.url,
      apiKey: config.qdrant.apiKey,
    });
  }

  async initializeCollection(): Promise<void> {
    try {
      this.logger.info(`Initializing collection: ${this.collectionName}`);

      const collections = await this.client.getCollections();
      const exists = collections.collections.some((c) => c.name === this.collectionName);

      if (!exists) {
        await this.client.createCollection(this.collectionName, {
          vectors: {
            size: config.embedding.dimension,
            distance: 'Cosine',
          },
        });
        this.logger.info(`✓ Collection "${this.collectionName}" created successfully`);
      } else {
        this.logger.info(`✓ Collection "${this.collectionName}" already exists`);
      }
    } catch (error) {
      this.logger.error(`Failed to initialize Qdrant collection: ${error.message}`);
      throw new Error(`Failed to initialize Qdrant collection: ${error.message}`);
    }
  }

  async addDocuments(documents: Document[]): Promise<void> {
    try {
      this.logger.info(`Adding ${documents.length} documents to Qdrant`);

      const embeddings = await this.embeddingService.generateEmbeddings(
        documents.map((d) => d.content),
      );

      const points = documents.map((doc, idx) => ({
        id: this.generateId(doc.id),
        vector: embeddings[idx],
        payload: {
          content: doc.content,
          metadata: doc.metadata || {},
          source: doc.metadata?.source || 'unknown',
          created_at: new Date().toISOString(),
        },
      }));

      await this.client.upsert(this.collectionName, {
        points: points as any,
      });

      this.logger.info(`✓ Added ${documents.length} documents to Qdrant`);
    } catch (error) {
      this.logger.error(`Failed to add documents: ${error.message}`);
      throw new Error(`Failed to add documents: ${error.message}`);
    }
  }

  async searchDocuments(query: string, limit = 5): Promise<SearchResult[]> {
    try {
      this.logger.info(`Searching for: "${query}" with limit: ${limit}`);

      const queryEmbedding = await this.embeddingService.generateEmbedding(query);

      const results = await this.client.search(this.collectionName, {
        vector: queryEmbedding,
        limit,
        with_payload: true,
      });

      const searchResults = results.map((result) => ({
        id: result.id.toString(),
        content: result.payload.content as string,
        score: result.score,
        metadata: result.payload.metadata as Record<string, any>,
      }));

      this.logger.info(`✓ Found ${searchResults.length} results`);
      return searchResults;
    } catch (error) {
      this.logger.error(`Search failed: ${error.message}`);
      throw new Error(`Search failed: ${error.message}`);
    }
  }

  async updateDocument(id: string, content: string, metadata?: Record<string, any>): Promise<void> {
    try {
      this.logger.info(`Updating document: ${id}`);

      const embedding = await this.embeddingService.generateEmbedding(content);

      await this.client.upsert(this.collectionName, {
        points: [
          {
            id: this.generateId(id),
            vector: embedding,
            payload: {
              content,
              metadata: metadata || {},
              updated_at: new Date().toISOString(),
            },
          },
        ] as any,
      });

      this.logger.info(`✓ Document ${id} updated successfully`);
    } catch (error) {
      this.logger.error(`Failed to update document: ${error.message}`);
      throw error;
    }
  }

  async deleteDocument(id: string): Promise<void> {
    try {
      await this.client.delete(this.collectionName, {
        points_selector: {
          points: [this.generateId(id)],
        },
      });
      this.logger.info(`✓ Document ${id} deleted successfully`);
    } catch (error) {
      this.logger.error(`Failed to delete document: ${error.message}`);
      throw error;
    }
  }

  async getCollectionStats(): Promise<any> {
    try {
      const stats = await this.client.getCollection(this.collectionName);
      return stats;
    } catch (error) {
      this.logger.error(`Failed to get collection stats: ${error.message}`);
      throw error;
    }
  }

  private generateId(id: string): number {
    return parseInt(id.replace(/\D/g, ''), 10) || Date.now();
  }
}