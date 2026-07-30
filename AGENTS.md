# AGENTS.md

# Smart Elephant

This document defines how AI coding agents (Codex, ChatGPT, GitHub Copilot, etc.)
should work inside this repository.

---

# Project Mission

Smart Elephant is a production-quality multilingual EdTech platform
focused on speech and language development for preschool children.

This repository is also a Full Stack Engineering learning project.

The goals are equally important:

1. Build a commercial-quality application.
2. Develop professional Full Stack engineering skills.

Never optimize one goal at the expense of the other.

---

# Technology Stack

Frontend

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- shadcn/ui

Backend

- Java
- Spring Boot
- PostgreSQL

Future

- Docker
- Redis
- Kafka
- AWS
- Kubernetes

---

# Architecture

Always follow Feature-first Architecture.

Avoid organizing code by file type whenever possible.

Features own their:

- pages
- components
- hooks
- services
- types
- tests

Shared code belongs in shared/.

Architecture evolves naturally:

Feature Modules
↓

Modular Monolith
↓

Microservices

Never introduce complexity prematurely.

---

# AI Engineering Principles

AI assists engineering.

AI does NOT replace engineering.

Always:

- explain architectural trade-offs;
- preserve clean architecture;
- avoid unnecessary abstractions;
- avoid overengineering;
- write maintainable code.

---

# React Guidelines

Prefer:

- Functional Components
- Hooks
- Composition
- Small Components

Avoid:

- Huge components
- Deep prop drilling
- Premature optimization

Explain React concepts whenever introducing something new.

---

# TypeScript

Always prefer:

- explicit interfaces
- strong typing
- readonly when appropriate

Avoid:

- any
- unnecessary type assertions

---

# Code Quality

Follow:

- Clean Code
- SOLID
- DRY
- KISS
- YAGNI

Write production-quality code.

---

# Accessibility

Always consider:

- semantic HTML
- keyboard navigation
- aria labels
- screen readers

---

# Responsive Design

Mobile First.

Use responsive Tailwind utilities.

Never hardcode desktop layouts.

---

# Internationalization

The application is multilingual.

Supported MVP languages:

- Hebrew
- Russian
- Ukrainian

Never hardcode user-visible strings.

Everything must be translatable.

RTL support must always be considered.

---

# Learning Philosophy

Never immediately generate large implementations.

Instead:

1. Explain.
2. Discuss architecture.
3. Implement incrementally.
4. Review.
5. Refactor.

Teaching is as important as coding.

---

# GitHub Copilot / Codex

Before generating code:

- understand the task;
- preserve existing architecture;
- avoid duplicate logic;
- reuse existing components.

Generated code should always be reviewed.

---

# Pull Request Standard

Before considering work complete ask:

Would I approve this Pull Request for production?

If the answer is "No",

improve it first.

---

# Most Important Rule

If there is a choice between:

building faster

or

building correctly,

always choose correctness.