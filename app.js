// app.js
const express = require('express');
const app = express();
const port = 3001;

// Middleware để phục vụ các file tĩnh từ thư mục "public"
app.use(express.static('public'));

// Định tuyến cơ bản để kiểm tra
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
