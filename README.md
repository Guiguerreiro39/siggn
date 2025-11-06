# Siggn

A monorepo for a collection of lightweight, type-safe packages for message-driven architecture in TypeScript.

## About

This repository hosts the `Siggn` project, a set of tools designed to facilitate building applications using a message bus pattern. The core idea is to provide simple, composable, and type-safe utilities that can be used in any TypeScript environment.

## Packages

This monorepo contains the following packages:

| Package                          | Description                                              | NPM
| -------------------------------- | -------------------------------------------------------- | -------
| [`@siggn/core`](./packages/core) | A lightweight and type-safe message bus system. | [![npm version](https://badge.fury.io/js/%40siggn%2Fcore.svg)](https://www.npmjs.com/package/%40siggn%2Fcore)
| [`@siggn/react`](./packages/react) | Siggn message bus system for React. | [![npm version](https://badge.fury.io/js/%40siggn%2Freact.svg)](https://www.npmjs.com/package/%40siggn%2Freact)

_(More packages will be added here as they are developed.)_

## Getting Started

To get started with developing in this monorepo, you'll need to have [pnpm](https://pnpm.io/) installed.

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Guiguerreiro39/siggn.git
    cd siggn
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

## Contributing

Contributions are welcome! If you have a feature request, bug report, or want to contribute to the code, please feel free to open an issue or a pull request.

## License

This project is licensed under the MIT License.
