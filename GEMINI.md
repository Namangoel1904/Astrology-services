# GEMINI.md

## Project Overview

This is a Next.js and TypeScript web application for an "Astrology Consultancy" service. The application's frontend is primarily in Hindi and it leverages a third-party API from `api.vedicastroapi.com` for various astrological data and predictions.

The application provides features such as:
*   Horoscope
*   Matchmaking
*   Numerology
*   Panchang

The repository also contains a WordPress plugin with similar functionality, but the main application is the Next.js project.

## Building and Running

To get the application running locally, use the following commands:

*   **Install dependencies:**
    ```bash
    npm install
    ```

*   **Run the development server:**
    ```bash
    npm run dev
    ```

*   **Build for production:**
    ```bash
    npm run build
    ```

*   **Start the production server:**
    ```bash
    npm run start
    ```

## Development Conventions

*   **Linting:** The project uses ESLint for code linting. Run `npm run lint` to check for linting errors.
*   **API Key:** The API key for `api.vedicastroapi.com` is currently hardcoded in the API route files. This is a security risk and should be moved to environment variables.

## API Routes

The application has several API routes that proxy requests to the `api.vedicastroapi.com` service. Here are some of the key routes:

*   `/api/horoscope/daily-sun`: Fetches the daily sun horoscope.
*   `/api/matchmaking`: Performs matchmaking between two individuals.
*   `/api/numerology`: Provides numerology predictions.
*   `/api/panchang`: Fetches the panchang for a given date.
*   `/api/chart-image`: Generates a chart image.
*   `/api/geocode`: Geocodes a location.
*   `/api/horoscope/ascendant-report`: Fetches the ascendant report.
*   `/api/horoscope/ashtakvarga-chart-image`: Generates an ashtakvarga chart image.
*   `/api/horoscope/ashtakvarga`: Fetches ashtakvarga details.
*   `/api/horoscope/divisional-charts`: Fetches divisional charts.
*   `/api/horoscope/planet-details`: Fetches planet details.
*   `/api/matching/ashtakoot`: Performs ashtakoot matching.
