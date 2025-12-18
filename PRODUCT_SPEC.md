# Product Specification Document: dniAPI

## 1. Product Overview
**Product Name:** dniAPI  
**Description:** A robust and simplified API service that allows users to query person data using their National Identity Document (DNI) or Full Name. The platform provides a developer-friendly dashboard for managing API keys, monitoring usage, and configuring integration settings.

## 2. Target Audience
- **Developers:** Looking for an easy-to-integrate solution for identity verification.
- **Businesses:** Requiring validation of customer identities in their workflows (e.g., fintech, e-commerce, legal services).
- **Integrators:** Building systems that require government data lookup capabilities.

## 3. Core Features

### 3.1. Person Search API
The core functionality is exposed via a RESTful API endpoint (`POST /api/buscar-dni`).
- **Search by DNI:** Retrieve person details by providing an 8-digit DNI number.
- **Search by Name:** Retrieve person details by providing First Name, Paternal Surname, and Maternal Surname.
- **Response Data:** Returns standard identity information (names, surnames, DNI, etc.).

### 3.2. Authentication & Security
- **API Tokens:** Access to the API is secured via Bearer Tokens managed in the user dashboard.
- **Session Management:** Dashboard access is protected via JWT-based cookie authentication.
- **Usage Tracking:** Each API call is tracked against the used token to monitor request counts.

### 3.3. Performance & Caching
- **Database Caching:** To minimize latency and costs associated with external providers, successful lookups are cached in a PostgreSQL database (`search_cache` table).
- **Cache Strategy:**
  - Check local cache first.
  - If miss, query external providers (Factiliza, DniPeru).
  - Save result to cache for future requests.

### 3.4. Developer Dashboard
A web-based interface for users to manage their account and API usage.
- **Overview:** View total requests, active tokens, and system status.
- **Token Management:** Create, view, and manage API keys.
- **Playground:** Interactive area to test API requests directly from the browser.
- **Settings:** Configure external provider keys (Factiliza Token, DniPeru Config) for custom integrations.
- **Documentation:** Built-in guides and code snippets (Node.js, Python, Go, etc.).

## 4. Technical Requirements

### 4.1. Technology Stack
- **Frontend/Backend:** Next.js (App Router) with React.
- **Database:** PostgreSQL (Neon DB).
- **Styling:** Tailwind CSS, Shadcn UI.
- **Authentication:** JWT (JSON Web Tokens).

### 4.2. Database Schema Key Entities
- **Tokens:** Stores API keys and usage statistics (`usage_count`, `last_used`).
- **User Settings:** Stores configuration for external data providers per user.
- **Search Cache:** Stores query results indexed by DNI or Name hash to optimize performance.

### 4.3. API Endpoint Specification
**Endpoint:** `POST /api/buscar-dni`  
**Headers:**
- `Authorization: Bearer <YOUR_TOKEN>`
- `Content-Type: application/json`

**Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `dni` | string | No* | 8-digit DNI number. |
| `nombres` | string | No* | First name(s). |
| `apellido_paterno` | string | No* | Paternal surname. |
| `apellido_materno` | string | No* | Maternal surname. |
*(Either `dni` OR the combination of name fields is required)*

**Success Response:**
```json
{
  "success": true,
  "data": {
    "dni": "12345678",
    "nombres": "JUAN",
    "apellido_paterno": "PEREZ",
    "apellido_materno": "GOMEZ",
    ...
  }
}
```

## 5. User Flows

### 5.1. Onboarding & Key Generation
1. User logs into the `dniAPI` dashboard.
2. User navigates to the "API Keys" section.
3. User generates a new API token.
4. System saves the token in the database and displays it to the user.

### 5.2. Data Query (API Consumer)
1. External application sends a `POST` request to `/api/buscar-dni` with a valid token.
2. System validates the token and updates usage counters.
3. System checks the `search_cache` for the requested DNI or Name.
4. **If Cache Hit:** Returns data immediately.
5. **If Cache Miss:**
   - Queries external APIs using configured provider keys.
   - Stores the result in `search_cache`.
   - Returns data to the caller.
