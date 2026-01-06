const { By } = require('selenium-webdriver');
const assert = require('assert');
const { createDriver, navigateToBooking } = require('./helpers/driver');
const { getDestinationInput, clickSearchButton } = require('./helpers/selectors');

describe('Equivalence Partitioning', function () {
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

    it('TC-02: Pretraga sa nevažećom destinacijom (Prazno polje)', async function () {
        await navigateToBooking(driver);

        const destinationInput = await getDestinationInput(driver);
        await destinationInput.clear();
        await driver.sleep(500);

        await clickSearchButton(driver);
        await driver.sleep(2000);

        const currentUrl = await driver.getCurrentUrl();

        try {
            const errorMessage = await driver.findElement(
                By.css('[data-testid="search-error"], .sb-searchbox__error, [class*="error"]')
            );
            assert(await errorMessage.isDisplayed(), 'Poruka o grešci bi trebala biti prikazana');
        } catch (e) {
            assert(currentUrl.includes('booking.com') && !currentUrl.includes('searchresults'),
                'Korisnik bi trebao ostati na početnoj stranici');
        }
    });
});
