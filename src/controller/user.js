const pgClient = require("../DAL/postgresql");

const companyDetails = async (req, res) => {
    try {
        const sql = "SELECT * FROM company_details";
        const result = await pgClient.query(sql);
        const rows = result.rows;
        return res.status(200).json({message: "success", status: 1, data: rows});
    } catch (error) {
        console.error(error);
    }
};

const insertObjectIntoTable = async (req, res) => {
    try {
        const dataObject = req.body;
        dataObject.created_at = new Date().toISOString();
        const columns = Object.keys(dataObject);
        const values = Object.values(dataObject);
        const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');

        const query = {
            text: `INSERT INTO company_details (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *`,
            values: values
        };

        const result = await pgClient.query(query);

        console.log('New row inserted:', result.rows[0]);
        return res.status(200).json({message: "success", data: result.rows[0]});

    } catch (error) {
        console.error('Error inserting data into PostgreSQL table:', error);
        res.status(500).json({error: error});
    }
}

const getClientById = async (req, res) => {
    const clientId = req.params.id;

    try {
        const query = {
            text: `SELECT * FROM company_details WHERE id = $1`,
            values: [clientId],
        };

        const result = await pgClient.query(query);

        if (result.rows.length === 0) {
            return res.status(404).json({error: 'Client not found'});
        } else {
            return res.status(200).json({message: "success", data: result.rows[0]});
        }
    } catch (error) {
        console.error('Error retrieving client:', error);
        res.status(500).json({error: error});
    }
}

const searchClients = async (req, res) => {
    const searchTerm = req.query.q;

    try {
        const query = {
            text: `
                SELECT * FROM company_details
                WHERE id::text = $1
                   OR company_name ILIKE $2
                   OR cin = $3
                   OR email ILIKE $4
            `,
            values: [searchTerm, `%${searchTerm}%`, searchTerm, `%${searchTerm}%`],
        };

        const result = await pgClient.query(query);

        if (result.rows.length === 0) {
            return res.status(404).json({error: 'Client not found'});
        } else {
            res.status(200).json({message: 'Clients found', data: result.rows});
        }
    } catch (error) {
        console.error('Error retrieving client:', error);
        res.status(500).json({error: error});
    }
}

const getClient = async (req, res) => {
    const searchTerm = req.query.q;

    try {
        if (searchTerm) {
            await searchClients(req, res)
        } else {
            await companyDetails(req, res)
        }
    } catch (error) {
        console.error('Error retrieving client:', error);
        res.status(500).json({error: error});
    }
}

const deleteClientById = async (req, res) => {
    const clientId = req.params.id;

    try {
        const query = {
            text: 'DELETE FROM company_details WHERE id = $1 RETURNING *',
            values: [clientId],
        };

        const result = await pgClient.query(query);

        if (result.rows.length === 0) {
            return res.status(404).json({error: 'Client not found'});
        } else {
            res.status(200).json({message: 'Client deleted successfully', data: result.rows[0]});
        }
    } catch (error) {
        console.error('Error retrieving client:', error);
        res.status(500).json({error: error});
    }
}

async function updateClientById(req, res) {
    const clientId = req.params.id;
    const updateFields = req.body;

    try {
        const updateKeys = Object.keys(updateFields);
        const updateValues = updateKeys.map((key, index) => `${key} = $${index + 1}`).join(', ');
        const values = [...Object.values(updateFields), clientId];

        const query = {
            text: `UPDATE company_details SET ${updateValues} WHERE id = $${updateKeys.length + 1}`,
            values: values,
        };

        const result = await pgClient.query(query);

        if (result.rowCount === 1) {
            res.status(200).json({message: 'Client updated successfully'});
        } else {
            res.status(404).json({error: 'Client not found'});
        }

    } catch (error) {
        console.error('Error updating client:', error);
        res.status(500).json({error: error});
    }
}


module.exports = {
    insertObjectIntoTable,
    getClientById,
    updateClientById,
    deleteClientById,
    searchClients,
    getClient
}
