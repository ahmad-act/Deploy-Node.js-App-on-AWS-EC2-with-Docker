const express = require('express')
const app = express()
const port = 3001

app.get('/', (req, res) => {
    res.send('Welcome to Deploy Node.js App on AWS EC2 using Docker!!!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})