# Product_transaction

This Node.js app fetches data from multiple APIs, performs statistical analysis, and generates charts based on the data. It provides endpoints to retrieve various statistics, generate bar charts, and pie charts for a given month.

## Installation

1. Clone the repository:
- git clone https://github.com/subham436/Product_transaction.git

2. Install dependencies:
- cd Product_transaction
- npm install


3. Set up the database:
- Create a MongoDB database.
- Update the database connection URL in `server.js` to connect to your MongoDB database.

## Usage

1. Initialize the database with seed data:
- Make a GET request to `/api/initialize-database` to fetch data from a third-party API and seed the database.

2. Retrieve statistics for a selected month:
- Make a GET request to `/api/statistics/:month` to get the total sale amount, total number of sold items, and total number of unsold items for the selected month.

3. Generate a bar chart for a selected month:
- Make a GET request to `/api/bar-chart/:month` to get the price range and the number of items in each range for the selected month.

4. Generate a pie chart for a selected month:
- Make a GET request to `/api/pie-chart/:month` to get the unique categories and the number of items in each category for the selected month.

5. Generate statistics,bar chart, pie chart for a selected month:
- Make a GET request to `/api/combined-data/:month` to get the combined response of all the above 3 API's for the selected month

## Configuration

- MongoDB Connection: Update the database connection URL in `server.js` to connect to your MongoDB database.

## Support and Contact

For any questions or support, please email subhangar436@gmail.com.
