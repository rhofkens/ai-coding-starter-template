# Claude Preferences

## Workflow
- Do NOT offer to commit changes at the end of tasks
- Do NOT ask "Would you like me to commit this?" or similar questions
- Do NOT automatically run git commands (add, commit, status, etc.) unless explicitly requested
- User will test first and explicitly request commits when ready
- Focus on implementing and explaining changes, not committing them
- Never proactively trigger git operations
- Wait for explicit "commit" instruction from user before any git operations

## Coding best practices

**General guidelines**
- Implement comprehensive error handling and logging
- Apply SOLID principles and clean architecture patterns
- Remember the KISS principles - Keep it simple stupid when designing solutions and architectures
- Follow DRY guidelines

**Testing guidelines**
- Include guidelines for manual testing that cover the functionality implemented
- Add automated tests where appropriate for your project
