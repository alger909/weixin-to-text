const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/extract', async (req, res) => {
    try {
        const { url } = req.body;
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        
        const content = $('#js_content')
            .find('p, section')
            .map((i, el) => {
                const text = $(el).text().trim();
                return text ? text + '\n\n' : '';
            })
            .get()
            .join('')
            .trim();
        
        res.json({
            success: true,
            content: content
        });
    } catch (error) {
        res.json({
            success: false,
            message: '提取失败，请检查链接是否正确'
        });
    }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 