# StackAI Google Drive Picker

A custom file picker for Google Drive connections with knowledge base indexing capabilities.

## Features

- Login page / Authentication
- Browse Google Drive resources
- Pagination support for large set
- "Smart" resource selection
- KB creation and edition matching selected files to either index or de-index them
- Icon showing currently indexed files to keep track of what is already indexed when selecting files

## Product / Technical decisions

- Heavy use of cached data to avoid unnecessary API calls
- Knowledge base id is kept in the url once it is created
- I decided to use a PUT endpoint for the KB edition because I noticed there was one being used on StackAI and it makes it very convenient to sync selection with resources in the DB.
- I believe I respected the instruction concerning the resource selection to avoid overloading the server. I do not send any resource ID if one of its parent is send too.
- No API call is triggered when toggling selection, on and off, everything is handled in some context state and synced when the user clicks on bottom right button. This allows to show a "diff" to the user between what is currently indexed and what will be indexed if they confirm their selection.

## Tech Stack

- **Framework:** Next.js 15 (latest stable)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Data Fetching:** TanStack Query + Axios
- **Package Manager:** pnpm
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/UnbearableBear/StackAI.git
cd StackAI
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials (see `.env.example` for all required variables)

4. Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Login:** Enter your StackAI credentials to authenticate (credentials provided in take-home instructions)
2. **Browse Files:** View your Google Drive root files and folders
3. **Navigate:** Click on folders to explore directory contents
4. **Knowledge Base:** Select and index files for knowledge base integration

## Deployment

We are using vercel, the app will automatically deploy on every push to the main branch.

## Development

### Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm format` - Run Prettier code formatter
- `pnpm lint` - Run ESLint linter
- `pnpm typecheck` - Run TypeScript type checking