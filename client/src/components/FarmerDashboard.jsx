import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles"; // Updated import
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import Grid from "@mui/material/Grid";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// ✅ Define Navigation as an array instead of importing
const NAVIGATION = [
  { kind: "header", title: "Main items" },
  { segment: "dashboard", title: "Dashboard", icon: <DashboardIcon /> },
  { segment: "orders", title: "Orders", icon: <ShoppingCartIcon /> },
  { kind: "divider" },
  { kind: "header", title: "Analytics" },
  {
    segment: "reports",
    title: "Reports",
    icon: <BarChartIcon />,
    children: [
      { segment: "sales", title: "Sales", icon: <BarChartIcon /> },
      { segment: "stock", title: "Stock", icon: <BarChartIcon /> },
    ],
  },
  { segment: "integrations", title: "Integrations", icon: <LayersIcon /> },
];

// ✅ Use createTheme instead of extendTheme
const demoTheme = createTheme({
  palette: {
    mode: "light", // Define light and dark modes properly
  },
});

function useDemoRouter(initialPath) {
  const [pathname, setPathname] = React.useState(initialPath);
  return React.useMemo(
    () => ({
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    }),
    [pathname]
  );
}

const products = [
  { name: "Tomatoes", stock: 50, price: 3.99 },
  { name: "Honey", stock: 30, price: 9.99 },
  { name: "Eggs", stock: 100, price: 4.5 },
];

const salesData = {
  labels: ["Tomatoes", "Honey", "Eggs"],
  datasets: [
    {
      label: "Sales",
      data: [40, 20, 70],
      backgroundColor: ["#FF5733", "#FFD700", "#4CAF50"],
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false, // Prevent canvas resizing issues
};

export default function FarmerDashboard(props) {
  const router = useDemoRouter("/dashboard");

  return (
    <AppProvider navigation={NAVIGATION} router={router}>
      <ThemeProvider theme={demoTheme}>
        <DashboardLayout>
          <PageContainer>
            <Typography variant="h4" gutterBottom>
              Farmer's Dashboard
            </Typography>

            <Grid container spacing={2}>
              {products.map((product, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{product.name}</Typography>
                      <Typography>Stock: {product.stock}</Typography>
                      <Typography>Price: ${product.price}</Typography>
                      <Button variant="contained" color="primary">
                        Edit
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Typography variant="h5" style={{ marginTop: "20px" }}>
              Sales Analytics
            </Typography>
            <div style={{ height: "400px" }}>
              <Bar data={salesData} options={chartOptions} />
            </div>
          </PageContainer>
        </DashboardLayout>
      </ThemeProvider>
    </AppProvider>
  );
}
