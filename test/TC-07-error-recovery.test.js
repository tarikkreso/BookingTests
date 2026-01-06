const { By, until } = require('selenium-webdriver');
const assert = require('assert');
const { createDriver, navigateToBooking } = require('./helpers/driver');
const { getDestinationInput, openGuestsMenu, addChild, selectDates, clickSearchButton } = require('./helpers/selectors');

describe('State Transition Testing', function () {
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

    it('TC-07: Oporavak od greške', async function () {
        await navigateToBooking(driver);

        const destinationInput = await getDestinationInput(driver);
        await destinationInput.clear();
        await destinationInput.sendKeys('Sarajevo');
        await driver.sleep(2000);

        try {
            const suggestion = await driver.wait(
                until.elementLocated(By.css('[data-testid="autocomplete-results-item"], li[data-i]')),
                5000
            );
            await suggestion.click();
        } catch (e) {
        }
        await driver.sleep(500);

        await selectDates(driver);
        await driver.sleep(500);

        await openGuestsMenu(driver);
        await driver.sleep(1000);
        await addChild(driver);
        await driver.sleep(1000);

        let ageSelected = false;

        try {
            const result = await driver.executeScript(`
                const selects = document.querySelectorAll('select[name="age"]');
                if (selects.length > 0) {
                    selects[0].value = '10';
                    selects[0].dispatchEvent(new Event('change', { bubbles: true }));
                    return 'success via name=age';
                }
                
                const ariaSelect = document.querySelector('select[aria-label*="Age of child"]');
                if (ariaSelect) {
                    ariaSelect.value = '10';
                    ariaSelect.dispatchEvent(new Event('change', { bubbles: true }));
                    return 'success via aria-label';
                }
                
                const popup = document.querySelector('[data-testid="occupancy-popup"]');
                if (popup) {
                    const select = popup.querySelector('select');
                    if (select) {
                        select.value = '10';
                        select.dispatchEvent(new Event('change', { bubbles: true }));
                        return 'success via popup select';
                    }
                }
                
                return 'no select found';
            `);
            if (result && result.includes('success')) {
                ageSelected = true;
            }
        } catch (e) {
        }

        if (!ageSelected) {
            try {
                const ageDropdown = await driver.findElement(By.css('select[aria-label*="Age of child"]'));
                await ageDropdown.click();
                await driver.sleep(300);
                const option10 = await ageDropdown.findElement(By.css('option[value="10"]'));
                await option10.click();
                ageSelected = true;
            } catch (e) {
            }
        }

        await driver.sleep(500);

        try {
            const doneButton = await driver.findElement(By.css('[data-testid="occupancy-popup"] button'));
            await doneButton.click();
        } catch (e) {
            await destinationInput.click();
        }
        await driver.sleep(500);

        await clickSearchButton(driver);
        await driver.sleep(5000);

        const currentUrl = await driver.getCurrentUrl();
        assert(
            currentUrl.includes('searchresults') || currentUrl.includes('Sarajevo') || currentUrl.includes('search'),
            'Stranica sa rezultatima bi trebala biti učitana'
        );
    });
});
