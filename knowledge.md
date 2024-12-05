# Baserow SDK

## Validating Code

To validate code changes, run `npm run validate`. This is the preferred command for checking code correctness - do not run `npm test` directly.

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
- Favor simple, direct solutions over clever ones
- Prefer unified interfaces over type-specific implementations
- Avoid separate parsers per type when a single parser function can handle all cases
- Consider the full field definition when parsing, not just individual values

## Architecture

- /src/codegen/: Code generation utilities
  - codegen.ts: Handles table imports and overall code generation orchestration
  - Individual utilities handle specific generation tasks (types, getters, etc)
- /src/: Core SDK implementation
- Repository pattern for data access

### Runtime vs Compile-time

Core architectural principle: Favor runtime flexibility over specific implementation locations. When moving logic from compile-time to runtime:

- Implementation can live in Row, parsers, or other runtime locations
- Focus on runtime vs compile-time tradeoff, not specific runtime location
- Choose runtime location based on separation of concerns, not migration goals

### Migration Goals

- Moving field handling from compile-time to runtime
  - Core goal is runtime flexibility over compile-time generation
  - Field logic can live in Row, parsers, or other runtime locations
  - Implementation location less important than runtime vs compile-time
- Handle field validation/conversion in runtime layer
- Factory pattern for managing row instances
- Move field handling from compile-time code generation to runtime
  - Reduce generated code to just types and interfaces
  - Handle field parsing and validation at runtime
- Handle field validation/conversion in runtime layer (Row/Factory/Repository)

### Target Architecture

Key principles:

- Developer experience drives implementation decisions
- Generated code must provide type-safe, discoverable APIs
- Field access should be explicit and type-safe
- Runtime flexibility shouldn't compromise API usability
- Prefer simple, type-safe APIs over complex patterns
- Favor explicit getField/setField methods over property accessors
- Focus on compile-time type safety within simple runtime patterns

Generated code should be minimal while maintaining usability:

- TypeScript interfaces describing row shape
- Strongly-typed methods for field access
- No field parsing or validation logic (moved to runtime)
- No complex type mapping (moved to runtime)

Example target output:

```typescript
// Generated file for Tasks table

// Just the type definition
export type TasksRowType = {
  id: number;
  order: string;
  title: string;
  description: string;
  due_date: string;
  // ... other fields
};

// Minimal class that extends base Row class
export class TasksRow extends Row<TasksRowType, Repository> {
  constructor(options: {
    tableId: number;
    rowId: number;
    row: TasksRowType;
    sdk: BaserowSdk;
    repository: Repository;
  }) {
    super(options);
    this.repository = options.repository;
  }
}
```

Example usage:

```typescript
const task = await repository.getOneTask(123);
const title = task.getField<string>("title");
await task.setField("title", "New Title");
```

## Testing

- Use `npm run validate` to run tests and validate code
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

Field type parsing is handled in two places:

- src/lib/parsers.ts: Core parsing logic for each field type
- Row class: Uses parsers to handle field type conversion

When adding support for a new field type:

1. Add parser to src/lib/parsers.ts
2. Add test case to row.spec.ts
3. Use parser in Row.getField method

The Row class should delegate parsing to parsers.ts rather than implementing conversion logic directly. This keeps parsing logic centralized and consistent. Avoid duplicating parsing logic across the codebase - all field type parsing should live in parsers.ts.

When implementing parsers:

- Favor simple unified interfaces over type-specific implementations
- Avoid separate parsers per type when a single parser function can handle all cases
- Consider the full field definition when parsing, not just individual values

## Known Issues

- None currently tracked
