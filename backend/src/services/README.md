# Services

This directory contains service classes and functions that encapsulate business logic and external integrations.

## Overview

- Services handle complex business logic separate from controllers
- They provide interfaces for external APIs and third-party services
- Services manage data processing, transformations, and specialized operations
- They help maintain separation of concerns in the application

## Files

- `spotifyService.ts`: Handles Spotify API integration
- `dbService.ts`: Database service for common database operations
- `mockDbService.ts`: Mock database service for testing
- `emailService.ts`: Email sending functionality
- `cacheService.ts`: Caching mechanism for improved performance

## Service Structure

Services typically follow these patterns:

1. Class-based with methods for specific operations
2. Singleton pattern for services that need to maintain state
3. Interface-based for services with multiple implementations (e.g., production vs testing)

## Adding a New Service

1. Create a new file with the service name ending in `Service.ts`
2. Define the service class or functions
3. Include appropriate error handling
4. Export the service

Example:

```typescript
import axios from "axios";
import { config } from "../config";

// Define interfaces for service responses
export interface WeatherData {
  temperature: number;
  conditions: string;
  location: string;
}

// Service class
export class WeatherService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = config.weatherApiKey;
    this.baseUrl = "https://api.weatherservice.com";
  }

  /**
   * Get current weather for a location
   * @param location City name or coordinates
   * @returns Weather data for the location
   */
  async getCurrentWeather(location: string): Promise<WeatherData> {
    try {
      const response = await axios.get(`${this.baseUrl}/current`, {
        params: {
          location,
          apiKey: this.apiKey,
        },
      });

      return {
        temperature: response.data.temp,
        conditions: response.data.conditions,
        location: response.data.location,
      };
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw new Error("Failed to retrieve weather data");
    }
  }
}

// Export as singleton
export const weatherService = new WeatherService();
```
