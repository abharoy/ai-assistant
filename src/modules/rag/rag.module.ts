import { Module } from '@nestjs/common';
import { RagController } from './rag.controller';
import { RagService } from './rag.service';
import { QdrantService } from '@/services/qdrant.service';
import { ClaudeService } from '@/services/claude.service';
import { EmbeddingService } from '@/services/embedding.service';

@Module({
  controllers: [RagController],
  providers: [RagService, QdrantService, ClaudeService, EmbeddingService],
  exports: [RagService, QdrantService, ClaudeService, EmbeddingService],
})
export class RagModule {}