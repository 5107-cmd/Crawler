const puppeteer = require("puppeteer");

async function* scrapCompanyInfoGenerator(mainUrl) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        await page.goto(mainUrl);

        await page.waitForSelector(".fs-6.text-uppercase");

        const hrefs = await page.evaluate(() => {
            const anchorTags = document.querySelectorAll(".fs-6.text-uppercase");
            const hrefList = [];
            anchorTags.forEach((tag) => {
                const href = tag.getAttribute("href");
                if (href !== "") {
                    hrefList.push(`https://www.companydetails.in${href}`);
                }
            });
            return hrefList;
        });

        for (const href of hrefs) {
            const companyDetails = await getCINAndPinFromDetailPage(browser, href);
            yield companyDetails;
        }
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await browser.close();
    }
}

async function getCINAndPinFromDetailPage(browser, url) {
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector(
        ".bg-white.justify-content-between.align-items-center.p-2.border-bottom"
    );

    const data = await page.evaluate(() => {
        const companyDetails = {};
        const rows = document.querySelectorAll(
            ".bg-white.justify-content-between.align-items-center.p-2.border-bottom"
        );

        for (const row of rows) {
            const label = row.querySelector("a");
            if (label) {
                const labelText = label.textContent.trim();
                const valueElement = row.querySelector("h6");
                companyDetails[labelText] = valueElement ? valueElement.textContent.trim() : "N/A";
            }
        }

        return companyDetails;
    });

    await page.close();
    return data;
}

function formatBulkInsertQuery(rows) {
    const columns = [
        'created_at',
        'company_name',
        'cin',
        'registration_date',
        'category',
        'sub_cat',
        'company_class',
        'roc',
        'company_status',
        'autherised_capital',
        'pickup_capital',
        'state',
        'pin',
        'country',
        'address',
        'email'
    ];

    const valuePlaceholders = rows.map((_, rowIndex) => {
        const paramPlaceholders = columns.map((_, colIndex) => `$${colIndex + 1 + rowIndex * columns.length}`).join(', ');
        return `(${paramPlaceholders})`;
    }).join(', ');

    return `INSERT INTO company_details (${columns.join(', ')}) VALUES ${valuePlaceholders}`;
}

function flattenValues(rows) {
    return rows.reduce((acc, val) => acc.concat(val), []);
}

module.exports = {scrapCompanyInfoGenerator, flattenValues, formatBulkInsertQuery};
