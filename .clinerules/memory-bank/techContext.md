# Tech Context: n8n-mcp

## Technology Stack

### Core Technologies
- **Language**: TypeScript 5.8.3
- **Runtime**: Node.js (stdio) / Express (HTTP mode)
- **Database**: SQLite with FTS5 (Full-Text Search)
- **Protocol**: Model Context Protocol (MCP) SDK v1.13.2

### Key Dependencies

#### n8n Integration
- `n8n`: ^1.112.3 - Core n8n package
- `n8n-core`: ^1.111.0 - n8n core functionality
- `n8n-workflow`: ^1.109.0 - Workflow types and utilities
- `@n8n/n8n-nodes-langchain`: ^1.111.1 - AI/LangChain nodes

#### MCP & Communication
- `@modelcontextprotocol/sdk`: ^1.13.2 - MCP protocol implementation
- `express`: ^5.1.0 - HTTP server for remote access
- `ws`: WebSocket support (via @types/ws)

#### Database & Storage
- `better-sqlite3`: ^11.10.0 - SQLite native bindings (optional)
- `sql.js`: ^1.13.0 - SQLite in WASM (fallback)
- `lru-cache`: ^11.2.1 - In-memory caching

#### Utilities
- `dotenv`: ^16.5.0 - Environment configuration
- `zod`: ^3.24.1 - Schema validation
- `uuid`: ^10.0.0 - ID generation

#### Development
- `typescript`: ^5.8.3 - Type system
- `vitest`: ^3.2.4 - Testing framework
- `@vitest/ui`: ^3.2.4 - Test UI
- `@vitest/coverage-v8`: ^3.2.4 - Code coverage

## Development Setup

### Prerequisites
```bash
# Required
- Node.js 18+ or 20+
- npm or yarn

# Optional (for better performance)
- Docker (for containerized deployment)
- SQLite CLI tools (for database inspection)
```

### Installation
```bash
# Clone repository
git clone https://github.com/czlonkowski/n8n-mcp.git
cd n8n-mcp

# Install dependencies
npm install

# Build project
npm run build

# Initialize database
npm run db:rebuild
```

### Environment Configuration

#### Stdio Mode (Default)
```env
MCP_MODE=stdio
LOG_LEVEL=error
DISABLE_CONSOLE_OUTPUT=true
```

#### HTTP Mode
```env
MCP_MODE=http
MCP_HTTP_PORT=3000
MCP_HTTP_HOST=0.0.0.0
```

#### n8n Integration (Optional)
```env
N8N_API_URL=https://your-instance.n8n.cloud/
N8N_API_KEY=your_api_key_here
```

### Project Structure
```
n8n-mcp/
├── src/
│   ├── config/           # Configuration management
│   ├── database/         # SQLite operations
│   ├── mcp/             # MCP server implementation
│   ├── services/        # Business logic (nodes, templates, validation)
│   ├── tools/           # MCP tool definitions
│   └── types/           # TypeScript types
├── data/
│   └── nodes.db         # SQLite database
├── dist/                # Compiled output
├── tests/               # Test suites
└── docs/                # Documentation
```

## Build System

### TypeScript Configuration
- **Target**: ES2022
- **Module**: ESNext with Node16 resolution
- **Strict Mode**: Enabled
- **Paths**: Configured for clean imports

### Build Scripts
```json
{
  "build": "tsc -p tsconfig.build.json",
  "rebuild": "node dist/scripts/rebuild.js",
  "dev": "npm run build && npm run rebuild && npm run validate",
  "start": "node dist/mcp/index.js",
  "start:http": "MCP_MODE=http node dist/mcp/index.js"
}
```

### Optimization
- **Database Prebuilding**: FTS5 indexes pre-created
- **Selective Dependencies**: Optional native modules for performance
- **Code Splitting**: Tools separated for lazy loading
- **Caching**: LRU cache for frequent queries

## Database Architecture

### SQLite Configuration
```javascript
{
  journal_mode: 'WAL',           // Write-Ahead Logging
  synchronous: 'NORMAL',         // Balance safety/performance
  cache_size: -64000,            // 64MB cache
  temp_store: 'MEMORY',          // Temp tables in memory
  mmap_size: 268435456          // 256MB memory-mapped I/O
}
```

### FTS5 Search
```sql
-- Full-text search virtual table
CREATE VIRTUAL TABLE nodes_fts USING fts5(
  name, displayName, description, category,
  tokenize='porter unicode61'
);

-- Fuzzy search support
-- Matches: exact, partial, typos
```

### Schema
```sql
-- Core nodes table
CREATE TABLE nodes (
  type TEXT PRIMARY KEY,
  name TEXT,
  displayName TEXT,
  description TEXT,
  category TEXT,
  ...
);

-- Templates table
CREATE TABLE templates (
  id INTEGER PRIMARY KEY,
  name TEXT,
  description TEXT,
  workflow_json TEXT,
  complexity TEXT,
  setup_minutes INTEGER,
  ...
);
```

## Testing Infrastructure

### Test Framework: Vitest
- **Unit Tests**: Individual component testing
- **Integration Tests**: API and workflow validation
- **Benchmarks**: Performance measurement
- **Coverage**: V8 code coverage

### Test Scripts
```bash
# Run all tests
npm test

# Run with UI
npm run test:ui

# Coverage report
npm run test:coverage

# Benchmarks
npm run benchmark
```

### Test Categories
1. **Unit Tests** (`tests/unit/`)
   - Node discovery
   - Validation logic
   - Template search
   
2. **Integration Tests** (`tests/integration/`)
   - MCP protocol
   - n8n API integration
   - Database operations

3. **Benchmarks** (`benchmarks/`)
   - Query performance
   - Token efficiency
   - Memory usage

## Deployment Options

### 1. Stdio Mode (Cline/Claude Desktop)
```json
{
  "mcpServers": {
    "n8n-mcp": {
      "command": "node",
      "args": ["/path/to/n8n-mcp/dist/mcp/index.js"],
      "env": {
        "MCP_MODE": "stdio",
        "N8N_API_URL": "https://...",
        "N8N_API_KEY": "..."
      }
    }
  }
}
```

### 2. Docker
```bash
# Build
docker build -t n8n-mcp .

# Run stdio mode
docker run -v ~/.cline:/config n8n-mcp

# Run HTTP mode
docker run -p 3000:3000 -e MCP_MODE=http n8n-mcp
```

### 3. Railway/Cloud
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health"
  }
}
```

## Technical Constraints

### Performance Limits
- **Database Size**: ~50MB (525 nodes + 2,500 templates)
- **Query Time**: <100ms for most operations
- **Memory Usage**: ~100-200MB typical
- **Concurrent Users**: HTTP mode supports 10-50 concurrent

### Token Efficiency
- **Search Results**: ~500-1000 tokens
- **Node Essentials**: ~2-5K tokens (vs 20-50K full docs)
- **Template Retrieval**: ~5-20K tokens depending on size
- **Workflow Validation**: ~1-3K tokens

### Compatibility
- **Node.js**: 18.x, 20.x (recommended)
- **n8n**: 1.x (tested with 1.112.3)
- **MCP Protocol**: 1.x
- **SQLite**: 3.35+ (FTS5 support required)

## Development Tools & Patterns

### Code Quality
```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Format (if configured)
npm run format
```

### Debugging
```bash
# Enable debug logging
LOG_LEVEL=debug npm start

# Inspect database
sqlite3 data/nodes.db

# Test single tool
npm run test -- tools/search-nodes.test.ts
```

### Common Tasks
```bash
# Update n8n dependencies
npm run update:n8n

# Rebuild database
npm run db:rebuild

# Fetch latest templates
npm run fetch:templates

# Sync package versions
npm run sync:runtime-version
```

## Security Considerations

### API Key Management
- Never commit API keys to repository
- Use `.env` files (gitignored)
- Rotate keys periodically
- Use read-only keys when possible

### Database Security
- No sensitive data stored in database
- Workflow JSON sanitized before storage
- Template metadata validated before use

### Network Security
- HTTP mode supports CORS configuration
- Optional authentication for remote access
- SSL/TLS recommended for production

## Performance Monitoring

### Metrics Tracked
- Query execution time
- Token usage per operation
- Cache hit rates
- Memory consumption
- Database size

### Benchmarking
```bash
# Run performance tests
npm run benchmark

# Compare with baseline
npm run benchmark:ci

# Generate reports
npm run scripts/generate-benchmark-reports.js
