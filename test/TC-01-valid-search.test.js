const { By, until } = require('selenium-webdriver');
const assert = require('assert');
const { createDriver, navigateToBooking } = require('./helpers/driver');
const { getDestinationInput, clickSearchButton, openGuestsMenu, getAdultsCount, selectDates } = require('./helpers/selectors');

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

    it('TC-01: Pretraga sa validnim podacima (Sretna putanja)', async function () {
        await navigateToBooking(driver);

        const destinationInput = await getDestinationInput(driver);
        await destinationInput.click();
        assert(await destinationInput.isDisplayed(), 'Polje bi trebalo biti aktivno za unos');

        await destinationInput.clear();
        await destinationInput.sendKeys('Mostar');
        await driver.sleep(2000);

        try {
            const suggestion = await driver.wait(
                until.elementLocated(By.css('[data-testid="autocomplete-results-item"], .sb-autocomplete-list li')),
                5000
            );
            await suggestion.click();
        } catch (e) {
        }
        await driver.sleep(500);

        await selectDates(driver);

        await openGuestsMenu(driver);
        const adultsCount = await getAdultsCount(driver);
        assert(adultsCount >= 1, 'Broj odraslih bi trebao biti inicijalno postavljen');

        await destinationInput.click();
        await driver.sleep(500);

        await clickSearchButton(driver);
        await driver.sleep(3000);

        const currentUrl = await driver.getCurrentUrl();
        assert(currentUrl.includes('searchresults') || currentUrl.includes('Mostar'),
            'Korisnik bi trebao biti preusmjeren na stranicu sa rezultatima');
    });
});
