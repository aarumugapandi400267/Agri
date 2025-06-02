import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  TextField,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const mockReports = [
  {
    id: 1,
    title: "User Report",
    type: "user",
    dateRange: { start: new Date(), end: new Date() },
    createdAt: new Date(),
  },
  {
    id: 2,
    title: "Product Report",
    type: "product",
    dateRange: { start: new Date(), end: new Date() },
    createdAt: new Date(),
  },
];

const ExportReports = () => {
  const [reportType, setReportType] = useState("user");
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState(mockReports);

  const handleGenerateReport = () => {
    setLoading(true);
    setTimeout(() => {
      setReports([
        ...reports,
        {
          id: reports.length + 1,
          title: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
          type: reportType,
          dateRange: { start: fromDate, end: toDate },
          createdAt: new Date(),
        },
      ]);
      setLoading(false);
    }, 1200);
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "";

  return (
    <Box sx={{ mt: 4, px: 2 }}>
      <Card sx={{ mb: 4 }}>
        <CardHeader
          avatar={<DownloadIcon color="primary" />}
          title={
            <Typography variant="h5" color="primary">
              Export Reports
            </Typography>
          }
        />
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              alignItems: "center",
              mb: 2,
            }}
          >
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportType}
                label="Report Type"
                onChange={(e) => setReportType(e.target.value)}
              >
                <MenuItem value="user">User Report</MenuItem>
                <MenuItem value="product">Product Report</MenuItem>
                <MenuItem value="order">Order Report</MenuItem>
                <MenuItem value="revenue">Revenue Report</MenuItem>
              </Select>
            </FormControl>
            <DatePicker
              label="From Date"
              value={fromDate}
              onChange={(date) => date && setFromDate(date)}
              renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
              label="To Date"
              value={toDate}
              onChange={(date) => date && setToDate(date)}
              renderInput={(params) => <TextField {...params} />}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleGenerateReport}
              disabled={loading}
              sx={{ minWidth: 160 }}
            >
              {loading ? <CircularProgress size={24} /> : "Generate Report"}
            </Button>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select report type and date range, then click "Generate Report".
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          title={
            <Typography variant="h6" color="primary">
              Generated Reports
            </Typography>
          }
        />
        <CardContent>
          {reports.length === 0 ? (
            <Typography color="text.secondary" align="center">
              No reports generated yet. Use the form above to create your first report.
            </Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Report</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Date Range</TableCell>
                  <TableCell>Generated</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{report.title}</TableCell>
                    <TableCell sx={{ textTransform: "capitalize" }}>
                      {report.type}
                    </TableCell>
                    <TableCell>
                      {formatDate(report.dateRange.start)} - {formatDate(report.dateRange.end)}
                    </TableCell>
                    <TableCell>{formatDate(report.createdAt)}</TableCell>
                    <TableCell align="right">
                      <Button variant="outlined" size="small" startIcon={<DownloadIcon />}>
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ExportReports;