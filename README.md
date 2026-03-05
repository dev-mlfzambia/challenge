
---

# Setup

## 1. Install Dependencies

```bash
yarn install
```

---

# Coding Challenge Duration

Candidates are given **4 days to complete this coding challenge**.

The **4-day period starts from the moment the challenge is received**.

During this time, the candidate is expected to:

* Identify the issues in the system
* Implement the necessary fixes
* Ensure the application builds and runs successfully
* Submit their solution via a **Pull Request**

Submissions received **after the 4-day window may not be considered**.

---

# Contribution Guidelines

Contributions are welcome through pull requests.

1. Fork this repository.
2. Clone your fork locally.
3. Checkout the `main` branch:

```bash
git checkout main
```

4. Pull the latest changes:

```bash
git pull upstream main
```

5. Create a new branch for your fix or feature:

```bash
git checkout -b <fix/feature>-<short-description>
```

6. Commit your changes and push to your fork.
7. Open a Pull Request against this repository.

Your changes will then be reviewed.

---

# Database Setup

The project requires a PostgreSQL database populated using the provided `core_banking.sql` file.

## Prerequisites

Ensure the following are available:

* PostgreSQL installed and running
* `psql` command-line tool
* A PostgreSQL user with sufficient privileges (e.g., `postgres`)
* The `core_banking.sql` file in the project directory

---

## 1. Create the Database

If the database does not already exist, run:

```bash
psql -h localhost -U postgres -c "CREATE DATABASE core_banking;"
```

You will be prompted for your PostgreSQL password.

If the database already exists, you can skip this step.

---

## 2. Import the Database

Run the following command to import the schema and data:

```bash
psql -h localhost -U postgres -d core_banking < core_banking.sql
```

This command loads all tables, relationships, and seed data into the `core_banking` database.

---

## 3. Verify the Import

You can confirm the import was successful by listing the tables:

```bash
psql -h localhost -U postgres -d core_banking
\dt
```

---

## Example Full Workflow

```bash
psql -h localhost -U postgres -c "CREATE DATABASE core_banking;"
psql -h localhost -U postgres -d core_banking < core_banking.sql
psql -h localhost -U postgres -d core_banking
\dt
```

---

## Demo Credentials

```
Username: training
Password: test@123
```

---

# Running the Application

### Development

```bash
yarn start:dev
```

---

# Known Issues

This project contains **intentional issues** meant for debugging and evaluation.

Your task is to **identify the cause and implement the correct fix** so the system behaves as expected.

---

## 1. Group Endpoint Missing `officeName`

### Problem

When retrieving a group by its ID, the API response does not include the **office name**, even though the group belongs to an office.

### Expected Behavior

The endpoint should return the **office name as part of the group data**.

### Developer Task

* Locate the endpoint responsible for retrieving a group by ID.
* Investigate why the office name is not included.
* Update the query or response mapping so the office name is returned.

### Expected Result

The API response should include the correct `officeName`.

---

## 2. Status Filter Ignored

### Problem

The endpoint that retrieves groups accepts a `status` filter, but the filter has **no effect**.
All groups are returned regardless of the provided value.

### Expected Behavior

When a `status` parameter is provided, the API should return **only groups with that status**.

### Developer Task

* Locate where the groups query is executed.
* Ensure the `status` parameter is applied to the query.

### Expected Result

Providing `status=ACTIVE` should return **only active groups**.

---

## 3. Build Failure

### Problem

The project fails to start or build due to a **missing or incorrect import**.

### Expected Behavior

The project should **compile and run successfully**.

### Developer Task

* Identify the source of the build error.
* Correct the missing or incorrect import.

### Expected Result

The project should start successfully with:

```bash
yarn start:dev
```

---

## 4. RBAC Bypass (Authentication Issue)

### Problem

Some protected endpoints are accessible **without the required permissions**.

### Expected Behavior

Endpoints requiring authentication or specific roles should **properly enforce access restrictions**.

### Developer Task

* Review how authentication and authorization are implemented.
* Ensure role checks and guards are correctly applied.

### Expected Result

Users without the required permissions should **not be able to access restricted endpoints**.

---

# Tech Stack

* **Framework:** NestJS
* **Language:** TypeScript
* **Database:** PostgreSQL
* **ORM:** TypeORM
* **Testing:** Jest

---

# License

MIT License.

---