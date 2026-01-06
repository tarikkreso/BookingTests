# Booking.com Selenium Test Suite

Automated tests for Booking.com using Selenium WebDriver, JavaScript, and Mocha framework.

## Prerequisites

- Node.js (v14 or newer)
- Google Chrome browser
- npm (comes with Node.js)

## Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd Testovi2
npm install
```

ChromeDriver will be automatically downloaded during installation. If automatic installation fails, download the appropriate version from [Chrome for Testing](https://googlechromelabs.github.io/chrome-for-testing/) and extract it to the `chromedriver-win64/` folder.

## Running Tests

Run all tests:

```bash
npm test
```

Run a specific test:

```bash
npm test -- --grep "TC-01"
```

Run by category:

```bash
npm test -- --grep "Equivalence Partitioning"
```

Run a single test file:

```bash
npx mocha test/TC-01-valid-search.test.js
```

## Project Structure

```
test/
├── helpers/
│   ├── driver.js          # Driver setup and configuration
│   └── selectors.js       # Helper functions for element selection
├── TC-01-valid-search.test.js
├── TC-02-empty-destination.test.js
├── TC-03-max-adults.test.js
├── TC-04-min-rooms.test.js
├── TC-05-children-no-age.test.js
├── TC-06-children-with-age.test.js
├── TC-07-error-recovery.test.js
├── TC-08-invalid-date-range.test.js
├── TC-09-whitespace-destination.test.js
└── TC-10-modify-after-search.test.js
```

## Test Cases

| ID | Testing Technique | Description |
|----|-------------------|-------------|
| TC-01 | Equivalence Partitioning | Valid search with proper inputs |
| TC-02 | Equivalence Partitioning | Empty destination field |
| TC-03 | Boundary Value Analysis | Maximum number of adults (30) |
| TC-04 | Boundary Value Analysis | Minimum number of rooms (1) |
| TC-05 | Decision Table Testing | Children added without age |
| TC-06 | Decision Table Testing | Children with valid age |
| TC-07 | State Transition Testing | Error recovery flow |
| TC-08 | Statement & Decision Coverage | Invalid date range |
| TC-09 | Error Guessing | Whitespace in destination field |
| TC-10 | Error Guessing | Parameter modification after search |

## Configuration

The `.mocharc.json` file contains Mocha settings:

```json
{
  "timeout": 120000,
  "recursive": true,
  "spec": "test/**/*.js"
}
```

The timeout is set to 120 seconds per test. Increase this value if tests fail due to slow network or system performance.

## Troubleshooting

### ChromeDriver version mismatch

Check your Chrome version:

```bash
chrome --version
```

Download the matching ChromeDriver from [Chrome for Testing](https://googlechromelabs.github.io/chrome-for-testing/) and extract it to `chromedriver-win64/`.

### Tests timeout

Increase the timeout in `.mocharc.json`:

```json
{
  "timeout": 180000
}
```
## Dependencies

- selenium-webdriver (^4.27.0)
- mocha (^10.8.2)
- chai (^4.5.0)


