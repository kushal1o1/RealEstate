# Standards for React Web App Naming Conventions

## General Guidelines
- Use **camelCase** for variable and function names.
- Use **PascalCase** for component names.
- Use **UPPER_SNAKE_CASE** for constants.
- Use descriptive and meaningful names.

## File and Folder Naming
- Use **camelCase** for file and folder names.
- Component files should match the component name (e.g., `MyComponent.jsx`).
- Group related files in the same folder.

## Component Naming
- Use **PascalCase** for React components (e.g., `Header`, `UserProfile`).
- Prefix reusable components with a common identifier (e.g., `AppButton`, `AppCard`).

## CSS/SCSS Naming
- Use **camelCase** for CSS/SCSS class names.
- Follow the BEM (Block Element Modifier) methodology for class naming (e.g., `button--primary`).

## State and Props
- Use **camelCase** for state variables and props.
- Prefix boolean props with `is` or `has` (e.g., `isVisible`, `hasError`).

## Functions and Handlers
- Prefix event handlers with `handle` (e.g., `handleClick`, `handleSubmit`).
- Use verbs to describe actions (e.g., `fetchData`, `updateUser`).

## Constants
- Use **UPPER_SNAKE_CASE** for constants (e.g., `API_URL`, `MAX_RETRIES`).

## Testing
- Use **PascalCase** for test file names matching the component (e.g., `MyComponent.test.js`).

## Miscellaneous
- Avoid abbreviations unless widely understood.
- Avoid single-letter variable names except for loop counters.