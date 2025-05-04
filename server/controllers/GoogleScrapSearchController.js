const SERP_API_KEY = process.env.SERP_API_KEY;
const axios = require('axios');

exports.SearchEvents = async (req, res) => {
    console.log('====================================');
    console.log(req.query);
    console.log('====================================');
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&location=India&hl=en&gl=in&api_key=${SERP_API_KEY}`;

    try {
        const response = await axios.get(url);
        const results = response.data.organic_results || [];

        const formattedResults = results.map(result => ({
            title: result.title,
            link: result.link,
            snippet: result.snippet,
        }));

        res.json(formattedResults);
    } catch (error) {
        console.error('Error fetching from SerpAPI:', error.message);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
};
