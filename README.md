# 🚀 Sauce Demo - Cypress Automation 🌲

This is an automation testing project using [Cypress](https://www.cypress.io/) for the [Sauce Demo](https://www.saucedemo.com/) website by Swag Labs.

## 📌 About

This project automates test scenarios for Sauce Demo, a web application designed for practicing UI and end-to-end testing. It serves as a practical example of how to use Cypress to interact with web elements, validate functionalities, and improve test automation skills.

Additionally, this project supports **parallel test execution**, optimizing test runtime and improving efficiency.  

## ✅ Pre-requirements

Before running the project, ensure you have the following installed:

- **Git** (tested with version `2.24.1` or later)
- **Node.js** (tested with version `20.14.0` or later)
- **npm** (tested with version `10.7.0` or later)

> ⚠️ It is recommended to use the same or later LTS versions for compatibility.

## 🚀 Installation

1. Clone the repository:

   ```sh
    git@github.com:otavioqs16/swag-labs-cypress-automation.git
    cd swag-labs-cypress-automation
   ```

2. Install dependencies:

    ```sh
    npm install
    ```
## ▶️ Running the Tests
To execute the test suite, use one of the following commands:

- Run tests in **headed mode** (with UI):

    ```sh
    npm run cy:open
    ```
- Run tests in **headless mode** (faster execution):
    ```sh
    npm run test
    ```
- Run tests in parallel mode (requires a Cypress Dashboard key):
    ```sh
    npm run test:cloud
    ```
> ℹ️ Parallel execution requires setting up a [Cypress Dashboard](https://www.cypress.io/cloud) and obtaining an API key.

## 🤝 Contributing
Feel free to contribute by submitting issues, feature requests, or pull requests!


## ⭐ Support This Project
If you find this project useful, consider leaving a ⭐ to show your support!