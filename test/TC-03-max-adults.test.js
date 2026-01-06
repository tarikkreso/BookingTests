const assert = require('assert');
const { createDriver, navigateToBooking } = require('./helpers/driver');
const { openGuestsMenu, getAdultsCount, clickPlusAdults } = require('./helpers/selectors');

describe('Boundary Value Analysis', function () {
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

    it('TC-03: Maksimalan broj odraslih osoba', async function () {
        await navigateToBooking(driver);

        await openGuestsMenu(driver);
        await driver.sleep(500);

        let previousCount = 0;
        let currentCount = await getAdultsCount(driver);
        let attempts = 0;
        const maxAttempts = 35;

        while (currentCount < 30 && attempts < maxAttempts) {
            await clickPlusAdults(driver);
            await driver.sleep(100);
            previousCount = currentCount;
            currentCount = await getAdultsCount(driver);
            attempts++;

            if (currentCount === previousCount && attempts > 5) {
                break;
            }
        }

        const countBeforeExtraClick = await getAdultsCount(driver);
        await clickPlusAdults(driver);
        await driver.sleep(300);
        const countAfterExtraClick = await getAdultsCount(driver);

        assert(countAfterExtraClick <= 30, 'Broj odraslih ne bi trebao prelaziti 30');
        assert(countAfterExtraClick === countBeforeExtraClick || countAfterExtraClick === 30,
            'Dugme + bi trebalo biti neaktivno na maksimalnoj vrijednosti');
    });
});
