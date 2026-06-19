<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the deployment documentation for more information.  

If you are looking for a cloud-based platform to deploy your NestJS application, check out Mau, our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$npm install -g @nestjs/mau$ mau deploy
```
With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:  

Visit the NestJS Documentation to learn more about the framework.  

For questions and support, please visit our Discord channel.

To dive deeper and get more hands-on experience, check out our official video courses.

Deploy your application to AWS with the help of NestJS Mau in just a few clicks.

Visualize your application graph and interact with the NestJS application in real-time using NestJS Devtools.

Need help with your project (part-time to full-time)? Check out our official enterprise support.

To stay in the loop and get updates, follow us on X and LinkedIn.

Looking for a job, or have a job to offer? Check out our official Jobs board.

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

---

name: nestjs-best-practices
description: NestJS best practices and architecture patterns for building production-ready applications. This skill should be used when writing, reviewing, or refactoring NestJS code to ensure proper patterns for modules, dependency injection, security, and performance.
metadata:
  author: Kadajett
  version: "1.1.0"

## AGENT SKILL: NESTJS BEST PRACTICES

### 1. Architecture & Project Structure (CRITICAL)
This project follows a strict **feature-based modular architecture** rather than a traditional layered architecture. Each feature is self-contained within its own module directory.

```text
project-backend/
├── prisma/
│   ├── schema.prisma          # Database schema definition
│   └── migrations/            # Database migration history
├── src/
│   ├── main.ts                # Application entry point
│   ├── app.module.ts          # Root module registering all features
│   ├── prisma/                # Core Data Access Layer
│   │   ├── prisma.module.ts   # Dependency injection wrapper
│   │   └── prisma.service.ts  # Prisma client instantiation
│   ├── auth/                  # Authentication & Authorization (JWT)
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts    # Business logic for login and registration
│   │   ├── auth.module.ts     # Authentication module configuration
│   │   ├── dto/               # Data Transfer Objects
│   │   ├── guards/            # Authentication and authorization guards
│   │   └── strategies/        # Passport/JWT authentication strategies
│   ├── users/                 # User Feature Module
│   │   ├── users.controller.ts
│   │   ├── users.service.ts  
│   │   ├── users.module.ts   
│   │   └── dto/               # Input and output DTOs
│   ├── tasks/                 # Task Feature Module
│   │   ├── tasks.controller.ts
│   │   ├── tasks.service.ts  
│   │   ├── tasks.module.ts    
│   │   └── dto/               # Task creation and update DTOs
│   └── postulations/          # Postulation Feature Module
│       ├── postulations.controller.ts
│       ├── postulations.service.ts  
│       ├── postulations.module.ts   [cite: 1]
│       |── dto/               # Input and output DTOs[cite: 1]
│       └── entities/          # Domain entities

#### 1.1 Module Dependency Matrix

To prevent tight coupling and circular dependencies, strict module boundaries are established:

| From Module | To Module | Purpose |
| :--- | :--- | :--- |
| `AppModule` | `UsersModule` | Registers the user management module |
| `AppModule` | `TasksModule` | Registers the task management module |
| `AppModule` | `AuthModule` | Registers the authentication module |
| `AppModule` | `PostulationsModule` | Registers the postulation management module |
| `AppModule` | `PrismaModule` | Registers the database access module |
| `UsersModule` | `PrismaModule` | Accesses the database through UsersService |
| `TasksModule` | `PrismaModule` | Accesses the database through TasksService |
| `PostulationsModule` | `PrismaModule` | Accesses the database through PostulationsService |
| `AuthModule` | `PrismaModule` | Accesses user data and authentication resources |
| `AuthModule` | `JwtModule` | Generates and validates JWT tokens |
| `AuthModule` | `PassportModule` | Provides authentication strategies |

---

### 2. Rule Categories by Priority

The system evaluates NestJS code across 10 structured categories. High-priority items take precedence during automated review and refactoring tasks.

| Priority | Category | Impact Prefix | Description |
| :---: | :--- | :---: | :--- |
| 1 | Architecture | `arch-` | **CRITICAL:** Enforces feature-based modular design and zero circular coupling. |
| 2 | Dependency Injection | `di-` | **CRITICAL:** Mandates constructor injection and bans service locator patterns. |
| 3 | Error Handling | `error-` | **HIGH:** Enforces HTTP standard exceptions and centralized handling. |
| 4 | Security | `security-` | **HIGH:** Requires input validation (DTOs) and guard protection. |
| 5 | Performance | `perf-` | **HIGH:** Prevents memory leaks and heavy database query chains. |
| 6 | Testing | `test-` | **MEDIUM-HIGH:** Mandates testing modules and extensive dependency mocking. |
| 7 | Database & ORM | `db-` | **MEDIUM-HIGH:** Controls transaction bounds and fixes N+1 query structures. |
| 8 | API Design | `api-` | **MEDIUM:** Manages serialization and uniform pipe routing data. |
| 9 | Microservices | `micro-` | **MEDIUM:** Applies event/message queues and health monitoring. |
| 10 | DevOps & Deployment | `devops-` | **LOW-MEDIUM:** Controls environment state and graceful lifecycle shutdowns. |

#### Core Rules Checklist (MUST / SHOULD)

* **[arch-avoid-circular-deps]** MUST NOT introduce circular module dependencies.
* **[arch-feature-modules]** MUST organize code by feature, not technical layers.
* **[di-prefer-constructor-injection]** MUST use constructor-driven injection instead of property injection.
* **[di-avoid-service-locator]** MUST avoid service locator anti-patterns.
* **[security-validate-all-input]** MUST enforce strict input validation via DTOs and `class-validator`.
* **[security-use-guards]** MUST protect endpoints using authentication and authorization guards.
* **[db-avoid-n-plus-one]** SHOULD optimize relational lookups using Prisma to avoid N+1 query problems.
* **[test-use-testing-module]** MUST build testing suites inside isolated `TestingModule` containers with mock providers.

---

### 3. How to Apply This Skill

#### 3.1 Automated AI Code Review

When utilizing this skill with an AI Agent or LLM assistant, provide the following initial context prompt:

```text
"Act as a Senior NestJS & Prisma Architect. Use the loaded 'nestjs-best-practices' skill asset to audit the following target directory or file. Evaluate conformance with critical rules like [arch-avoid-circular-deps] and [di-prefer-constructor-injection]. Provide corrective refactoring samples for any identified violation."
```

3.2 Verification & Local Execution Workflow
Before deploying code modifications or pushing changes to the upstream remote repository, you must guarantee compliance locally through the execution of these commands:

Verify Prisma Schema Realignment:
Generate the local static typings folder based on the updated structural declarations:

```bash
npx prisma generate
```

Sync Database Migrations Environment:
Apply structure updates onto your development database context safely:

```bash
npx prisma migrate dev
```

Run Isolated Test Harness:
Execute Jest validation packages locally to guarantee the dependency tree compiles properly without side effects:

```bash
npm run test
```