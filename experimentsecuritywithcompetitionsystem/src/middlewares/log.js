const fs = require('fs')

module.exports.logRequest = (req, res, next) => {
    // req.body.userId = req.headers['user'];
    if(req){
        const json = {
            datetime:new Date(Date.now()),
            request: req.method + " " +req.url,
            parameters:req.params,
            body: req.body,
            files:req.files,
            remoteAddr:req.socket.remoteAddress,
            remoteFamily:req.socket.remoteFamily
        }
        // console.log(json)
        let logs = JSON.parse(fs.readFileSync('logs.json'))
        logs.push(json)

        fs.writeFile('logs.json',JSON.stringify(logs, null, 2),(err)=>{
            if(err){
                console.log(err)
                throw err
            }
            console.log('Data written to file')
        })
        next();
        return
    }else{
        res.status(403).json({ message: 'Unauthorized access' });
        return;
    }

} //End of logRequest