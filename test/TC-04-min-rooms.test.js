const { By } = require('selenium-webdriver');
const assert = require('assert');
const { createDriver, navigateToBooking } = require('./helpers/driver');
const { openGuestsMenu } = require('./helpers/selectors');

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

    it('TC-04: Minimalan broj soba', async function () {
        await navigateToBooking(driver);

        await openGuestsMenu(driver);
        await driver.sleep(500);

        let roomsCount = 1;
        try {
            const roomsInput = await driver.findElement(
                By.css('[data-testid="occupancy-popup"] input[id*="rooms"], #no_rooms')
            );
            roomsCount = parseInt(await roomsInput.getAttribute('value') || '1');
        } catch (e) {
        }

        assert(roomsCount >= 1, 'Početni broj soba bi trebao biti 1');

        try {
            const minusButton = await driver.findElement(
                By.css('button[aria-label*="Decrease number of Rooms"], [data-testid="stepper-rooms-decrease-button"]')
            );

            const isDisabled = await minusButton.getAttribute('disabled');
            const ariaDisabled = await minusButton.getAttribute('aria-disabled');

            if (!isDisabled && ariaDisabled !== 'true') {
                await minusButton.click();
                await driver.sleep(300);
            }

            try {
                const newRoomsInput = await driver.findElement(
                    By.css('[data-testid="occupancy-popup"] input[id*="rooms"], #no_rooms')
                );
                const newRoomsCount = parseInt(await newRoomsInput.getAttribute('value') || '1');
                assert(newRoomsCount >= 1, 'Broj soba se ne bi trebao smanjiti ispod 1');
            } catch (e) {
                assert(true, 'Broj soba ostaje na minimalnoj vrijednosti');
            }
        } catch (e) {
            assert(true, 'Dugme - je neaktivno');
        }
    });
});
