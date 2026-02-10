# @clack/prompts Reference

**Last Updated:** 2026-02-10
**Version:** 1.0.0
**Official Docs:** https://bomb.sh/docs/clack/packages/prompts/
**npm:** https://www.npmjs.com/package/@clack/prompts
**GitHub:** https://github.com/bombshell-dev/clack/tree/main/packages/prompts

## Overview

`@clack/prompts` is an opinionated, pre-styled CLI prompt library built on top of `@clack/core`. It provides beautiful, minimal prompt components (text, confirm, select, multiselect, spinner, etc.) with a consistent visual style and straightforward API. ESM-first, full TypeScript support.

## Installation

```bash
npm install @clack/prompts
```

## Import Syntax (ESM)

```typescript
import {
  intro, outro, cancel,
  text, password, confirm, select, multiselect, groupMultiselect,
  autocomplete, path,
  isCancel,
  group,
  spinner, progress, tasks,
  note, box,
  log, stream,
  taskLog,
  updateSettings,
} from '@clack/prompts';
```

## CommonOptions (shared by all functions)

```typescript
interface CommonOptions {
  input?: Readable;     // custom input stream
  output?: Writable;    // custom output stream (default: process.stdout)
  signal?: AbortSignal; // for programmatic cancellation
  withGuide?: boolean;  // display Clack border guides
}
```

## Session Management

### `intro(title?, opts?)`

Prints an opening banner to begin a prompt session.

```typescript
intro(title?: string, opts?: CommonOptions): void
```

```javascript
intro('create-my-app');
```

### `outro(message?, opts?)`

Prints a closing message to end a prompt session.

```typescript
outro(message?: string, opts?: CommonOptions): void
```

```javascript
outro("You're all set!");
```

## Cancellation Handling

### `isCancel(value)`

Type guard that detects when a user cancels a prompt with CTRL+C. All prompt functions return `symbol` on cancellation.

```typescript
isCancel(value: unknown): value is symbol
```

Re-exported from `@clack/core`.

### `cancel(message?, opts?)`

Displays a styled cancellation message (red text with bar-end character).

```typescript
cancel(message?: string, opts?: CommonOptions): void
```

### Cancellation Pattern

```javascript
import { text, isCancel, cancel } from '@clack/prompts';

const name = await text({ message: 'What is your name?' });

if (isCancel(name)) {
  cancel('Operation cancelled.');
  process.exit(0);
}

// name is narrowed to string here
```

## Confirm

```typescript
interface ConfirmOptions extends CommonOptions {
  message: string;
  active?: string;      // label for "yes" (default: "Yes")
  inactive?: string;    // label for "no" (default: "No")
  initialValue?: boolean; // default selection (default: true)
  vertical?: boolean;   // vertical layout orientation
}

confirm(opts: ConfirmOptions): Promise<boolean | symbol>
```

```javascript
const shouldContinue = await confirm({
  message: 'Do you want to continue?',
  active: 'Yes',
  inactive: 'No',
  initialValue: true,
});

if (isCancel(shouldContinue)) {
  cancel('Cancelled.');
  process.exit(0);
}

if (shouldContinue) {
  // proceed
}
```

## Text Input

```typescript
interface TextOptions extends CommonOptions {
  message: string;
  placeholder?: string;
  defaultValue?: string;
  initialValue?: string;
  validate?: (value: string) => string | void; // return string = error message
}

text(opts: TextOptions): Promise<string | symbol>
```

```javascript
const name = await text({
  message: 'Project name?',
  placeholder: 'my-app',
  validate: (value) => {
    if (!value) return 'Name is required';
  },
});
```

## Password

```typescript
interface PasswordOptions extends CommonOptions {
  message: string;
  mask?: string;          // masking character (default: "▪")
  clearOnError?: boolean;
  validate?: (value: string) => string | void;
}

password(opts: PasswordOptions): Promise<string | symbol>
```

## Select

```typescript
interface SelectOptions<Value> extends CommonOptions {
  message: string;
  options: { value: Value; label?: string; hint?: string; disabled?: boolean }[];
  initialValue?: Value;
  maxItems?: number;
}

select<Value>(opts: SelectOptions<Value>): Promise<Value | symbol>
```

```javascript
const framework = await select({
  message: 'Pick a framework:',
  options: [
    { value: 'react', label: 'React', hint: 'UI library' },
    { value: 'vue', label: 'Vue' },
    { value: 'svelte', label: 'Svelte' },
  ],
});
```

## Multiselect

```typescript
interface MultiSelectOptions<Value> extends CommonOptions {
  message: string;
  options: { value: Value; label?: string; hint?: string; disabled?: boolean }[];
  initialValues?: Value[];
  required?: boolean;
  cursorAt?: Value;
}

multiselect<Value>(opts: MultiSelectOptions<Value>): Promise<Value[] | symbol>
```

## Note

Renders a formatted note block with optional title, enclosed in a styled box.

```typescript
interface NoteOptions extends CommonOptions {
  format?: (line: string) => string; // custom line formatter
}

note(message?: string, title?: string, opts?: NoteOptions): void
```

```javascript
note(
  `Project: my-app\nFramework: React\nDirectory: ./my-app`,
  'Project Summary'
);
```

## Logging Functions

All log methods output styled messages with colored symbols.

```typescript
interface LogMessageOptions extends CommonOptions {
  symbol?: string;          // custom symbol character
  spacing?: number;
  secondarySymbol?: string;
}

log.message(msg?: string | string[], opts?: LogMessageOptions): void
log.info(msg: string, opts?: LogMessageOptions): void       // blue symbol
log.success(msg: string, opts?: LogMessageOptions): void    // green symbol
log.step(msg: string, opts?: LogMessageOptions): void       // green symbol
log.warn(msg: string, opts?: LogMessageOptions): void       // yellow symbol
log.warning(msg: string, opts?: LogMessageOptions): void    // alias for warn
log.error(msg: string, opts?: LogMessageOptions): void      // red symbol
```

```javascript
import { log } from '@clack/prompts';

log.info('Installing dependencies...');
log.success('Dependencies installed!');
log.step('Configuring project...');
log.warn('Optional config missing, using defaults.');
log.error('Failed to write config file.');
log.message('Custom message', { symbol: '~' });
```

### Stream Logging

For streaming/async content (e.g., LLM output):

```typescript
stream.info(iterable: Iterable<string> | AsyncIterable<string>): Promise<void>
stream.success(iterable): Promise<void>
stream.step(iterable): Promise<void>
stream.warn(iterable): Promise<void>
stream.error(iterable): Promise<void>
stream.message(iterable, opts?: LogMessageOptions): Promise<void>
```

## Group

Sequences multiple prompts together. Each prompt receives results from all previous prompts. Returns an object with all answers keyed by prompt name.

```typescript
type PromptGroup<T> = {
  [P in keyof T]: (opts: {
    results: Partial<{ [K in keyof T]: Awaited<T[K]> }>;
  }) => undefined | Promise<T[P] | undefined>;
};

interface PromptGroupOptions<T> {
  onCancel?: (opts: { results: Partial<{ ... }> }) => void;
}

group<T>(
  prompts: PromptGroup<T>,
  opts?: PromptGroupOptions<T>
): Promise<{ [P in keyof T]: Exclude<Awaited<T[P]>, symbol> }>
```

```javascript
const project = await group(
  {
    name: () => text({ message: 'Project name?' }),
    framework: ({ results }) =>
      select({
        message: `Framework for ${results.name}?`,
        options: [
          { value: 'react', label: 'React' },
          { value: 'vue', label: 'Vue' },
        ],
      }),
    install: () =>
      confirm({
        message: 'Install dependencies?',
        initialValue: true,
      }),
  },
  {
    onCancel: () => {
      cancel('Operation cancelled.');
      process.exit(0);
    },
  }
);

// project.name    -> string
// project.framework -> 'react' | 'vue'
// project.install  -> boolean
```

**Key behavior:** When using `group()`, you do NOT need to call `isCancel()` on each prompt individually. The `onCancel` callback handles cancellation for all grouped prompts.

## Spinner

Creates an animated loading indicator with timer or dots animation.

```typescript
interface SpinnerOptions extends CommonOptions {
  indicator?: 'dots' | 'timer';  // animation style (default: 'dots')
  onCancel?: () => void;
  cancelMessage?: string;
  errorMessage?: string;
  frames?: string[];             // custom animation frames
  delay?: number;                // ms between frames (default: 80)
  styleFrame?: (frame: string) => string;
}

interface SpinnerResult {
  start(msg?: string): void;
  stop(msg?: string): void;
  cancel(msg?: string): void;
  error(msg?: string): void;
  message(msg?: string): void;   // update message while spinning
  clear(): void;
  readonly isCancelled: boolean;
}

spinner(opts?: SpinnerOptions): SpinnerResult
```

```javascript
const s = spinner();
s.start('Installing dependencies...');
// ... do async work ...
s.message('Almost done...');  // update message mid-spin
s.stop('Dependencies installed!');

// Error case:
s.start('Building project...');
try {
  await build();
  s.stop('Build complete!');
} catch (e) {
  s.error('Build failed.');
}
```

## Tasks

Executes a sequence of async tasks, each with an automatic spinner.

```typescript
type Task = {
  title: string;
  task: (message: (msg: string) => void) => string | Promise<string> | void | Promise<void>;
  enabled?: boolean;  // skip if false
};

tasks(tasks: Task[], opts?: CommonOptions): Promise<void>
```

```javascript
await tasks([
  {
    title: 'Installing dependencies',
    task: async (message) => {
      await installDeps();
      message('Resolving packages...');
      return 'Installed dependencies';
    },
  },
  {
    title: 'Building project',
    task: async () => {
      await build();
      return 'Build complete';
    },
  },
  {
    title: 'Optional step',
    enabled: false,  // will be skipped
    task: async () => 'Skipped',
  },
]);
```

## Progress Bar

```typescript
interface ProgressOptions extends CommonOptions {
  style?: 'light' | 'heavy' | 'block';
  max?: number;       // default: 100
  size?: number;      // bar width, default: 40
  indicator?: 'dots' | 'timer';
}

interface ProgressResult {
  start(msg?: string): void;
  advance(step?: number, msg?: string): void;
  message(msg?: string): void;
  stop(msg?: string): void;
  cancel(msg?: string): void;
  error(msg?: string): void;
  clear(): void;
}

progress(opts?: ProgressOptions): ProgressResult
```

## Box

Renders content in a styled box with configurable alignment.

```typescript
interface BoxOptions extends CommonOptions {
  contentAlign?: 'left' | 'center' | 'right';
  titleAlign?: 'left' | 'center' | 'right';
  width?: 'auto' | number;
  titlePadding?: number;
  contentPadding?: number;
  rounded?: boolean;  // default: true
  formatBorder?: (char: string) => string;
}

box(message?: string, title?: string, opts?: BoxOptions): void
```

## Global Settings

```typescript
import { updateSettings } from '@clack/prompts';

updateSettings({
  withGuide: false,  // disable border guides globally
  messages: { ... }, // custom cancel/error messages
});
```

## Complete CLI Example

```javascript
import {
  intro, outro, cancel,
  text, confirm, select,
  isCancel, group,
  spinner, note, log,
} from '@clack/prompts';

async function main() {
  intro('create-my-app');

  const project = await group(
    {
      name: () =>
        text({
          message: 'Project name?',
          placeholder: 'my-app',
          validate: (v) => (!v ? 'Required' : undefined),
        }),
      framework: () =>
        select({
          message: 'Framework?',
          options: [
            { value: 'react', label: 'React' },
            { value: 'vue', label: 'Vue' },
          ],
        }),
      install: () =>
        confirm({ message: 'Install dependencies?', initialValue: true }),
    },
    {
      onCancel: () => {
        cancel('Setup cancelled.');
        process.exit(0);
      },
    }
  );

  if (project.install) {
    const s = spinner();
    s.start('Installing dependencies...');
    // await installDeps();
    s.stop('Installed!');
  }

  note(
    `cd ${project.name}\nnpm run dev`,
    'Next steps'
  );

  log.success(`Project ${project.name} created with ${project.framework}!`);

  outro('Happy coding!');
}

main().catch(console.error);
```

## Key Gotchas

1. **All prompts return `symbol` on cancel** -- always check with `isCancel()` unless using `group()` with `onCancel`.
2. **`group()` strips `symbol` from return types** -- the returned object only contains the actual values, never symbols. Cancellation is handled entirely through `onCancel`.
3. **`validate` returns string on error, `undefined`/`void` on success** -- do NOT return `true`/`false`.
4. **`spinner()` is a factory** -- call it to get the spinner object, then call `.start()`.
5. **`log.message()` accepts `string | string[]`** -- other log methods accept only `string`.
6. **`log.warning()` is an alias for `log.warn()`** -- both work identically.
7. **`confirm()` defaults `initialValue` to `true`** -- the cursor starts on "Yes".
8. **ESM only** -- the package is ESM-first. Use `import`, not `require`.

## Quick Links

| Resource | URL |
|----------|-----|
| API Reference | https://bomb.sh/docs/clack/packages/prompts/ |
| Getting Started | https://bomb.sh/docs/clack/basics/getting-started/ |
| Examples | https://bomb.sh/docs/clack/guides/examples/ |
| GitHub Source | https://github.com/bombshell-dev/clack/tree/main/packages/prompts/src |
| npm Package | https://www.npmjs.com/package/@clack/prompts |
| Changelog | https://github.com/bombshell-dev/clack/blob/main/packages/prompts/CHANGELOG.md |
