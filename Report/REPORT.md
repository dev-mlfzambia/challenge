# Coding Challenge Report

## Overview

This report documents the steps I took to set up, investigate, debug, and resolve the issues present in the provided NestJS backend challenge. The goal was to run the system locally, identify the problems described in the challenge, and implement the appropriate fixes.

The project stack includes:

- NestJS
- TypeScript
- PostgreSQL
- TypeORM

---

## Repository Setup

The challenge repository link was provided and I accessed it through my browser. After opening the repository, I forked it into my own GitHub account.

Forking the repository creates a duplicate copy under my GitHub account. This allows me to clone the project locally, make changes freely, and push my updates to my own repository without modifying the original project. Collaboration then happens through a **Pull Request**, where the original maintainers can review the changes before merging them.

After cloning my fork locally, I installed the dependencies using:


yarn install


Next, I inspected the `package.json` file to understand the available scripts and the general configuration of the project.

To run the project in development mode, I used the following command:


yarn start:dev


---

## Initial Build Errors

When attempting to start the project, the application failed to compile.

My IDE highlighted multiple errors inside the `GroupController`. After reviewing the code carefully, I noticed that several controller methods were appearing outside the scope of the class.

### Root Cause

A premature closing curly brace `}` appeared in the middle of the controller class. Because of this, the remaining methods were interpreted as being outside the class definition, which resulted in multiple TypeScript syntax errors.

### Fix

Removing the misplaced closing brace restored the correct structure of the controller class and resolved the compilation errors.

---

## Additional Import Error

After fixing the controller issue and running the project again, another error appeared.

### Root Cause

`AppService` was referenced inside `AppController` but was not imported.

### Fix

Adding the missing import resolved the issue and allowed the application to continue building.

---

## Database Setup

At this point the project was still unable to run fully because PostgreSQL had not yet been configured locally.

Following the instructions in the README, I created the database and imported the provided SQL seed file.

There were a few minor setup issues related to my local PostgreSQL configuration, but after resolving those the database import completed successfully.

Using **pgAdmin**, I verified that the tables were correctly created and populated. Once the database was available, the NestJS application was able to connect successfully.

---

## API Exploration

To understand how to interact with the API, I reviewed the **Swagger documentation** exposed by the application.

Swagger provides an interactive view of the API endpoints and their required parameters.

When I attempted to retrieve groups using Postman, I received the following response:


401 Unauthorized


Initially I suspected there might have been an issue with my setup or database connection. However, after reviewing the Swagger interface more carefully I noticed the **Authorize** button, which indicates that the API requires a **Bearer Token** for authenticated requests.

---

## Authentication Investigation

The README provided demo credentials:


Username: training
Password: test@123


To authenticate, I used the following endpoint:


POST /api/v1/auth/login


However, the login request returned:


Invalid credentials


### Debugging Process

To investigate further, I reviewed the `AuthService.validateUser()` method and added temporary console logs just before the `UnauthorizedException`.

The logs confirmed that:

- The `training` user exists in the database
- The user record is successfully retrieved
- However, the password hash comparison fails

This indicates that the credentials provided in the README do not match the stored bcrypt password hash.

At this point I contacted the team to confirm whether the credentials needed correction.

---

## Temporary Testing Workaround

To continue testing the remaining parts of the system for the purposes of the challenge, I temporarily bypassed the password validation condition.

This allowed the login endpoint to generate a valid JWT token, which I then used in Postman by adding it as a **Bearer Token** in the Authorization header.

Once authenticated, I was able to successfully access the protected API endpoints.

This temporary change was only used to facilitate testing and would **not be appropriate in a real production environment**.

---

## Issue 1 – Group Endpoint Missing `officeName`

While testing the endpoint for retrieving a group by ID, I expected the `officeName` field to be missing based on the challenge description.

However, in the current implementation the `officeName` field was already included in the response.

Because of this, no additional changes were required for this issue.

---

## Issue 2 – Status Filter Ignored

### Problem

The endpoint responsible for retrieving groups accepted a `status` query parameter but did not apply the filter to the query results.

### Investigation

I reviewed the controller and saw that the query parameters were passed into the service layer. The service used a query builder to construct the database query.

While search filters were implemented, the `status` parameter was not being applied.

### Fix

I added a conditional clause to enforce the status filter when provided.

Example:

```ts
if (filters.status?.trim()) {
  queryBuilder.andWhere('status.name = :status', {
    status: filters.status,
  });
}
Result

The API now correctly filters groups when a status parameter is supplied.

Issue 3 – Build Failure

The build failure was resolved earlier by:

fixing the incorrect controller class structure

adding the missing AppService import

After these fixes the project compiled successfully.

Issue 4 – RBAC Enforcement

The final issue related to role-based access control.

I took this opportunity to deepen my understanding of how NestJS handles authentication and authorization using Guards. I reviewed the official NestJS documentation and watched additional learning material to better understand the architecture.

To investigate how roles were handled, I added temporary console logs inside the RolesGuard to observe the role information extracted from incoming requests.

Observation

When testing certain routes, I noticed that some endpoints used the @Auth() decorator without specifying roles.

Fix

I updated the affected endpoints to explicitly include the appropriate role from the RoleTypes enum.

For example:

@Auth(RoleTypes.LOAN_OFFICER)
Verification

Testing confirmed that:

a user with the loan_officer role can successfully access the endpoint

changing the role requirement to branch_manager correctly returns 401 Unauthorized

This confirms that RBAC enforcement is working as expected.

Learning Notes

Before beginning the challenge, I refreshed my knowledge of several technologies used in the project, including:

TypeORM

TypeScript

NestJS

This helped me navigate the project structure and debug the issues more efficiently.
