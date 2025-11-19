# GetEmpStatus API - Node.js Implementation Plan

## Project Overview
A RESTful backend service that retrieves employee information, processes salary data with business rules, and calculates employee status based on salary averages.

---

## Phase 1: Project Setup & Foundation (1-2 hours)

### 1.1 Initialize Project
- [ ] Create Node.js project with `npm init`
- [ ] Install core dependencies:
  - Express.js (API framework)
  - MySQL2 or pg (database driver)
  - dotenv (environment configuration)
  - express-validator (input validation)
- [ ] Setup project structure:
  ```
  /src
    /controllers
    /services
    /models
    /middlewares
    /utils
    /config
  /database
  /tests
  ```

### 1.2 Environment Configuration
- [ ] Create `.env` file with database credentials
- [ ] Setup database connection configuration
- [ ] Configure server port and environment variables

### 1.3 Database Setup
- [ ] Create database schema file (`database/schema.sql`)
- [ ] Create `Users` table with specified columns
- [ ] Create `Salaries` table with foreign key relationship
- [ ] Insert sample data for Users (12 records)
- [ ] Insert sample data for Salaries (50+ records)
- [ ] Create database connection pool utility

---

## Phase 2: Core Architecture Implementation (2-3 hours)

### 2.1 Models Layer
- [ ] Create `EmpInfo` class/model
  - Properties: ID, Username, NationalNumber, Email, Phone, IsActive
  - Salary information properties
  - Status calculation properties

### 2.2 Data Access Layer
- [ ] Create `DataAccess` class for database operations
  - Method: `getUserByNationalNumber(nationalNumber)`
  - Method: `getSalariesByUserId(userId)`
  - Implement connection pooling
  - Add error handling for DB operations

### 2.3 Validation Layer
- [ ] Create `Validator` class
  - Validate NationalNumber format
  - Check for missing/invalid fields
  - Validate JSON request structure

### 2.4 Business Logic Layer
- [ ] Create `ProcessStatus` service class
  - User validation logic (exists, active, sufficient data)
  - Salary adjustment calculations
  - Status determination logic

---

## Phase 3: Business Logic Implementation (2-3 hours)

### 3.1 Salary Adjustments
- [ ] Implement December bonus (+10%)
- [ ] Implement summer deduction (-5% for months 6, 7, 8)
- [ ] Apply adjustments before calculations

### 3.2 Tax Calculations
- [ ] Calculate sum of adjusted salaries
- [ ] Apply 7% tax if total > 10,000
- [ ] Implement tax deduction logic

### 3.3 Status Determination
- [ ] Calculate average salary
- [ ] Find highest salary
- [ ] Determine status (GREEN/ORANGE/RED)
- [ ] Add LastUpdated timestamp (UTC)

### 3.4 Error Handling
- [ ] Return 404 for invalid National Number
- [ ] Return 406 for inactive users
- [ ] Return 422 for insufficient data (<3 salary records)
- [ ] Return 200 with calculated data for success

---

## Phase 4: API Endpoint Implementation (1-2 hours)

### 4.1 Controller Layer
- [ ] Create `EmployeeController` with `getEmpStatus` method
- [ ] Implement POST `/api/GetEmpStatus` endpoint
- [ ] Process input JSON with NationalNumber
- [ ] Return formatted JSON response
- [ ] Add proper HTTP status codes

### 4.2 Middleware Setup
- [ ] Add body-parser for JSON
- [ ] Add input validation middleware
- [ ] Add error handling middleware
- [ ] Add CORS configuration (if needed)

### 4.3 Response Formatting
- [ ] Success response structure matching example
- [ ] Error response structure
- [ ] Status code mapping

---

## Phase 5: Bonus Features Implementation (2-4 hours)

### 5.1 Caching Layer
- [ ] Install Redis client
- [ ] Create `CacheHandler` utility
- [ ] Cache employee data by NationalNumber
- [ ] Set TTL for cached data
- [ ] Implement cache invalidation strategy

### 5.2 Logging System
- [ ] Install Winston or similar logging library
- [ ] Create custom database table for logs
- [ ] Create `Logger` utility class
- [ ] Log API requests and responses
- [ ] Log errors with stack traces
- [ ] Log data retrieval operations

### 5.3 Retry Mechanism
- [ ] Create retry wrapper for database queries
- [ ] Implement exponential backoff
- [ ] Set maximum retry attempts to 3
- [ ] Log retry attempts

### 5.4 API Token Authentication (use jwt)
- [ ] Generate/define API token
- [ ] Create authentication middleware
- [ ] Validate token from request headers
- [ ] Return 401 for missing/invalid tokens
- [ ] Document token usage

---

## Phase 6: Testing & Documentation (1-2 hours)

### 6.1 API Testing
- [ ] Create Postman collection
  - Test successful request (NAT1001)
  - Test invalid National Number
  - Test inactive user (NAT1003)
  - Test insufficient data (NAT1005)
  - Test with/without token (if implemented)
- [ ] Export Postman collection JSON
- [ ] Alternative: Generate Swagger documentation

### 6.2 Unit Testing (Optional)
- [ ] Install Jest or Mocha
- [ ] Write tests for Validator class
- [ ] Write tests for ProcessStatus logic
- [ ] Write tests for salary calculations

### 6.3 Documentation
- [ ] Create comprehensive README.md:
  - Project description
  - Prerequisites
  - Installation steps
  - Database setup instructions
  - Environment variables configuration
  - Running the application
  - API endpoint documentation
  - Architecture explanation
  - Bonus features description
  - Sample requests/responses

---

## Phase 7: Final Testing & Delivery (1 hour)

### 7.1 Integration Testing
- [ ] Test complete flow end-to-end
- [ ] Verify all business rules
- [ ] Test error scenarios
- [ ] Verify response formats

### 7.2 Code Quality
- [ ] Code review and cleanup
- [ ] Add inline comments for complex logic
- [ ] Ensure consistent code formatting
- [ ] Remove console.logs (keep proper logging)

### 7.3 Packaging
- [ ] Create `.gitignore` file
- [ ] Prepare database script (schema.sql)
- [ ] Export Postman collection
- [ ] Create ZIP file or GitHub repository
- [ ] Verify all deliverables are included

---

## Technology Stack

### Core Dependencies
```json
{
  "express": "^4.18.0",
  "mysql2": "^3.0.0",
  "dotenv": "^16.0.0",
  "express-validator": "^7.0.0"
}
```

### Bonus Dependencies
```json
{
  "node-cache": "^5.1.0",
  "winston": "^3.8.0",
  "jsonwebtoken": "^9.0.0"
}
```

### Dev Dependencies
```json
{
  "nodemon": "^3.0.0",
  "jest": "^29.0.0"
}
```

---

## Estimated Timeline

| Phase | Duration | Priority |
|-------|----------|----------|
| Phase 1: Setup | 1-2 hours | Critical |
| Phase 2: Architecture | 2-3 hours | Critical |
| Phase 3: Business Logic | 2-3 hours | Critical |
| Phase 4: API Endpoint | 1-2 hours | Critical |
| Phase 5: Bonus Features | 2-4 hours | Optional |
| Phase 6: Testing & Docs | 1-2 hours | Critical |
| Phase 7: Final Review | 1 hour | Critical |

**Total Core Time:** 8-12 hours  
**Total with Bonus:** 10-16 hours

---

## Deliverables Checklist

- [ ] Complete Node.js source code
- [ ] `database/schema.sql` with tables and sample data
- [ ] Postman collection JSON file
- [ ] README.md with setup instructions
- [ ] `.env.example` file
- [ ] Architecture documentation
- [ ] Bonus features documentation (if implemented)
- [ ] ZIP file or GitHub repository link