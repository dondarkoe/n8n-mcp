# System Patterns: n8n-mcp

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    AI Assistant (Cline)                  │
└────────────────────┬────────────────────────────────────┘
                     │ MCP Protocol
                     │ (stdio/HTTP)
┌────────────────────▼────────────────────────────────────┐
│                   n8n-mcp Server                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │         MCP Tool Layer (40+ tools)              │   │
│  └──────┬──────────────────────────────────────────┘   │
│         │                                               │
│  ┌──────▼──────────┬────────────────┬─────────────┐   │
│  │  Node Discovery │   Validation   │  Templates  │   │
│  │  - search       │   - minimal    │  - search   │   │
│  │  - essentials   │   - runtime    │  - metadata │   │
│  │  - full docs    │   - ai-friend  │  - retrieve │   │
│  └─────────────────┴────────────────┴─────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │         SQLite Database (FTS5)                   │  │
│  │  - 525+ nodes                                    │  │
│  │  - 2,500+ templates                              │  │
│  │  - Fuzzy search support                          │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │ n8n REST API
                     │ (optional)
┌────────────────────▼────────────────────────────────────┐
│              User's n8n Instance                         │
│  - Workflow deployment                                   │
│  - Execution monitoring                                  │
│  - Webhook triggering                                    │
└─────────────────────────────────────────────────────────┘
```

## Core Patterns

### 1. Progressive Disclosure Pattern

**Problem**: Token efficiency while maintaining completeness  
**Solution**: Tiered information access

```
Level 1: Search Results → Node names + brief descriptions
Level 2: Essentials      → 10-20 key properties only
Level 3: Full Docs       → Complete documentation
```

**Implementation**:
- `search_nodes()` → Minimal data
- `get_node_essentials()` → Curated properties
- `get_node_documentation()` → Full information

**Impact**: 80-90% token reduction for most workflows

### 2. Validation-First Pattern

**Problem**: Errors discovered after deployment  
**Solution**: Multi-stage validation before workflow creation

```
Stage 1: Node Validation → validate_node_minimal()
Stage 2: Config Validation → validate_node_operation()
Stage 3: Workflow Structure → validate_workflow_connections()
Stage 4: Expression Syntax → validate_workflow_expressions()
Stage 5: Complete Workflow → validate_workflow()
```

**Validation Profiles**:
- **minimal**: Required fields only (fastest)
- **runtime**: Operation-aware, realistic validation
- **ai-friendly**: Flexible, helps AI understand requirements
- **strict**: Complete validation, all edge cases

### 3. Template-First Pattern

**Problem**: Rebuilding common workflows from scratch  
**Solution**: Smart template discovery and customization

```
Discovery Phase:
├── search_templates_by_metadata() → Smart filtering
├── get_templates_for_task() → Curated by use case
└── search_templates() → Keyword search

Customization Phase:
├── get_template(id, mode) → Retrieve template
├── Modify for user needs
└── validate_workflow() → Ensure still valid
```

**Metadata Filtering**:
- Complexity (simple/medium/complex)
- Setup time (5-480 minutes)
- Required services (slack, openai, etc.)
- Target audience (developers, marketers, analysts)

### 4. Incremental Update Pattern

**Problem**: Full workflow updates consume excessive tokens  
**Solution**: Diff-based operations

```
Standard Update: 100-200KB workflow JSON
Diff Update: 2-20KB operation description

Operations:
- addNode / removeNode
- updateNode / moveNode
- addConnection / removeConnection
- updateSettings
- enable / disableNode
```

**Tool**: `n8n_update_partial_workflow()`  
**Savings**: 80-90% token reduction on updates

## Key Technical Decisions

### Database Architecture

**Choice**: SQLite with FTS5 (Full-Text Search)  
**Why**:
- Embedded database (no external service)
- FTS5 enables fuzzy search for node discovery
- Fast queries for 525+ nodes, 2,500+ templates
- Portable (single .db file)

**Schema Highlights**:
```sql
-- Nodes table with FTS5 virtual table
CREATE VIRTUAL TABLE nodes_fts USING fts5(
  name, displayName, description, category
);

-- Templates with AI-generated metadata
CREATE TABLE templates (
  id, name, description, nodes,
  complexity, setupMinutes, requiredServices
);
```

### Transport Mechanism

**Dual Support**: stdio + HTTP

**stdio** (Primary):
- Direct process communication
- Used by Claude Desktop, Cline
- Lower latency
- No network configuration

**HTTP** (Alternative):
- Remote access capability
- Web-based clients
- Scalable for multiple users
- Requires port configuration

**Configuration**: `MCP_MODE=stdio` or `MCP_MODE=http`

### Node Information Storage

**Hybrid Approach**:
1. **Static DB**: Core node metadata (types, categories, basic info)
2. **Runtime Schema**: Full node schemas extracted from n8n packages
3. **Cached Docs**: Human-readable documentation (87% coverage)

**Why Hybrid**:
- Static DB provides instant search results
- Runtime schema ensures accuracy
- Cached docs optimize for common queries

## Component Relationships

### Tool Categories

1. **Discovery Tools** (11 tools)
   - Search, list, browse nodes
   - Find AI-capable nodes
   - Quick reference

2. **Configuration Tools** (5 tools)
   - Node essentials
   - Full documentation
   - Property search
   - Pre-configured templates

3. **Validation Tools** (6 tools)
   - Node validation (minimal/operation)
   - Workflow validation (structure/expressions/complete)
   - Autofix capabilities

4. **Template Tools** (8 tools)
   - Search by text/metadata/nodes
   - Retrieve templates
   - Task-based discovery

5. **Workflow Management Tools** (9 tools)
   - CRUD operations
   - Partial updates (diffs)
   - Deployment
   - Execution monitoring

6. **Utility Tools** (3 tools)
   - Documentation
   - Health checks
   - Diagnostics

## Critical Implementation Paths

### Path 1: Creating a Workflow from Scratch
```
search_nodes() → get_node_essentials() → 
validate_node_minimal() → validate_node_operation() →
build workflow JSON → validate_workflow() →
n8n_create_workflow() → n8n_validate_workflow()
```

### Path 2: Using a Template
```
search_templates_by_metadata() → get_template() →
customize template → validate_workflow() →
n8n_create_workflow()
```

### Path 3: Updating Existing Workflow
```
n8n_get_workflow() → identify changes →
n8n_update_partial_workflow(operations) →
n8n_validate_workflow()
```

## Error Handling Patterns

### Graceful Degradation
- If full docs unavailable → Use essentials
- If template invalid → Fall back to manual creation
- If n8n API unavailable → Provide workflow JSON for manual import

### Validation Recovery
- `n8n_autofix_workflow()` attempts automatic fixes:
  - Expression format corrections
  - typeVersion updates
  - Error output configuration
  - Webhook path generation

### User Feedback Loop
- Clear error messages with context
- Suggestions for resolution
- Links to relevant documentation
- Example corrections

## Performance Considerations

### Token Optimization
- Use essentials by default (10-20 properties vs 100+)
- Leverage search before detailed queries
- Batch operations when possible
- Progressive loading (pagination for templates)

### Query Efficiency
- FTS5 indexes for fast text search
- Prepared statements for repeated queries
- Connection pooling for n8n API
- Caching for frequently accessed nodes

### Scalability
- Database stays under 50MB
- Queries complete in <100ms
- Template fetches paginated
- HTTP mode supports concurrent clients
