import { Module } from '@nestjs/common';
import { RagModule } from './modules/rag/rag.module';
import { validateConfig } from './config/config';

@Module({
  imports: [RagModule],
})
export class AppModule {
  constructor() {
    validateConfig();
  }
}