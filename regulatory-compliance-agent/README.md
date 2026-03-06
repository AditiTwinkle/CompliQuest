# Regulatory Compliance Agent System

A TypeScript Node.js service that automates regulatory compliance assessment by scraping DORA content, analyzing gaps, and generating questions for CompliQuest integration.

## Features

- **Web Scraping Agent**: Extracts regulatory requirements from official DORA websites
- **Gap Analysis Agent**: Compares organizational compliance status against requirements
- **Question Generation Agent**: Creates 4 formatted compliance questions for CompliQuest
- **AWS Bedrock Integration**: Uses Claude 3.5 Sonnet for intelligent processing
- **Comprehensive Logging**: Full audit trail of all operations
- **Error Handling**: Robust retry mechanisms and circuit breaker patterns

## Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- AWS credentials configured (for Bedrock access)
- Environment variables set up

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your AWS credentials and configuration
```

### Development

```bash
# Start development server
npm run dev

# Run tests
npm test

# Run linting
npm run lint

# Format code
npm run format
```

### Production

```bash
# Build the project
npm run build

# Start production server
npm start
```

## Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here

# AWS Bedrock Configuration
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0
BEDROCK_REGION=us-east-1

# Logging Configuration
LOG_LEVEL=info
LOG_FILE_PATH=./logs/app.log
```

## API Endpoints

### Health Check
- `GET /api/health` - System health status
- `GET /api/ready` - Readiness check

### Compliance Analysis (Coming Soon)
- `POST /api/analyze` - Trigger full compliance analysis
- `GET /api/questions` - Retrieve generated questions

## Architecture

The system follows a modular architecture with three main components:

1. **Web Scraping Agent** - Extracts DORA requirements
2. **Gap Analysis Agent** - Identifies compliance gaps
3. **Question Generation Agent** - Creates CompliQuest questions

All agents use AWS Bedrock with Claude 3.5 Sonnet for intelligent processing.

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode (development)
npm run test
```

## Logging

The system uses Winston for comprehensive logging:

- **Console**: Development environment
- **File**: Production logs in `./logs/app.log`
- **Error File**: Separate error log in `./logs/error.log`

## Error Handling

- **Retry Logic**: Exponential backoff for external services
- **Circuit Breaker**: Protection against cascading failures
- **Rate Limiting**: Request throttling for stability
- **Graceful Degradation**: Fallback mechanisms for service failures

## Development

### Project Structure

```
src/
├── config/          # Configuration files
├── middleware/      # Express middleware
├── routes/          # API route handlers
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── __tests__/       # Test files
└── index.ts         # Application entry point
```

### Code Quality

- **ESLint**: Code linting with TypeScript rules
- **Prettier**: Code formatting
- **Jest**: Unit and integration testing
- **TypeScript**: Type safety and modern JavaScript features

## License

MIT License - see LICENSE file for details.