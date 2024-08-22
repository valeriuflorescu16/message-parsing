# Patient Message Parsing Application

## Overview

This application parses patient messages formatted in a specific standard, extracting relevant information such as the patient's name, date of birth, and primary condition. The current implementation supports basic functionality for parsing messages and can be easily tested using tools like Postman.

## Getting Started

### Running the Application Locally

To run the application locally, use the following steps:

1. Ensure you have Node.js and npm installed on your machine.
2. Clone the repository and navigate to the project directory.
3. Install the dependencies:

   ```bash
   npm install

   ```

4. Build and start the server

```
npm run build
npm start
```

Example body for Postman (at URL http://localhost:8080/patientMessage):

```
{
  "message": "MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233\n||DATA^TYPE|123456|P|2.5\nEVT|TYPE|20230502112233\nPRS|1|9876543210^^^Location^ID||Valeriu^Florescu|||M|19990530|\nDET|1|I|^^MainDepartment^101^Room 1|Common Cold"
}
```

## Codebase Structure

### Current Structure

The project is organized with a clear separation of concerns in mind:

1. Controllers: Handle HTTP requests and responses. They orchestrate the flow of data between the client and the application’s business logic.
2. Services: Contain the core business logic. Services are reusable and encapsulate the logic for processing patient messages.
3. Middlewares: Implement reusable request processing logic - currently only creating router and handling routes.
4. Types: Define TypeScript interfaces and types used throughout the application, ensuring strong typing and reducing runtime errors.

## Full Application Structure

In a full-fledged application, the structure would be further expanded to include additional layers and components to ensure maintainability, scalability, and robustness:

1. Data Access Layer: This layer would interact with the database, abstracting all database operations such as querying and inserting records. This abstraction allows for easier changes to the database technology or structure without affecting other parts of the application.

2. Centralized Error Handling: A dedicated middleware for catching and handling errors consistently across the application. This would include:

- Custom error classes for different error types (e.g., ValidationError, DatabaseError).
- Returning user-friendly error messages while logging detailed error information for debugging purposes.

3. Logging: Implementing structured logging throughout the application, with careful attention to omitting sensitive information. This would aid in monitoring and troubleshooting in production environments.

### Scalability and Future Extensions

1. Monolithic to Microservices: While a monolithic approach is sufficient for a simple application, transitioning to a microservices architecture could be considered for better scalability in larger applications. Each service would handle a specific domain, reducing dependencies and allowing independent scaling.

2. Database Optimization: Using efficient database queries, indexing, and caching strategies to improve performance as the data grows. Technologies like MongoDB could be employed, with appropriate optimization techniques.

3. API Versioning: Implementing versioning to allow backward compatibility as new features are added. This ensures that existing clients continue to work without modifications. For example, this might be useful if we decide we need a different response from an existing endpoint, but we don't want this to affect existing clients.

4. Continuous Integration/Continuous Deployment (CI/CD): Integrating a CI/CD pipeline to automate testing, building, and deployment. This reduces manual errors and speeds up the development process.

5. Advanced Security Measures: Implementing advanced security practices, such as JWT-based authentication, encryption of sensitive data. This could leverage middlewares for authentication checks for example.
