const { By, until } = require('selenium-webdriver');
const assert = require('assert');
const { createDriver, navigateToBooking } = require('./helpers/driver');
const { getDestinationInput, openGuestsMenu, addChild, selectChildAge, selectDates, clickSearchButton } = require('./helpers/selectors');

describe('Decision Table Testing', function () {
    this.timeout(120000);
    let driver;

    beforeEach(async function () {
        driver = await createDriver();
    });

    afterEach(async function () {
        if (driver) {
            await driver.quit();
        }
    });

    it('TC-06: Validna destinacija i djeca sa ispravnom dobi', async function () {
        await navigateToBooking(driver);

        const destinationInput = await getDestinationInput(driver);
        await destinationInput.clear();
        await destinationInput.sendKeys('Sarajevo');
        await driver.sleep(1500);

        try {
            const suggestion = await driver.wait(
                until.elementLocated(By.css('[data-testid="autocomplete-results-item"]')),
                3000
            );
            await suggestion.click();
        } catch (e) { }

        await selectDates(driver);

        await openGuestsMenu(driver);
        await driver.sleep(500);
        await addChild(driver);
        await driver.sleep(500);

        await selectChildAge(driver, '5');
        await driver.sleep(500);

        await destinationInput.click();
        await driver.sleep(500);

        await clickSearchButton(driver);
        await driver.sleep(3000);

        const currentUrl = await driver.getCurrentUrl();
        assert(currentUrl.includes('searchresults') || currentUrl.includes('Sarajevo'),
            'Sistem bi trebao prihvatiti unos i preusmjeriti na rezultate');
    });
});
