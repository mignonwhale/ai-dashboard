# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application built with TypeScript, React 19, and Tailwind CSS 4. It's currently a fresh Next.js project with minimal customization - essentially the default template structure.

## Package Manager

This project uses **Yarn 4.9.2** as the package manager (configured via `packageManager` field in package.json).

## Development Commands

```bash
# Install dependencies
yarn

# Start development server (runs on http://localhost:3000)
yarn dev

# Build for production
yarn build

# Start production server
yarn start

# Run linter
yarn lint
```

## Architecture & Structure

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4 with PostCSS
- **TypeScript**: Strict configuration with path mapping (`@/*` → `./src/*`)
- **Fonts**: Uses Geist Sans and Geist Mono from Google Fonts
- **Structure**: Standard Next.js App Router structure under `src/app/`

## Key Dependencies

- `@anthropic-ai/claude-code`: Integration with Claude Code
- Next.js 15.4.6 with React 19
- Tailwind CSS 4 (latest version)
- TypeScript 5 with strict configuration

## Configuration Files

- **ESLint**: Modern flat config using Next.js presets
- **TypeScript**: Strict configuration with Next.js plugin
- **PostCSS**: Configured for Tailwind CSS 4
- **Next.js**: Minimal configuration (mostly defaults)

## Notes

- Project appears to be in initial setup phase - only default Next.js template files exist
- README.md contains Korean instructions for project setup
- No custom components, APIs, or business logic implemented yet
- Uses modern React/Next.js patterns (App Router, Server Components)