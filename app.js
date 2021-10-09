const express = require('express')
const upload = require('./multer')
const cloudinary = require('./cloudinary')
const fs = require('fs')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.send("<h1>Cloudinary Project</h1>")
})

// Make a post request
app.use('/upload', upload.array('image'), async(req, res) => {
    const uploader = async (path) => await cloudinary.uploads(path,'Gallery')
    if(req.method === 'POST') {
        const urls = []
        const files = req.files
        for(const file of files) {
            const { path } = file
            const newPath = await uploader(path)
            urls.push(newPath)
            fs.unlinkSync(path)
        }
        res.status(200).json({  
            message:"Images Uploaded",
            data:urls
        })
    } else {
        res.status(404).json({
            err:"Images Not Uploaded"
        })
    }
})

app.listen(8080)