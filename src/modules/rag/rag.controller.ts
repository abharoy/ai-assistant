import { Controller, Post, Body, Get, Delete, Param, HttpException, HttpStatus } from '@nestjs/common';
import { RagService } from './rag.service';
import { LoggerService } from '@/common/logger/logger.service';

interface QueryDto {
  query: string;
  includeFollowUp?: boolean;
}

interface IngestDto {
  documents: Array<{
    id: string;
    content: string;
    metadata?: Record<string, any>;
  }>;
}

@Controller('api/rag')
export class RagController {
  private readonly logger = new LoggerService(RagController.name);

  constructor(private ragService: RagService) {}

  @Post('query')
  async query(@Body() body: QueryDto) {
    try {
      if (!body.query || body.query.trim().length === 0) {
        throw new HttpException('Query cannot be empty', HttpStatus.BAD_REQUEST);
      }

      return await this.ragService.processQuery(body.query, body.includeFollowUp !== false);
    } catch (error) {
      this.logger.error(`Query endpoint error: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('ingest')
  async ingest(@Body() body: IngestDto) {
    try {
      if (!body.documents || !Array.isArray(body.documents) || body.documents.length === 0) {
        throw new HttpException('Documents array cannot be empty', HttpStatus.BAD_REQUEST);
      }

      return await this.ragService.ingestDocuments(body.documents);
    } catch (error) {
      this.logger.error(`Ingest endpoint error: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('stats')
  async getStats() {
    try {
      return await this.ragService.getCollectionStats();
    } catch (error) {
      this.logger.error(`Stats endpoint error: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('documents/:id')
  async deleteDocument(@Param('id') id: string) {
    try {
      if (!id || id.trim().length === 0) {
        throw new HttpException('Document ID cannot be empty', HttpStatus.BAD_REQUEST);
      }

      return await this.ragService.deleteDocument(id);
    } catch (error) {
      this.logger.error(`Delete endpoint error: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('health')
  async health() {
    return {
      status: 'healthy',
      service: 'OfficebanAO AI Assistant - RAG System',
      timestamp: new Date().toISOString(),
    };
  }
}