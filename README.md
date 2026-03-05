---

# Setup

## 1. Install Dependencies

```bash
npm install
```

---

# Database Setup

Import the provided SQL database into PostgreSQL.

### Prerequisites

* PostgreSQL installed and running
* `psql` CLI available
* `core_banking.sql` file in the project directory

### Create Database

```bash
psql -h localhost -U postgres -c "CREATE DATABASE core_banking;"
```

### Import Database

```bash
psql -h localhost -U postgres -d core_banking < core_banking.sql
```

### Verify Import

```bash
psql -h localhost -U postgres -d core_banking
\dt
```

### Demo Credentials

```
Username: training
Password: test@123
```

---

# Running the Application

### Development

```bash
yarn run start:dev
```

---

# Known Issues

The system contains a few intentional issues.
Your task is to **identify the cause and fix them so the system behaves correctly**.

---

## 1. Group Endpoint Missing `officeName`

**Problem**

When retrieving a group by its ID, the response does not include the **office name**, even though the group belongs to an office.

**What is expected**

The endpoint should return the **office name as part of the group data**.

**What the developer should do**

* Find the endpoint responsible for fetching a group by ID.
* Investigate why the office name is not being returned.
* Update the code so that the office name is included in the response.

**Expected result**

When requesting a group, the API response should include the correct `officeName`.

---

## 2. Status Filter Ignored

**Problem**

The endpoint that retrieves groups allows a `status` filter, but the filter has **no effect**.
Regardless of the value provided, the API returns all groups.

**What is expected**

When a status is provided, the API should return **only groups that match that status**.

**What the developer should do**

* Identify where the groups query is executed.
* Ensure the `status` parameter is actually used when retrieving groups.

**Expected result**

If `status=ACTIVE` is provided, only active groups should be returned.

---

## 3. Build Failure

**Problem**

The project fails to start or build due to a **missing or incorrect import**.

**What is expected**

The project should **compile and run successfully**.

**What the developer should do**

* Identify the source of the build error.
* Fix the incorrect or missing import.

**Expected result**

The project should start successfully using:

```bash
yarn run start:dev
```

---

## 4. RBAC Bypass (Authentication Issue)

**Problem**

Protected endpoints are accessible **even when the user should not have permission**.

**What is expected**

Endpoints that require authentication or specific roles should **properly enforce access restrictions**.

**What the developer should do**

* Investigate how authentication and authorization are implemented.
* Fix the logic so that only authorized users can access protected endpoints.

**Expected result**

Users without proper permissions should **not** be able to access restricted endpoints.

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
