const { By, until } = require('selenium-webdriver');

async function getDestinationInput(driver) {
    const selectors = [
        'input[name="ss"]',
        '[data-testid="destination-container"] input',
        'input[placeholder*="destination"]',
        'input[placeholder*="Where"]',
        '.hero-banner-searchbox input[type="text"]'
    ];

    for (const selector of selectors) {
        try {
            const element = await driver.wait(until.elementLocated(By.css(selector)), 3000);
            if (await element.isDisplayed()) {
                return element;
            }
        } catch (e) {
            continue;
        }
    }
    throw new Error('Could not find destination input field');
}

async function clickSearchButton(driver) {
    const selectors = [
        'button[type="submit"]',
        '[data-testid="search-button"]',
        'button.sb-searchbox__button'
    ];

    for (const selector of selectors) {
        try {
            const button = await driver.wait(until.elementLocated(By.css(selector)), 3000);
            if (await button.isDisplayed()) {
                await button.click();
                return;
            }
        } catch (e) {
            continue;
        }
    }
    throw new Error('Could not find search button');
}

async function openGuestsMenu(driver) {
    const selectors = [
        '[data-testid="occupancy-config"]',
        'button[data-testid="occupancy-config"]',
        '.xp__guests__count',
        '[data-component="search/group/group-with-modal"]'
    ];

    for (const selector of selectors) {
        try {
            const element = await driver.wait(until.elementLocated(By.css(selector)), 3000);
            if (await element.isDisplayed()) {
                await element.click();
                await driver.sleep(500);
                return;
            }
        } catch (e) {
            continue;
        }
    }
    throw new Error('Could not find guests menu');
}

async function getAdultsCount(driver) {
    try {
        const countElement = await driver.wait(
            until.elementLocated(By.css('[data-testid="occupancy-popup"] input[id*="adults"], #group_adults')),
            3000
        );
        return parseInt(await countElement.getAttribute('value') || '2');
    } catch (e) {
        const countText = await driver.findElement(By.css('[data-testid="occupancy-popup"] span')).getText();
        const match = countText.match(/\d+/);
        return match ? parseInt(match[0]) : 2;
    }
}

async function clickPlusAdults(driver) {
    const selectors = [
        '[data-testid="occupancy-popup"] button[aria-label*="adults" i]:last-of-type',
        'button[aria-label*="Increase number of Adults"]',
        '[data-testid="occupancy-popup"] [data-testid="stepper-adults-increase-button"]'
    ];

    for (const selector of selectors) {
        try {
            const buttons = await driver.findElements(By.css(selector));
            for (const button of buttons) {
                if (await button.isDisplayed()) {
                    await button.click();
                    await driver.sleep(200);
                    return;
                }
            }
        } catch (e) {
            continue;
        }
    }

    const plusButtons = await driver.findElements(By.css('[data-testid="occupancy-popup"] button'));
    for (const button of plusButtons) {
        const text = await button.getText();
        if (text === '+') {
            await button.click();
            await driver.sleep(200);
            return;
        }
    }
}

async function clickMinusRooms(driver) {
    const selectors = [
        'button[aria-label*="Decrease number of Rooms"]',
        '[data-testid="occupancy-popup"] [data-testid="stepper-rooms-decrease-button"]'
    ];

    for (const selector of selectors) {
        try {
            const button = await driver.wait(until.elementLocated(By.css(selector)), 3000);
            if (await button.isDisplayed()) {
                await button.click();
                await driver.sleep(200);
                return;
            }
        } catch (e) {
            continue;
        }
    }
}

async function addChild(driver) {
    const selectors = [
        'button[aria-label*="children" i][aria-label*="increase" i]',
        '[data-testid="occupancy-popup"] [data-testid="stepper-children-increase-button"]'
    ];

    for (const selector of selectors) {
        try {
            const button = await driver.wait(until.elementLocated(By.css(selector)), 3000);
            if (await button.isDisplayed()) {
                await button.click();
                await driver.sleep(500);
                return;
            }
        } catch (e) {
            continue;
        }
    }

    const childrenLabel = await driver.findElement(By.xpath("//*[contains(text(), 'Children') or contains(text(), 'Djeca')]"));
    const parent = await childrenLabel.findElement(By.xpath('./ancestor::div[2]'));
    const plusButton = await parent.findElement(By.css('button:last-of-type'));
    await plusButton.click();
    await driver.sleep(500);
}

async function selectChildAge(driver, age) {
    const selectors = [
        'select[name*="age"]',
        '[data-testid="occupancy-popup"] select',
        'select[data-testid*="age"]',
        '.age-select select',
        '[class*="child"] select'
    ];

    for (const selector of selectors) {
        try {
            const ageDropdown = await driver.wait(
                until.elementLocated(By.css(selector)),
                2000
            );
            if (await ageDropdown.isDisplayed()) {
                await ageDropdown.click();
                await driver.sleep(300);

                try {
                    const option = await ageDropdown.findElement(By.css(`option[value="${age}"]`));
                    await option.click();
                } catch (e) {
                    const options = await ageDropdown.findElements(By.css('option'));
                    for (const opt of options) {
                        const text = await opt.getText();
                        if (text.includes(age.toString())) {
                            await opt.click();
                            break;
                        }
                    }
                }
                await driver.sleep(300);
                return;
            }
        } catch (e) {
            continue;
        }
    }

    try {
        const selects = await driver.findElements(By.css('select'));
        if (selects.length > 0) {
            const lastSelect = selects[selects.length - 1];
            await lastSelect.click();
            await driver.sleep(300);
            const options = await lastSelect.findElements(By.css('option'));
            for (const opt of options) {
                const text = await opt.getText();
                if (text.includes(age.toString())) {
                    await opt.click();
                    break;
                }
            }
        }
    } catch (e) {
    }
}

async function openCalendar(driver) {
    const selectors = [
        '[data-testid="date-display-field-start"]',
        '[data-testid="searchbox-dates-container"]',
        '.sb-date-field'
    ];

    for (const selector of selectors) {
        try {
            const element = await driver.wait(until.elementLocated(By.css(selector)), 3000);
            if (await element.isDisplayed()) {
                await element.click();
                await driver.sleep(500);
                return;
            }
        } catch (e) {
            continue;
        }
    }
}

async function selectDates(driver, checkInOffset = 7, checkOutOffset = 10) {
    await openCalendar(driver);

    const today = new Date();
    const checkInDate = new Date(today);
    checkInDate.setDate(today.getDate() + checkInOffset);

    const checkOutDate = new Date(today);
    checkOutDate.setDate(today.getDate() + checkOutOffset);

    try {
        const checkInSelector = `[data-date="${checkInDate.toISOString().split('T')[0]}"]`;
        const checkInElement = await driver.wait(until.elementLocated(By.css(checkInSelector)), 5000);
        await checkInElement.click();
        await driver.sleep(500);

        const checkOutSelector = `[data-date="${checkOutDate.toISOString().split('T')[0]}"]`;
        const checkOutElement = await driver.findElement(By.css(checkOutSelector));
        await checkOutElement.click();
        await driver.sleep(500);
    } catch (e) {
        const dateElements = await driver.findElements(By.css('[data-testid="calendar-day"], .bui-calendar__date'));
        if (dateElements.length >= 2) {
            await dateElements[7].click();
            await driver.sleep(300);
            await dateElements[10].click();
            await driver.sleep(300);
        }
    }
}

module.exports = {
    getDestinationInput,
    clickSearchButton,
    openGuestsMenu,
    getAdultsCount,
    clickPlusAdults,
    clickMinusRooms,
    addChild,
    selectChildAge,
    openCalendar,
    selectDates
};
