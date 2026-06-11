import { Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { config } from '@/config/config';
import { LoggerService } from '@/common/logger/logger.service';

interface ContextDocument {
  content: string;
  score: number;
  metadata?: Record<string, any>;
}

@Injectable()
export class ClaudeService {
  private client: Anthropic;
  private readonly logger = new LoggerService(ClaudeService.name);

  constructor() {
    this.client = new Anthropic({
      apiKey: config.claude.apiKey,
    });
  }

  async generateResponse(query: string, context: ContextDocument[]): Promise<string> {
    try {
      this.logger.info(`Generating response for query: "${query}"`);

      const systemPrompt = `You are an AI assistant for OfficebanAO.com, a premier real estate platform in Nigeria specializing in office spaces and commercial properties.

Your responsibilities:
- Provide accurate information about office spaces, properties, and real estate services
- Use the provided context to answer questions comprehensively
- Be professional, concise, and helpful
- If information is not available in the context, clearly state that and offer alternatives
- Maintain a helpful and courteous tone
- Provide relevant details about pricing, location, amenities when available

Guidelines:
- Always cite sources when using context
- Be specific with details (location, size, amenities, pricing)
- Suggest follow-up actions or contact information when appropriate`;

      const contextText = context
        .map(
          (doc, idx) =>
            `[Source ${idx + 1} - Relevance: ${(doc.score * 100).toFixed(1)}%]\n${doc.content}`,
        )
        .join('\n\n');

      const userMessage = `Context Information:\n${contextText}\n\nUser Query: ${query}\n\nPlease provide a helpful and accurate response based on the context provided.`;

      this.logger.debug(`Calling Claude API with model: ${config.claude.model}`);

      const response = await this.client.messages.create({
        model: config.claude.model,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userMessage,
          },
        ],
      });

      const textContent = response.content.find((block) => block.type === 'text');
      const responseText = textContent && 'text' in textContent ? textContent.text : 'No response generated';

      this.logger.info(`✓ Response generated successfully`);
      return responseText;
    } catch (error) {
      this.logger.error(`Claude API call failed: ${error.message}`);
      throw new Error(`Claude API call failed: ${error.message}`);
    }
  }

  async generateFollowUpQuestions(query: string, response: string): Promise<string[]> {
    try {
      this.logger.info(`Generating follow-up questions for: "${query}"`);

      const followUpResponse = await this.client.messages.create({
        model: config.claude.model,
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: `Based on this conversation:
Query: ${query}
Response: ${response}

Generate 3 relevant follow-up questions the user might ask. Format as JSON array of strings.`,
          },
        ],
      });

      const textContent = followUpResponse.content.find((block) => block.type === 'text');
      const content = textContent && 'text' in textContent ? textContent.text : '[]';

      try {
        const questions = JSON.parse(content);
        return Array.isArray(questions) ? questions : [];
      } catch {
        this.logger.warn(`Failed to parse follow-up questions`);
        return [];
      }
    } catch (error) {
      this.logger.error(`Failed to generate follow-up questions: ${error.message}`);
      return [];
    }
  }
}