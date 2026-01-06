const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');

const chromedriverPath = path.join(__dirname, '..', '..', 'chromedriver-win64', 'chromedriver.exe');
const service = new chrome.ServiceBuilder(chromedriverPath);

const chromeOptions = new chrome.Options();
chromeOptions.addArguments('--start-maximized');
chromeOptions.addArguments('--no-sandbox');
chromeOptions.addArguments('--disable-dev-shm-usage');
chromeOptions.addArguments('--disable-gpu');
chromeOptions.addArguments('--disable-blink-features=AutomationControlled');
chromeOptions.addArguments('--disable-notifications');
chromeOptions.excludeSwitches('enable-automation');

async function createDriver() {
    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeService(service)
        .setChromeOptions(chromeOptions)
        .build();
    return driver;
}

async function navigateToBooking(driver) {
    await driver.get('https://www.booking.com');
    await driver.sleep(2000);

    try {
        const acceptButton = await driver.wait(
            until.elementLocated(By.css('button#onetrust-accept-btn-handler')),
            5000
        );
        await acceptButton.click();
        await driver.sleep(1000);
    } catch (e) {
    }

    try {
        const closeButton = await driver.wait(
            until.elementLocated(By.css('button[aria-label="Dismiss sign-in info."]')),
            3000
        );
        await closeButton.click();
        await driver.sleep(500);
    } catch (e) {
    }
}

module.exports = {
    createDriver,
    navigateToBooking
};
