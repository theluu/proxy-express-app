const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000; // Port for the proxy server

app.use(bodyParser.json());

// Endpoint để nhận yêu cầu GET từ Server HK và chuyển tiếp đến OpenAI
app.get('/receive-get', async (req, res) => {
    const { apiKey, url, headers } = req.query;
    const parsedHeaders = headers ? JSON.parse(headers) : {};
    console.log('Received data from HK (GET):', req.query);

    try {
        // Call to the real OpenAI function
        const openAIResponse = await queryOpenAIGet(apiKey, url, parsedHeaders);
        console.log('Response from OpenAI:', openAIResponse);

        // Return data back to HK
        res.json(openAIResponse);
    } catch (error) {
        console.error('Error in processing (GET):', error.message, 'Details:', error.response ? error.response.data : error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint để nhận yêu cầu POST từ Server HK và chuyển tiếp đến OpenAI
app.post('/receive-post', async (req, res) => {
    const { apiKey, url, headers, data } = req.body;
    console.log('Received data from HK (POST):', req.body);

    try {
        // Call to the real OpenAI function
        const openAIResponse = await queryOpenAIPost(apiKey, url, headers, data);
        console.log('Response from OpenAI:', openAIResponse);

        // Return data back to HK
        res.json(openAIResponse);
    } catch (error) {
        console.error('Error in processing (POST):', error.message, 'Details:', error.response ? error.response.data : error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Function: Gửi dữ liệu GET lên OpenAI
const queryOpenAIGet = async (apiKey, url, headers) => {
    try {
        // Thêm Authorization header
        headers['Authorization'] = `Bearer ${apiKey}`;

        const response = await axios.get(
            url,
            {
                headers: headers
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error in querying OpenAI (GET):', error.message, 'Details:', error.response ? error.response.data : error);
        throw error;
    }
};

// Function: Gửi dữ liệu POST lên OpenAI
const queryOpenAIPost = async (apiKey, url, headers, data) => {
    try {
        // Thêm Authorization header
        headers['Authorization'] = `Bearer ${apiKey}`;

        const response = await axios.post(
            url,
            data,
            {
                headers: headers
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error in querying OpenAI (POST):', error.message, 'Details:', error.response ? error.response.data : error);
        throw error;
    }
};

app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});