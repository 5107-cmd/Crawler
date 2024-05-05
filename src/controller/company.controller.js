const {scrapCompanyInfoGenerator, formatBulkInsertQuery, flattenValues} = require("../utils/scrapper");
const pgClient = require("../DAL/postgresql");

const scrapCompanyDetails = async (req, res) => {
    try {
        const mainUrl =
            "https://www.companydetails.in/latest-registered-company-mca";
        const generator = scrapCompanyInfoGenerator(mainUrl);
        const all_rows = []
        await pgClient.query('BEGIN');

        const batchSize = 50;
        let rowCount = 0;
        const rows = [];

        for await (const companyDetails of generator) {
            const values = [
                new Date(),
                companyDetails['Company Name'],
                companyDetails['CIN'],
                companyDetails['Registration Date'],
                companyDetails['Category'],
                companyDetails['Sub Category'],
                companyDetails['Company Class'],
                companyDetails['RoC'],
                companyDetails['Company Status'],
                companyDetails['Authorised Capital'],
                companyDetails['PaidUp Capital'],
                companyDetails['State'],
                companyDetails['PIN Code'],
                companyDetails['Country'],
                companyDetails['Address'],
                companyDetails['Email']
            ];

            rows.push(values);
            all_rows.push(values);
            rowCount++;

            if (rowCount % batchSize === 0) {
                const insertQuery = formatBulkInsertQuery(rows);
                await pgClient.query(insertQuery, flattenValues(rows));
                rows.length = 0;
            }
        }

        if (rows.length > 0) {
            const insertQuery = formatBulkInsertQuery(rows);
            await pgClient.query(insertQuery, flattenValues(rows));
        }

        await pgClient.query('COMMIT');
        res.status(200).send(all_rows);
    } catch (error) {
        console.log(all_rows)
        console.error("Error:", error);
        res.status(500).json({error: error});
    }
};

module.exports = {
    scrapCompanyDetails,
};
