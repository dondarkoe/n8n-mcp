# Project Brief: n8n-mcp

## Project Identity
**Name:** n8n-mcp  
**Version:** 2.14.1  
**Repository:** https://github.com/czlonkowski/n8n-mcp  
**Author:** Romuald Czlonkowski @ www.aiadvisors.pl/en

## Mission Statement
Bridge n8n workflow automation with AI assistants through the Model Context Protocol (MCP), enabling AI to discover, configure, validate, and deploy n8n workflows through structured tools.

## Core Objectives

### Primary Goals
1. **Seamless Integration**: Provide AI assistants direct access to n8n's 525+ nodes
2. **Template Library**: Expose 2,500+ community templates with smart metadata
3. **Validation System**: Multi-profile validation (minimal, runtime, ai-friendly, strict)
4. **Workflow Management**: Full CRUD operations for n8n workflows via API

### Key Deliverables
- 40+ MCP tools for comprehensive n8n interaction
- SQLite-backed node database with FTS5 fuzzy search
- Template discovery with AI-generated metadata
- Multi-stage workflow validation (nodes, connections, expressions)
- HTTP and stdio transport support
- Docker deployment options

## Success Criteria
1. AI assistants can discover nodes without prior knowledge
2. Workflow creation happens through natural conversation
3. Validation catches errors before deployment
4. Templates accelerate 70-90% of common use cases
5. Token efficiency through targeted tools (minimal, essentials, full)

## Project Scope

### In Scope
- Node discovery (search, browse, essentials)
- Template management (search, metadata filtering, retrieval)
- Workflow validation (structure, connections, expressions)
- n8n API integration (create, update, deploy, trigger)
- Multi-validation profiles for different use cases
- Documentation and examples

### Out of Scope
- n8n core functionality modifications
- Custom node development
- Workflow execution monitoring (basic status only)
- Advanced n8n features (projects, environments) - enterprise only
- Real-time workflow debugging

## Target Users
- AI coding assistants (Claude, GPT, etc.)
- Developers building n8n workflows through AI
- Automation engineers seeking faster workflow creation
- Teams wanting validated, reusable workflow patterns

## Technical Foundation
- **Language:** TypeScript
- **Core Dependencies:** n8n SDK, MCP SDK, SQLite
- **Architecture:** MCP server with stdio/HTTP transport
- **Database:** SQLite with FTS5 for fuzzy search
- **Deployment:** Node.js, Docker, Railway

## Project Status
**Current:** Production-ready v2.14.1  
**Next Phase:** Continued tool refinement and user feedback integration
