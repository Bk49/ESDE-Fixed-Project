const express = require('express')
const app = express()
const cors = require('cors')
const fs = require('fs')
const bodyparser = require('body-parser')

app.use('*', cors())
app.use(bodyparser.json())

const PORT = 3030

app.post('/log', (req, res)=>{
    console.log("this function is being called")
    let logs
    fs.readFile('logs.json', (err, data)=>{
        if(err) console.log(err)
        logs = JSON.parse(data)
        console.log(logs)
        logs.push(req.body)

        fs.writeFile('logs.json', JSON.stringify(logs, null, 2), (err)=>{
            if(err) console.log(err)
        })
    })
    return res.status(201)
})

app.listen(PORT, err=>{
    if(err) return console.log(err)
    console.log(`App Listening in port ${PORT}`)
})