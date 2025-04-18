# Configuration

This directory contains configuration files for the application, including environment variables, database connection settings, and other global configurations.

## Overview

- Configuration files centralize application settings
- Environment-specific configurations are managed here
- Sensitive information is loaded from environment variables

## Files

- `index.ts`: Main configuration exports, including environment variables
- `database.ts`: MongoDB connection configuration
- `spotify.ts`: Spotify API credentials and configuration

## Usage

Import configuration values from this directory:

```typescript
import config from "../config";

// Use configuration values
const port = config.PORT;
const mongoUri = config.MONGO_URI;
```

## Adding New Configuration

1. For simple values, add them to the existing `index.ts` file
2. For complex configurations, create a new file (e.g., `email.ts`)
3. Export the new configuration from `index.ts`

Example of adding email configuration:

```typescript
// email.ts
export default {
  SMTP_HOST: process.env.SMTP_HOST || "smtp.example.com",
  SMTP_PORT: parseInt(process.env.SMTP_PORT || "587", 10),
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  FROM_EMAIL: process.env.FROM_EMAIL || "noreply@myplaylistfinder.com",
  FROM_NAME: process.env.FROM_NAME || "My Playlist Finder",
};

// Then in index.ts, import and export:
import emailConfig from "./email";

export default {
  // ... existing config
  email: emailConfig,
};
```
