# Active Context: n8n-mcp

## Current Focus

### Recent Work Completed
- **Context7 Integration** (2025-03-10)
  - Installed `@upstash/context7-mcp` globally
  - Added Context7 to Cline MCP configuration
  - Both n8n-mcp and Context7 now available simultaneously
  - Location: `/opt/homebrew/bin/context7-mcp`

- **Memory Bank Setup** (2025-03-10)
  - Created comprehensive memory bank structure in `.clinerules/memory-bank/`
  - Documented project architecture, patterns, and technical context
  - Established persistent knowledge system for Cline sessions

### Current Configuration

#### MCP Servers Active
1. **n8n-mcp** (Primary)
   - Path: `/Users/quincy/n8n-mcp/dist/mcp/index.js`
   - Mode: stdio
   - n8n Instance: https://tma.app.n8n.cloud/
   - Status: Connected and configured

2. **Context7** (Documentation)
   - Path: `/opt/homebrew/bin/context7-mcp`
   - Purpose: Library documentation access
   - Status: Installed, requires API key setup

#### Environment Setup
```env
# n8n-mcp configuration
MCP_MODE=stdio
LOG_LEVEL=error
DISABLE_CONSOLE_OUTPUT=true
N8N_API_URL=https://tma.app.n8n.cloud/
N8N_API_KEY=[configured]

# Context7 configuration
CONTEXT7_API_KEY=[needs user setup]
```

## Active Decisions & Patterns

### Tool Usage Strategy
1. **Discovery First**: Always use `search_nodes()` or template search before detailed queries
2. **Essentials Over Full**: Use `get_node_essentials()` to save tokens (80-90% reduction)
3. **Validate Early**: Run `validate_node_minimal()` before building workflows
4. **Template-First**: Check existing templates before building from scratch

### Project Conventions
- **Node Types**: Always use full prefixed format (e.g., `nodes-base.slack`)
- **Validation Profiles**: Default to `runtime` for balanced validation
- **Token Efficiency**: Progressive disclosure at every step
- **Error Handling**: Graceful degradation with user-friendly messages

### File Organization
```
.clinerules/
├── n8ninstructions.md       # Core n8n workflow instructions
└── memory-bank/             # Persistent context (NEW)
    ├── projectbrief.md      # Project foundation
    ├── productContext.md    # Why/how it works
    ├── systemPatterns.md    # Architecture patterns
    ├── techContext.md       # Tech stack details
    ├── activeContext.md     # Current state (this file)
    └── progress.md          # Status tracking
```

## Important Learnings

### MCP Architecture Insights
- **Multiple Servers Work Together**: n8n-mcp and Context7 are independent but complementary
- **n8n-mcp** = Internal project knowledge (workflow automation)
- **Context7** = External library documentation (React, Next.js, etc.)
- Both accessible simultaneously without conflict

### Workflow Building Best Practices
1. **Always** validate before deployment
2. Use templates when available (70-90% time savings)
3. Leverage metadata filtering for template discovery
4. Apply diff operations for updates (80-90% token savings)

### Token Optimization Strategies
- Search results: ~500-1000 tokens
- Node essentials: ~2-5K tokens (vs 20-50K full docs)
- Template retrieval: ~5-20K tokens
- Workflow validation: ~1-3K tokens

## Next Steps & Considerations

### Immediate Actions Required
1. **Context7 API Key**: User needs to add API key to activate Context7
   - Visit https://context7.io/ to get API key
   - Update MCP settings with actual key
   - Restart VS Code to activate

### Future Enhancements to Consider
1. Template library expansion
2. Additional validation profiles
3. Enhanced error recovery mechanisms
4. Performance optimization for large workflows

### Known Issues & Workarounds
- **Context7 Pending**: Awaiting user API key setup
- **Token Limits**: Use progressive disclosure to manage context window
- **Validation Coverage**: 87% node documentation coverage (improving)

## User Preferences & Patterns

### Communication Style
- Direct and technical
- Clear error messages with context
- Structured responses with examples
- Visual workflow representations when helpful

### Workflow Building Approach
- Template-first methodology
- Pre-validation before deployment
- Incremental updates using diffs
- Clear attribution for template authors

### Memory Management
- Complete memory bank structure established
- All core context files created
- Session continuity through documentation
- Regular updates to activeContext.md and progress.md
