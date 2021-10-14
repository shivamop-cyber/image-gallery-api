const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = express();
dotenv.config();
app.use(express.json());

const cors = require('cors');
const corsOptions = {
  origin: '*',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
const PORT = process.env.PORT || 8800;
const ImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const Image = mongoose.model('Image', ImageSchema);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful'))
  .catch((err) => console.log(err));

app.post('/', async (req, res) => {
  const newImage = new Image(req.body);
  try {
    const savedImage = await newImage.save();
    res.status(201).json(savedImage);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.get('/', async (req, res) => {
  try {
    const allImages = await Image.find({});
    res.status(200).json(allImages);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server is up on ${PORT}`);
});
