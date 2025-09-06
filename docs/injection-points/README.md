# BOB Injection Points

## Overview
Pre-approved context points for efficient information sharing between BOB and developers. Access these points directly without exploratory reading to optimize token usage and reduce back-and-forth communication.

## 🎯 What Are Injection Points?
Injection points are curated shortcuts to the most relevant context for common development tasks. Instead of trawling through codebases, BOB provides targeted, pre-approved context chunks.

## 📁 Module Structure

### Core Modules
- **[task-specific.md](task-specific.md)** - Context points for specific task types
- **[quick-reference.md](quick-reference.md)** - High-level architectural injection points
- **[troubleshooting.md](troubleshooting.md)** - Problem-solving context points
- **[protocol.md](protocol.md)** - Usage guidelines and maintenance

### BOB Intelligence
BOB automatically tracks which injection points you use most and optimizes recommendations over time.

## 🚀 Quick Usage

### For Agents
```
"Need context for authentication issues" → BOB_INJECTION_AUTH
"Show me component architecture" → BOB_INJECTION_ARCHITECTURE
"What's the current project status?" → BOB_INJECTION_STATUS
```

### Efficiency Benefits
- **70% reduction** in context-gathering tokens
- **2-minute** task setup vs 30-minute exploration
- **Consistent quality** through approved context patterns
- **Session continuity** across sporadic development

## 🧠 How BOB Learns

### Automatic Tracking
BOB monitors your usage patterns and learns:
- Which injection points you use most frequently
- Task types that need specific context patterns
- Efficiency improvements based on your workflow

### Smart Recommendations
Over time, BOB will:
- Promote frequently used points to quick access
- Suggest optimal injection points for new tasks
- Identify patterns in your development workflow

## 📋 Quick Reference

| Task Type | Injection Point | Purpose |
|-----------|----------------|---------|
| Authentication | AUTH_ISSUES | Login, sessions, permissions |
| New Features | COMPONENT_CREATION | Component patterns, file structure |
| Database Issues | DB_OPERATIONS | Queries, schemas, RLS |
| Build Problems | BUILD_TROUBLESHOOT | Dependencies, configuration |
| Styling Issues | STYLING_PATTERNS | CSS variables, responsive design |

## 🔧 Maintenance
These injection points are automatically updated by BOB when:
- Code changes affect file paths or line numbers
- New patterns are discovered in usage tracking
- Project structure evolves

## 📈 Usage Tracking
BOB tracks usage to optimize future recommendations:
- Most-used injection points get priority
- Response times help identify bottlenecks
- Token savings are calculated and reported

---

**BOB Tip:** Use injection points liberally! They're designed to be efficient and BOB learns from your usage patterns to serve you better over time.
