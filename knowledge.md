# Baserow SDK

## Validating Code

To validate code changes, run `npm run validate`.

## Project Overview

- TypeScript SDK for interacting with Baserow API
- Provides type-safe access to Baserow database operations
- Uses code generation to create strongly-typed models from Baserow tables

## Key Concepts

- Row: Base class for all table row models
- Factory: Creates and manages row instances
- BaserowSdk: Core client for making API requests

## Code Style

- Validate numeric IDs with Number.isFinite()
- Keep error messages concise and descriptive
- Use TypeScript generics for type safety

## Architecture

- /src/codegen/: Code generation utilities
  - codegen.ts: Handles table imports and overall code generation orchestration
  - Individual utilities handle specific generation tasks (types, getters, etc)
- /src/: Core SDK implementation
- Factory pattern for managing row instances
- Repository pattern for data access

### Migration Goals

- Moving from compile-time code generation to runtime field handling
- Keep generated code minimal (types only)
- Push field logic into base Row class
  - Use test-driven development approach
  - Write failing tests before implementing changes
- Handle field validation/conversion in Factory/Repository layer

## Testing

- Use Vitest for unit tests
- Mock HTTP requests in tests
- Test error cases and edge cases
- Follow test-driven development:
  - Write tests that accurately capture the bug
  - Verify tests fail before implementing fix
  - Tests should be specific and match real issues
  - Mock responses must match real data structures
  - Test file location should match code organization:
    - Integration tests go in the root test file
    - Unit tests go next to implementation
- Test location matters:
  - Place tests close to implementation
  - codegen.ts handles table imports and circular dependencies
  - Individual codegen utilities handle specific generation tasks

## Common Tasks

- Adding a new table model: Use code generation utilities
- Adding API endpoints: Extend BaserowSdk class
- Adding field types: Update getRawType.ts

## Field Types

The Row class handles various field types with specific parsing logic:
- number: Converts string to float
- boolean: Converts "true" string to boolean
- array: Handles array fields with numeric values
- date: Converts to Date object
- email: Passes through as string
- url: Passes through as string

To add support for a new field type:
1. Add parser to src/lib/parsers.ts if needed
2. Add test case to row.spec.ts
3. Implement handling in Row.getField method

## Known Issues

- None currently tracked
