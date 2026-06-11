import { Injectable, OnModuleInit } from '@nestjs/common';
import { QdrantService } from '@/services/qdrant.service';
import { ClaudeService } from '@/services/claude.service';
import { LoggerService } from '@/common/logger/logger.service';

interface Document {
  id: string;
  content: string;
  metadata?: Record<string, any>;
}

interface QueryResponse {
  response: string;
  sources: Array<{
    content: string;
    score: number;
    metadata?: Record<string, any>;
  }>;
  query: string;
  followUpQuestions?: string[];
}

@Injectable()
export class RagService implements OnModuleInit {
  private readonly logger = new LoggerService(RagService.name);

  constructor(
    private qdrantService: QdrantService,
    private claudeService: ClaudeService,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      this.logger.info('Initializing RAG Service');
      await this.qdrantService.initializeCollection();
      this.logger.info('✓ RAG Service initialized successfully');
    } catch (error) {
      this.logger.error(`Failed to initialize RAG Service: ${error.message}`);
      throw error;
    }
  }

  async processQuery(query: string, includFollowUp = true): Promise<QueryResponse> {
    try {
      this.logger.info(`Processing query: "${query}"`);

      const retrievedDocs = await this.qdrantService.searchDocuments(query, 5);

      if (retrievedDocs.length === 0) {
        this.logger.warn(`No relevant documents found for query: "${query}"`);
        return {
          response:
            'I apologize, but I could not find relevant information in our knowledge base. Please contact our support team for assistance.',
          sources: [],
          query,
          followUpQuestions: [],
        };
      }

      this.logger.info(`Retrieved ${retrievedDocs.length} relevant documents`);

      const response = await this.claudeService.generateResponse(query, retrievedDocs);

      let followUpQuestions: string[] = [];
      if (includFollowUp) {
        followUpQuestions = await this.claudeService.generateFollowUpQuestions(query, response);
      }

      const result: QueryResponse = {
        response,
        sources: retrievedDocs.map((doc) => ({
          content: doc.content.substring(0, 300) + (doc.content.length > 300 ? '...' : ''),
          score: doc.score,
          metadata: doc.metadata,
        })),
        query,
        followUpQuestions,
      };

      this.logger.info(`✓ Query processed successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Query processing failed: ${error.message}`);
      throw new Error(`Query processing failed: ${error.message}`);
    }
  }

  async ingestDocuments(documents: Document[]): Promise<{ status: string; count: number; message: string }> {
    try {
      this.logger.info(`Starting document ingestion for ${documents.length} documents`);

      const validDocuments = documents.filter((doc) => {
        if (!doc.id || !doc.content) {
          this.logger.warn(`Invalid document: missing id or content`);
          return false;
        }
        return true;
      });

      if (validDocuments.length === 0) {
        throw new Error('No valid documents provided');
      }

      await this.qdrantService.addDocuments(validDocuments);

      const result = {
        status: 'success',
        message: `Successfully ingested ${validDocuments.length} documents`,
        count: validDocuments.length,
      };

      this.logger.info(`✓ Document ingestion completed: ${validDocuments.length} documents`);
      return result;
    } catch (error) {
      this.logger.error(`Document ingestion failed: ${error.message}`);
      throw new Error(`Document ingestion failed: ${error.message}`);
    }
  }

  async getCollectionStats() {
    try {
      const stats = await this.qdrantService.getCollectionStats();
      return stats;
    } catch (error) {
      this.logger.error(`Failed to get collection stats: ${error.message}`);
      throw error;
    }
  }

  async deleteDocument(id: string): Promise<{ status: string; message: string }> {
    try {
      await this.qdrantService.deleteDocument(id);
      return {
        status: 'success',
        message: `Document ${id} deleted successfully`,
      };
    } catch (error) {
      this.logger.error(`Failed to delete document: ${error.message}`);
      throw error;
    }
  }
}