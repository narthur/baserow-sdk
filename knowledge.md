# Baserow SDK

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

## Known Issues

- None currently tracked
