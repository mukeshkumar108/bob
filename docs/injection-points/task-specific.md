# Task-Specific BOB Injection Points

## Authentication Issues
```
Injection: BOB_INJECTION_AUTH
Files: /src/context/AuthContext.tsx (lines 1-50) + /src/services/supabase.ts (lines 1-15)
Context: Supabase auth flow, session management, common errors
Usage: Login issues, session persistence, permission errors

Files to Read:
- /src/context/AuthContext.tsx (lines 1-50) - Auth state management
- /src/services/supabase.ts (lines 1-15) - Supabase client setup
- /docs/SUPABASE_SETUP.md (lines 20-40) - Environment setup

Key Context:
- Auth flow: signInWithPassword → session persistence → context update
- Common errors: Network issues, invalid credentials, session expiry
- Testing: Check browser network tab + console for auth errors
```

## Database Operations
```
Injection: BOB_INJECTION_DB
Files: /src/services/db.ts (lines 1-30) + /docs/SUPABASE_SETUP.md (lines 30-60)
Context: Database queries, RLS policies, schema relationships
Usage: CRUD operations, data fetching, permission issues

Files to Read:
- /src/services/db.ts (lines 1-30) - Service function patterns
- /docs/SUPABASE_SETUP.md (lines 30-60) - Database schema & RLS
- /docs/ARCHITECTURE.md (lines 40-70) - Database integration

Key Context:
- Function pattern: try/catch → supabase call → error handling → return
- RLS policies: users can only access their own data
- Common issues: Foreign key constraints, RLS blocking access
```

## Component Creation
```
Injection: BOB_INJECTION_COMPONENTS
Files: /docs/FILE_STRUCTURE.md (lines 25-75) + /src/components/ui/button.tsx (lines 1-20)
Context: Component patterns, file structure, import conventions
Usage: Creating new components, following project conventions

Files to Read:
- /docs/FILE_STRUCTURE.md (lines 25-75) - Component patterns
- /docs/COMPONENT_MAP.md (lines 15-40) - Import relationships
- /src/components/ui/button.tsx (lines 1-20) - shadcn/ui example

Key Context:
- UI components → /src/components/ui/ with shadcn/ui pattern
- Higher-level → /src/components/ with custom logic
- Import pattern: @/components/ui/* for UI, relative for custom
```

## Page Addition
```
Injection: BOB_INJECTION_PAGES
Files: /docs/DECISION_TREE.md (lines 15-35) + /src/App.tsx (lines 20-40)
Context: Page creation flow, routing setup, layout integration
Usage: Adding new pages, setting up navigation

Files to Read:
- /docs/DECISION_TREE.md (lines 15-35) - Page creation flow
- /src/App.tsx (lines 20-40) - Routing setup
- /src/components/Layout.tsx (lines 1-25) - Layout usage

Key Context:
- Page location: /src/pages/ with Page.tsx suffix
- Route addition: Import → add <Route> → test navigation
- Authentication: Wrap with <PrivateRoute> for protected pages
```

## Form Handling
```
Injection: BOB_INJECTION_FORMS
Files: /src/pages/ProfilePage.tsx (lines 40-80) + /src/services/db.ts (lines 40-60)
Context: Form patterns, validation, submission handling
Usage: Implementing forms, handling user input

Files to Read:
- /src/pages/ProfilePage.tsx (lines 40-80) - Form example
- /src/components/ui/input.tsx (lines 1-15) - Input component
- /src/services/db.ts (lines 40-60) - Update patterns

Key Context:
- State management: useState for form fields
- Submission: preventDefault → service call → error handling → feedback
- Validation: HTML5 + custom logic for complex rules
```

## Styling Issues
```
Injection: BOB_INJECTION_STYLING
Files: /src/index.css (lines 90-120) + /docs/FILE_STRUCTURE.md (lines 140-170)
Context: CSS variables, theme system, responsive patterns
Usage: Styling components, maintaining design consistency

Files to Read:
- /src/index.css (lines 90-120) - CSS variables & themes
- /docs/FILE_STRUCTURE.md (lines 140-170) - Styling patterns
- /src/components/ui/card.tsx (lines 10-25) - Component styling example

Key Context:
- Theme variables: --brand-primary, --brand-secondary
- Component classes: Tailwind first, custom CSS variables second
- Responsive: Mobile-first with sm/md/lg breakpoints
```

## Error Boundaries
```
Injection: BOB_INJECTION_ERRORS
Files: /src/context/AuthContext.tsx (lines 30-50) + /docs/TROUBLESHOOTING.md (lines 20-40)
Context: Error handling patterns, user feedback, logging
Usage: Implementing error boundaries, handling exceptions

Files to Read:
- /src/context/AuthContext.tsx (lines 30-50) - Error handling patterns
- /src/services/db.ts (lines 15-25) - Try/catch blocks
- /docs/TROUBLESHOOTING.md (lines 20-40) - Common error patterns

Key Context:
- Pattern: try { operation } catch (error) { log + handle }
- User feedback: Set error state → display message → clear on retry
- Logging: console.error with descriptive messages
```

## 🎯 BOB Learning Integration

### Usage Tracking
BOB automatically tracks which injection points you use most and learns your preferences:
- Most-used points get promoted to quick access
- Patterns in your task types improve recommendations
- Efficiency metrics help optimize future suggestions

### Smart Suggestions
Based on your usage history, BOB will suggest:
- "You frequently use BOB_INJECTION_AUTH - want to add it to quick access?"
- "Based on your React patterns, try BOB_INJECTION_COMPONENTS for new features"
- "Your average token savings with injection points: 65%"

### Adaptive Learning
BOB evolves with your workflow:
- Learns your preferred frameworks and patterns
- Identifies frequently needed context for your project type
- Optimizes injection points based on measured efficiency gains
