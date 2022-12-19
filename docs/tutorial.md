---
sidebar_position: 1
---

# aidbox-develop-starter-guide

## Intro

Welcome to the tutorial! In this tutorial, we will be creating a MVP application for doctors in laboratories to use for determining *hemoglobin levels.

<sub><sup>*Hemoglobin is a protein found in the blood that is responsible for transporting oxygen throughout the body. It is measured in units per deciliter of blood (g/dL).</sup></sub>

## Features

- Getting the [Patient](https://build.fhir.org/patient.html) resource list
- Create a Patient resource
- Getting a list of [Observation](https://build.fhir.org/observation.html) resources for the specified patient
- Creating an Observation resource

## Setup

You will need a [docker](https://www.docker.com/) installed in your operating system for development.

Create a directory with any name, in the tutorial it will be called `main-directory`.

In the `main-directory`, create and launch an [Aidbox application](https://www.health-samurai.io/aidbox) by following the [guide on the official Aidbox documentation site](https://docs.aidbox.app/getting-started/run-aidbox-locally-with-docker).

Next, in the `main-directory` create a React application with the command:
```bash
yarn create react-app frontend --template typescript
```

You should end up with this structure:
```
main-directory
├── aidbox-docker-compose
│   ├── docker-compose.yaml
│   ├── .env
│   ├── .git
│   ├── pgdata
│   ├── zen-package.edn
│   └── zrc
└── frontend
    ├── .git
    ├── .gitignore
    ├── node_modules
    ├── package.json
    ├── public
    ├── README.md
    ├── src
    ├── tsconfig.json
    └── yarn.lock
```