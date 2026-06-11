import * as dotenv from 'dotenv';

dotenv.config();

export interface AppConfig {
  claude: {
    apiKey: string;
    model: string;
  };
  openrouter: {
    apiKey: string;
    embeddingModel: string;
  };
  qdrant: {
    url: string;
    apiKey?: string;
    collectionName: string;
  };
  embedding: {
    dimension: number;
  };
  app: {
    name: string;
    port: number;
    nodeEnv: string;
    logLevel: string;
  };
}

export const config: AppConfig = {
  claude: {
    apiKey: process.env.CLAUDE_API_KEY || '',
    model: process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022',
  },
  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY || '',
    embeddingModel: process.env.OPENROUTER_EMBEDDING_MODEL || 'openai/text-embedding-3-small',
  },
  qdrant: {
    url: process.env.QDRANT_URL || 'http://localhost:6333',
    apiKey: process.env.QDRANT_API_KEY,
    collectionName: process.env.QDRANT_COLLECTION_NAME || 'officebanao-docs',
  },
  embedding: {
    dimension: parseInt(process.env.EMBEDDING_DIMENSION || '1536', 10),
  },
  app: {
    name: 'OfficebanAO AI Assistant',
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'debug',
  },
};

export function validateConfig(): void {
  const requiredFields = ['CLAUDE_API_KEY', 'OPENROUTER_API_KEY'];
  const missing = requiredFields.filter((field) => !process.env[field]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}