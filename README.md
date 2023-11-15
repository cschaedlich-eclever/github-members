# Run project

1. **For testing:**
    - Install dependencies
        ```bash
        yarn
        ```
    - Start Docker containers:
        ```bash
        docker-compose up -d postgres-test github-mock
        ```
    - Run tests:
        ```bash
        yarn run test
        ```

2. **For local:**
    - Install dependencies
        ```bash
        yarn
        ```
    - Start Docker container:
        ```bash
        docker-compose up -d postgres 
        ```
    - Start application:
        ```bash
        yarn run start
        ```

# Schemas

1. **employees:**
    - id (primary)
    - login (unique)
    - name

2. **projects:**
    - id (primary)
    - name (unique)

3. **employees_projects:**
    - employee_id
    - project_id
    - owner
    - primary: [employee_id, project_id]

4. **languages:**
    - id (primary)
    - name (unique)

5. **projects_languages:**
    - project_id
    - language_id
    - loc
    - primary: [project_id, language_id]
