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

**Testin guidelines**
- this is a POC, we will NOT implement automated unit testing or integration testing
- all tests will be done manually.  Include guidelines for manual testing that cover the functionality implemeted
