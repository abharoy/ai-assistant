# AI Assistant - RAG System

A production-ready Retrieval-Augmented Generation (RAG) system built with NestJS, TypeScript, Qdrant Vector Database, and Claude AI API.

## 🚀 Features

- **AI-Powered Search**: Uses Claude AI to generate intelligent responses based on retrieved documents
- **Vector Embeddings**: OpenRouter's text-embedding-3-small for accurate semantic search
- **Fast Retrieval**: Qdrant vector database for high-performance similarity search
- **Document Management**: Add, update, and delete documents with automatic embedding generation
- **Follow-up Questions**: AI generates relevant follow-up questions for user engagement
- **Comprehensive Logging**: Debug-friendly logging for monitoring and troubleshooting
- **Type-Safe**: Full TypeScript support with strict type checking

## 📋 Prerequisites

- Node.js 18+
- Docker & Docker Compose
- OpenRouter API Key
- Claude API Key
- Qdrant Vector Database

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/abharoy/ai-assistant.git
cd ai-assistant
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
CLAUDE_API_KEY=your_claude_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=your_qdrant_api_key
```

### 4. Start Services

```bash
docker-compose up -d
```

Verify Qdrant is running:

```bash
curl http://localhost:6333/health
```

### 5. Run the Application

```bash
npm run start:dev
```

The application will start at `http://localhost:3000`

## 📚 API Endpoints

### Health Check

```bash
curl http://localhost:3000/api/rag/health
```

### Query Documents

```bash
curl -X POST http://localhost:3000/api/rag/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What office spaces do you have in Victoria Island?",
    "includeFollowUp": true
  }'
```

### Ingest Documents

```bash
curl -X POST http://localhost:3000/api/rag/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "documents": [
      {
        "id": "1",
        "content": "Office space details...",
        "metadata": {
          "location": "Victoria Island",
          "price": 500000
        }
      }
    ]
  }'
```

### Get Collection Statistics

```bash
curl http://localhost:3000/api/rag/stats
```

### Delete Document

```bash
curl -X DELETE http://localhost:3000/api/rag/documents/1
```

## 🌱 Seed Sample Data

```bash
npm run seed
```

This will populate the database with sample office-related documents.

## 📂 Project Structure

```
src/
├── common/
│   └── logger/
│       └── logger.service.ts
├── config/
│   └── config.ts
├── modules/
│   └── rag/
│       ├── rag.controller.ts
│       ├── rag.service.ts
│       └── rag.module.ts
├── scripts/
│   └── seed-documents.ts
├── services/
│   ├── embedding.service.ts
│   ├── qdrant.service.ts
│   └── claude.service.ts
├── app.module.ts
└── main.ts
```

## 🔧 Configuration

### Environment Variables

- `CLAUDE_API_KEY`: Your Anthropic Claude API key
- `OPENROUTER_API_KEY`: Your OpenRouter API key for embeddings
- `QDRANT_URL`: Qdrant service URL (default: http://localhost:6333)
- `QDRANT_API_KEY`: Qdrant authentication key (optional)
- `PORT`: Application port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)
- `LOG_LEVEL`: Logging level (debug/info/warn/error)

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:cov

# Run tests in watch mode
npm run test:watch
```

## 📝 Best Practices

1. **Document Chunking**: Break large documents into 300-500 token chunks for better retrieval
2. **Metadata**: Always include relevant metadata (location, category, price, etc.)
3. **Query Optimization**: Use specific keywords for better search results
4. **Rate Limiting**: Implement rate limiting in production
5. **Error Handling**: All endpoints have comprehensive error handling
6. **Logging**: Monitor logs for debugging and optimization

## 🚀 Deployment

### Docker Build

```bash
docker build -t ai-assistant .
docker run -p 3000:3000 \
  -e CLAUDE_API_KEY=your_key \
  -e OPENROUTER_API_KEY=your_key \
  ai-assistant
```

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure proper error logging
- [ ] Enable HTTPS
- [ ] Set rate limits
- [ ] Configure CORS appropriately
- [ ] Monitor API usage and costs
- [ ] Regular backups of Qdrant data
- [ ] Health checks monitoring

## 📊 Performance Optimization

- **Caching**: Implement Redis caching for frequently asked questions
- **Batch Processing**: Use batch embedding generation for multiple documents
- **Indexing**: Qdrant provides efficient indexing for fast similarity search
- **Rate Limiting**: Protect APIs from abuse

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 💬 Support

For support, email hello@officebanao.com or open an issue in the repository.

## 🔗 Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Qdrant Documentation](https://qdrant.tech/documentation)
- [Claude API Documentation](https://www.anthropic.com/api)
- [OpenRouter API Documentation](https://openrouter.ai)

## 📈 Roadmap

- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Real-time chat interface
- [ ] Document versioning
- [ ] Custom embeddings model support
- [ ] Advanced caching strategies
- [ ] GraphQL API

---

