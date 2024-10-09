// // import React from "react";
// // import "./App.css";
// // import ProductTable from "./ProductTable";

// // function App() {
// //   return (
// //     <div className="App">
// //       <h1>Product Table</h1>
// //       <ProductTable />
// //     </div>
// //   );
// // }

// // export default App;
// import React from "react";
// import "./App.css";
// import ProductTable from "./ProductTable";

// function App() {
//   return (
//     <div
//       className="App"
//       style={{
//         textAlign: "center",
//         backgroundColor: "skyblue",
//         minHeight: "100vh",
//         padding: "20px",
//       }}
//     >
//       <h1
//         style={{
//           color: "#282c34",
//           fontSize: "2.5em",
//           fontWeight: "bold",
//           margin: "20px 0",
//         }}
//       >
//         Product Table
//       </h1>
//       <ProductTable />
//     </div>
//   );
// }

// export default App;
import React from "react";
import "./App.css";
import ProductTable from "./ProductTable";

function App() {
  return (
    <div
      className="App"
      style={{
        textAlign: "center",
        backgroundColor: "skyblue",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h1
        style={{
          color: "#282c34",
          fontSize: "2.5em",
          fontWeight: "bold",
          margin: "20px 0",
        }}
      >
        Product Table
      </h1>
      <ProductTable />
    </div>
  );
}

export default App;
