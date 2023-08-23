const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.get('/', (req, res) => {
    res.render(path.join(__dirname, 'index.ejs'), {message: ''});
})
app.post('/upload', upload.single('image'), (req, res) => {
  // console.log(req.file);
  if(req.file == undefined) res.render(path.join(__dirname, 'index.ejs'), {message: 'Please Upload Image'})
  const uploadedImagePath = req.file.path;
  let length = parseInt(req.body.length);
  let format = req.body.format;
  let width = parseInt(req.body.width);
  if(req.body.length ==  '' || req.body.width == ''){
    res.render(path.join(__dirname, 'index.ejs'), {message: 'Please Enter Dimensions'});
    return;
  }
  console.log(req.body);
  const outputPath = 'output.'+format;
  console.log('request recieved');
  sharp(uploadedImagePath)
    .resize(length, width, {fit: 'inside'})
    .toFile(outputPath, (err, info) => {
      console.log('hello');
      if (err) {
        console.error(err);
        res.render(path.join(__dirname, 'index.ejs'), {message: 'Error processing image'});
      } else {
        res.download(outputPath, () => {
          // Clean up: delete uploaded and output images
          fs.unlink(uploadedImagePath, () => {});
          fs.unlink(outputPath, () => {});
        });
        console.log(info);
      }
    });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
