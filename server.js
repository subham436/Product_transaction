const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');


const app = express();
const port = 3000; 

mongoose.connect('mongodb://localhost/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to the database');
})
.catch((error) => {
  console.error('Error connecting to the database', error);
});

const productSchema = new mongoose.Schema({
    id: Number,
    title: String,
    price: Number,
    description: String,
    category: String,
    image: String,
    sold: Boolean,
    dateOfSale: Date,
});
const Product = mongoose.model('Product', productSchema);

app.get('/api/initialize-database', async (req, res) => {
    try {
      const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
      const products = response.data;
  
      await Product.deleteMany({}); // Remove existing data
  
      await Product.insertMany(products); // Insert seed data
  
      res.json({ message: 'Database initialized with seed data' });
    } catch (error) {
      console.error('Error initializing the database', error);
      res.status(500).json({ error: 'An error occurred while initializing the database' });
    }
});

app.get('/api/statistics/:month', async (req, res) => {
    try {
      const selectedMonth = req.params.month;
  
      const totalSaleAmount = await Product.aggregate([
        {
          $match: {
            $expr: {
              $eq: [{ $month: '$dateOfSale' }, selectedMonth],
            },
          },
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$price' },
          },
        },
      ]);
  
      const totalSoldItems = await Product.countDocuments({
        $expr: {
          $eq: [{ $month: '$dateOfSale' }, selectedMonth],
        },
        sold: true,
      });
  
      const totalNotSoldItems = await Product.countDocuments({
        $expr: {
          $eq: [{ $month: '$dateOfSale' }, selectedMonth],
        },
        sold: false,
      });
  
      res.json({
        totalSaleAmount: totalSaleAmount.length > 0 ? totalSaleAmount[0].totalAmount : 0,
        totalSoldItems,
        totalNotSoldItems,
      });
    } catch (error) {
      console.error('Error retrieving statistics', error);
      res.status(500).json({ error: 'An error occurred while retrieving statistics' });
    }
});

app.get('/api/bar-chart/:month', async (req, res) => {
    try {
      const selectedMonth = req.params.month;
  
      const priceRanges = [
        { min: 0, max: 100 },
        { min: 101, max: 200 },
        { min: 201, max: 300 },
        { min: 301, max: 400 },
        { min: 401, max: 500 },
        { min: 501, max: 600 },
        { min: 601, max: 700 },
        { min: 701, max: 800 },
        { min: 801, max: 900 },
        { min: 901, max: Infinity },
      ];
  
      const barChartData = await Promise.all(
        priceRanges.map(async (range) => {
          const count = await Product.countDocuments({
            $expr: {
              $eq: [{ $month: '$dateOfSale' }, selectedMonth],
            },
            price: { $gte: range.min, $lte: range.max },
          });
  
          return { range: `${range.min}-${range.max}`, count };
        })
      );
  
      res.json(barChartData);
    } catch (error) {
      console.error('Error generating bar chart', error);
      res.status(500).json({ error: 'An error occurred while generating bar chart' });
    }
});


app.get('/api/pie-chart/:month', async (req, res) => {
    try {
      const selectedMonth = req.params.month;
  
      const categoryData = await Product.aggregate([
        {
          $match: {
            $expr: {
              $eq: [{ $month: '$dateOfSale' }, parseInt(selectedMonth)],
            },
          },
        },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
          },
        },
      ]);
  
      res.json(categoryData);
    } catch (error) {
      console.error('Error generating pie chart', error);
      res.status(500).json({ error: 'An error occurred while generating pie chart' });
    }
});

app.get('/api/combined-data/:month', async (req, res) => {
    try {
      const selectedMonth = req.params.month;
  
      // Make requests to the three APIs
      const statisticsResponse = await axios.get(`http://localhost:3000/api/statistics/${selectedMonth}`);
      const barChartResponse = await axios.get(`http://localhost:3000/api/bar-chart/${selectedMonth}`);
      const pieChartResponse = await axios.get(`http://localhost:3000/api/pie-chart/${selectedMonth}`);
  
      // Combine the responses into a single JSON object
      const combinedData = {
        statistics: statisticsResponse.data,
        barChart: barChartResponse.data,
        pieChart: pieChartResponse.data,
      };
  
      res.json(combinedData);
    } catch (error) {
      console.error('Error retrieving combined data', error);
      res.status(500).json({ error: 'An error occurred while retrieving combined data' });
    }
});
  
  

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
  
  
  
  
  
  
