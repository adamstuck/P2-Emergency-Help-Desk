/*
Authors:
Adam Stück, Bianca Kevy, Cecilie Hejlesen
Frederik Stær, Lasse Rasmussen and Tais Hors

Group: DAT2 - C1-14
Date: 27/05-2020

This file contains the test for the translation API used on
the public side. It can be found in translation.js
*/

const puppeteer = require("puppeteer");

test("should translate text from English to Danish", async () => {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 250,
        args: ["--window-size=1920,1080"]
    })
    const page = await browser.newPage();
    await page.goto(
        "file:///C:/Users/fred7/Documents/GitHub/P2-Emergency-Help-Desk/references/testing/mockBrowser.html"
    );

    await page.mouse.click(10, 20);

    await page.mouse.click(250, 260);

    const text = await page.$eval('#someText', (elem) => {
    return elem.textContent;
    });

    expect(text).toBe("Tekst der skal oversættes.")

    await browser.close();

}, 40000);
