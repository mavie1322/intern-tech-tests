import "../AdditionalFiles/App.css";
import * as React from "react";

//This is the API url to fetch from
const API_URL = "https://matchesfashion.com/api/products";
const TAX_RATE = 0.08;

function YourSolution() {
  const [items, setItems] = React.useState([]);
  const [pageNum, setPageNum] = React.useState(0);
  const [productCount, setProductCount] = React.useState(null);

  const fetchData = React.useCallback(async () => {
    const response = await fetch(`${API_URL}?page=${pageNum}`);
    const data = await response.json();
    setItems(data.products);
    setProductCount(data.count);
  }, [pageNum]);

  const calculateProfit = (product, tax) => {
    const { quantitySold, soldPrice, costToBusiness } = product;
    let profitAfterTax = 0;
    if (quantitySold <= 10) {
      profitAfterTax = (soldPrice - costToBusiness) * quantitySold;
    }
    if (quantitySold > 10) {
      let notTaxedProfit = (soldPrice - costToBusiness) * 10;
      let taxedProfit =
        (soldPrice - costToBusiness) * (quantitySold - 10) * (1 - tax);
      profitAfterTax = notTaxedProfit + taxedProfit;
    }
    return parseFloat(profitAfterTax.toFixed(2));
  };

  const prevPage = () => {
    setPageNum((currPage) => {
      let prevPage = currPage - 1;
      return prevPage;
    });
  };

  const nextPage = () => {
    setPageNum((currPage) => {
      let nextPage = currPage + 1;
      return nextPage;
    });
  };

  React.useEffect(() => {
    fetchData();
  }, [pageNum, fetchData]);

  return (
    <div className='App'>
      <table id='products'>
        <thead>
          <tr>
            <th>Id</th>
            <th>Brand</th>
            <th>Name</th>
            <th>Quantity Sold</th>
            <th>Sold Price</th>
            <th>Cost To Business</th>
            <th>Profit After Tax</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            let profitOnItem = calculateProfit(item, TAX_RATE);
            return <Product key={index} {...item} profit={profitOnItem} />;
          })}
        </tbody>
      </table>
      <button
        type='button'
        onClick={() => setPageNum(0)}
        disabled={pageNum === 0 ? true : false}>
        First Page
      </button>
      <button
        type='button'
        onClick={() => prevPage()}
        disabled={pageNum === 0 ? true : false}>
        Previous Page
      </button>
      <button
        type='button'
        onClick={() => nextPage()}
        disabled={pageNum === productCount / 10 ? true : false}>
        Next Page
      </button>
      <button
        type='button'
        onClick={() => setPageNum(productCount / 10)}
        disabled={pageNum === productCount / 10 ? true : false}>
        Last Page
      </button>
    </div>
  );
}

function Product({
  id,
  brand,
  name,
  quantitySold,
  soldPrice,
  costToBusiness,
  profit,
}) {
  return (
    <tr>
      <td>{id}</td>
      <td>{brand}</td>
      <td>{name}</td>
      <td>{quantitySold}</td>
      <td>{soldPrice}</td>
      <td>{costToBusiness}</td>
      <td>{profit}</td>
    </tr>
  );
}

export default YourSolution;
