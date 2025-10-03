# Product Context: n8n-mcp

## Why This Project Exists

### The Problem
Before n8n-mcp, AI assistants faced significant barriers when helping users create n8n workflows:
- **Discovery Gap**: No structured way to discover n8n's 525+ available nodes
- **Configuration Challenge**: Complex node parameters difficult to navigate without documentation
- **Validation Blind Spots**: Errors only discovered after deployment to n8n
- **Template Isolation**: 2,500+ community templates not accessible to AI
- **Manual Workflow Construction**: Users had to manually construct JSON workflows

### The Solution
n8n-mcp bridges this gap by providing:
1. **Structured Discovery**: AI can search and browse nodes with natural language
2. **Smart Configuration**: Multiple detail levels (minimal, essentials, full) for token efficiency
3. **Pre-deployment Validation**: Catch errors before they reach n8n instance
4. **Template Integration**: AI-generated metadata makes templates discoverable
5. **Conversational Workflow Building**: Create workflows through natural dialogue

## How It Should Work

### User Experience Flow
```
User: "I need to send Slack messages when new rows appear in Google Sheets"
  ↓
AI discovers relevant nodes (Google Sheets Trigger, Slack)
  ↓
AI retrieves node essentials for configuration
  ↓
AI validates configuration before building
  ↓
AI constructs workflow with proper connections
  ↓
AI validates complete workflow structure
  ↓
AI deploys to user's n8n instance (if configured)
```

### Key Principles

#### 1. Progressive Disclosure
- Start with minimal info (search results)
- Drill down to essentials (10-20 key properties)
- Full documentation only when needed
- **Result**: 80-90% token savings

#### 2. Validation-First
- Validate node configs before building workflows
- Validate workflow structure before deployment
- Multiple validation profiles for different needs
- **Result**: Fewer errors, faster iteration

#### 3. Template-First Approach
- Always check templates before building from scratch
- Smart metadata filtering (complexity, setup time, services)
- Template customization over full rebuild
- **Result**: 70-90% faster workflow creation

#### 4. Conversation-Driven
- Natural language node discovery
- AI interprets user intent
- Contextual recommendations
- **Result**: No n8n expertise required

## User Personas

### 1. AI Assistant (Primary User)
- **Needs**: Structured access to n8n capabilities
- **Pain Points**: Unstructured documentation, token limits
- **Success**: Can build workflows through conversation

### 2. Developer
- **Needs**: Faster workflow creation with AI help
- **Pain Points**: Manual JSON construction, trial-and-error
- **Success**: Workflows created in minutes vs hours

### 3. Automation Engineer
- **Needs**: Reliable, validated workflow patterns
- **Pain Points**: Debugging workflow errors post-deployment
- **Success**: Pre-validated workflows that work first time

## Value Proposition

### For AI Assistants
- **Structured Knowledge**: All n8n capabilities accessible via tools
- **Token Efficiency**: Progressive disclosure saves 80-90% tokens
- **Error Prevention**: Validation before deployment

### For Users
- **Speed**: 70-90% faster workflow creation via templates
- **Reliability**: Pre-validated workflows reduce errors
- **Accessibility**: No deep n8n knowledge required

### For n8n Ecosystem
- **Template Discovery**: Community templates become more accessible
- **Best Practices**: Validation enforces proper workflow structure
- **AI Integration**: n8n becomes AI-assistant friendly

## Success Metrics
- Workflows created without manual JSON editing
- Error rate reduction through pre-validation
- Template usage over custom builds
- User satisfaction with AI-assisted workflow creation
