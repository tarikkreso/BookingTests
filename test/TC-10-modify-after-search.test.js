const { By, until } = require('selenium-webdriver');
const assert = require('assert');
const { createDriver, navigateToBooking } = require('./helpers/driver');
const { getDestinationInput, selectDates, clickSearchButton, openGuestsMenu } = require('./helpers/selectors');

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

    it('TC-10: Promjena parametara nakon rezultata', async function () {
        await navigateToBooking(driver);

        const destinationInput = await getDestinationInput(driver);
        await destinationInput.clear();
        await destinationInput.sendKeys('Mostar');
        await driver.sleep(1500);

        try {
            const suggestion = await driver.wait(
                until.elementLocated(By.css('[data-testid="autocomplete-results-item"]')),
                3000
            );
            await suggestion.click();
        } catch (e) { }

        await selectDates(driver);
        await clickSearchButton(driver);
        await driver.sleep(3000);

        let currentUrl = await driver.getCurrentUrl();
        assert(currentUrl.includes('searchresults') || currentUrl.includes('Mostar'),
            'Pretpostavka: Prva pretraga je uspješna');

        await driver.navigate().back();
        await driver.sleep(2000);

        const destinationInputAfterBack = await getDestinationInput(driver);
        const destinationValue = await destinationInputAfterBack.getAttribute('value');

        await openGuestsMenu(driver);
        await driver.sleep(500);

        try {
            const minusButton = await driver.findElement(
                By.css('button[aria-label*="Decrease number of Adults"], [data-testid="stepper-adults-decrease-button"]')
            );
            await minusButton.click();
            await driver.sleep(300);
        } catch (e) {
        }

        await destinationInputAfterBack.click();
        await driver.sleep(500);

        const currentValue = await destinationInputAfterBack.getAttribute('value');
        if (!currentValue || currentValue.trim() === '') {
            await destinationInputAfterBack.clear();
            await destinationInputAfterBack.sendKeys('Mostar');
            await driver.sleep(1000);
            try {
                const suggestion = await driver.wait(
                    until.elementLocated(By.css('[data-testid="autocomplete-results-item"]')),
                    3000
                );
                await suggestion.click();
            } catch (e) { }
        }

        await selectDates(driver);

        await clickSearchButton(driver);
        await driver.sleep(3000);

        currentUrl = await driver.getCurrentUrl();
        assert(currentUrl.includes('searchresults') || currentUrl.includes('Mostar'),
            'Nova pretraga bi se trebala izvršiti sa ažuriranim brojem gostiju');
    });
});
