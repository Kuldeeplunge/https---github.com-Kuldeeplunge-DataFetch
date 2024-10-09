import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import Select from "react-select";
import { Bar, Doughnut } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// List of months for dropdown
const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [perPage, setPerPage] = useState(10);

  const [statistics, setStatistics] = useState({
    totalSell: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0,
  });

  useEffect(() => {
    axios
      .get("/roxiler.com/product_transaction.json")
      .then((response) => {
        setProducts(response.data);
        setFilteredProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filteredData = products;

    if (search) {
      filteredData = filteredData.filter(
        (product) =>
          product.title.toLowerCase().includes(search.toLowerCase()) ||
          product.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedMonth) {
      filteredData = filteredData.filter((product) => {
        const productDate = new Date(product.dateOfSale);
        return productDate.getMonth() + 1 === selectedMonth.value;
      });
    }

    setFilteredProducts(filteredData);

    if (selectedMonth) {
      calculateStatistics(filteredData);
    } else {
      setStatistics({
        totalSell: 0,
        totalSoldItems: 0,
        totalNotSoldItems: 0,
      });
    }
  }, [search, selectedMonth, products]);

  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true },
    { name: "Title", selector: (row) => row.title, sortable: true },
    { name: "Description", selector: (row) => row.description, wrap: true },
    {
      name: "Price",
      selector: (row) => `$${row.price.toFixed(2)}`,
      sortable: true,
    },
    { name: "Category", selector: (row) => row.category },
    { name: "Sold", selector: (row) => (row.sold ? "Yes" : "No") },
    {
      name: "Image",
      cell: (row) => (
        <img src={row.image} alt={row.title} width={50} height={50} />
      ),
    },
  ];

  const getPriceRangeData = () => {
    const priceRanges = {
      "0-100": 0,
      "101-200": 0,
      "201-300": 0,
      "301-400": 0,
      "401-500": 0,
      "501-600": 0,
      "601-700": 0,
      "701-800": 0,
      "801-900": 0,
      "901-above": 0,
    };

    filteredProducts.forEach((product) => {
      const price = product.price;
      if (price <= 100) {
        priceRanges["0-100"]++;
      } else if (price <= 200) {
        priceRanges["101-200"]++;
      } else if (price <= 300) {
        priceRanges["201-300"]++;
      } else if (price <= 400) {
        priceRanges["301-400"]++;
      } else if (price <= 500) {
        priceRanges["401-500"]++;
      } else if (price <= 600) {
        priceRanges["501-600"]++;
      } else if (price <= 700) {
        priceRanges["601-700"]++;
      } else if (price <= 800) {
        priceRanges["701-800"]++;
      } else if (price <= 900) {
        priceRanges["801-900"]++;
      } else {
        priceRanges["901-above"]++;
      }
    });

    return priceRanges;
  };

  const priceRangeData = getPriceRangeData();
  const chartData = {
    labels: Object.keys(priceRangeData),
    datasets: [
      {
        label: "Number of Items",
        data: Object.values(priceRangeData),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const getCategoryDistribution = () => {
    const categories = {};

    filteredProducts.forEach((product) => {
      const category = product.category;
      categories[category] = categories[category]
        ? categories[category] + 1
        : 1;
    });

    return categories;
  };

  const categoryData = getCategoryDistribution();
  const doughnutData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: "Category Distribution",
        data: Object.values(categoryData),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleMonthChange = (selectedOption) => {
    setSelectedMonth(selectedOption);
  };

  const calculateStatistics = (filteredData) => {
    const totalSell = filteredData.reduce(
      (sum, product) => sum + product.price,
      0
    );
    const totalSoldItems = filteredData.filter(
      (product) => product.sold
    ).length;
    const totalNotSoldItems = filteredData.filter(
      (product) => !product.sold
    ).length;

    setStatistics({
      totalSell,
      totalSoldItems,
      totalNotSoldItems,
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ backgroundColor: "#f0f4f7", padding: "20px" }}>
      <h1 style={{ textAlign: "center", color: "#34495e" }}>
        Product Dashboard
      </h1>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={handleSearchChange}
        style={{
          marginBottom: "20px",
          padding: "10px",
          width: "100%",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />

      <Select
        options={months}
        value={selectedMonth}
        onChange={handleMonthChange}
        placeholder="Filter by month"
        isClearable
        styles={{
          control: (base) => ({
            ...base,
            marginBottom: "20px",
            borderColor: "#ccc",
            borderRadius: "5px",
            padding: "5px",
          }),
        }}
      />

      <DataTable
        columns={columns}
        data={filteredProducts}
        pagination
        paginationPerPage={perPage}
        onChangeRowsPerPage={setPerPage}
        customStyles={{
          header: {
            style: {
              background: "linear-gradient(90deg, #4caf50 0%, #81c784 100%)",
              color: "#fff",
              fontWeight: "bold",
              borderRadius: "5px",
            },
          },
          headCells: {
            style: {
              backgroundColor: "#81c784",
              color: "#fff",
              fontSize: "16px",
              padding: "10px",
              borderRadius: "5px",
            },
          },
          rows: {
            style: {
              backgroundColor: "#f1f8e9",
              color: "#333",
              borderRadius: "5px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              transition: "background-color 0.3s ease",
              "&:nth-of-type(odd)": {
                backgroundColor: "#e8f5e9",
              },
              "&:hover": {
                backgroundColor: "#c8e6c9",
              },
            },
          },
        }}
      />

      <div>
        <h2>Statistics</h2>
        <p>Total Sell: ${statistics.totalSell.toFixed(2)}</p>
        <p>Total Sold Items: {statistics.totalSoldItems}</p>
        <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
      </div>

      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#34495e" }}>
          Price Range Distribution
        </h2>
        <Bar data={chartData} height={300} />
      </div>

      <div
        style={{
          maxWidth: "600px",
          margin: "20px auto",
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#34495e" }}>
          Category Distribution
        </h2>
        <Doughnut data={doughnutData} height={300} />
      </div>
    </div>
  );
};

export default ProductTable;
