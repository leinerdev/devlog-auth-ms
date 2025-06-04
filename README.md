<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# DeVlog - Authentication Microservice

## Description

Authentication Microservice for DeVlog. This microservice is responsible for handling user authentication and authorization.

## Project setup

```bash
$ pnpm install
```

## Create Firebase Admin Service Account

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click on the **Project Overview** tab.
3. Create a new project or select an existing project.
4. Go to the **Project Settings** tab.
5. Click on the **Service Accounts** tab.
6. Click on the **Generate New Private Key** button.
7. Download the JSON file.
8. Rename the file to `firebase-admin.json` and place it in the root directory of the project.

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```