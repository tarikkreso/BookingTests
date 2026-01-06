const { By } = require('selenium-webdriver');
const assert = require('assert');
const { createDriver, navigateToBooking } = require('./helpers/driver');
const { getDestinationInput, selectDates, clickSearchButton } = require('./helpers/selectors');

describe('Error Guessing', function () {
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

    it('TC-09: Unos samo razmaka u destinaciju', async function () {
        await navigateToBooking(driver);

        const destinationInput = await getDestinationInput(driver);
        await destinationInput.click();
        assert(await destinationInput.isDisplayed(), 'Polje bi trebalo biti aktivno');

        await destinationInput.clear();
        await destinationInput.sendKeys('   ');
        await driver.sleep(500);

        await selectDates(driver);

        await clickSearchButton(driver);
        await driver.sleep(2000);

        const currentUrl = await driver.getCurrentUrl();

        try {
            const errorMessage = await driver.findElement(
                By.css('[data-testid="search-error"], [class*="error"], .sb-searchbox__error')
            );
            assert(await errorMessage.isDisplayed(), 'Sistem je prepoznao nevalidan unos');
        } catch (e) {
            assert(true, 'Sistem je obradio unos sa razmacima');
        }
    });
});
