import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch } from "react-redux";
import { fetchAllUsers } from "../../actions/admin"; // <-- Use the Redux action

const regions = [
  "All Regions",
  "Tamil Nadu",
  "Karnataka",
  "Kerala",
  "Andhra Pradesh",
];

const roles = [
  { label: "All Users", value: "all" },
  { label: "Farmers", value: "farmer" },
  { label: "Buyers", value: "customer" },
  { label: "Admins", value: "admin" },
];

const usersPerPage = 10;

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("All Regions");
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchAllUsers()).then((data) => {
      setUsers(data || []);
      setIsLoading(false);
    });
  }, [dispatch]);

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesRole =
      roleFilter === "all" || user.role?.toLowerCase() === roleFilter;
    const matchesRegion =
      regionFilter === "All Regions" ||
      user.region === regionFilter;
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesRegion && matchesSearch;
  });

  // Pagination logic
  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "#43a047";
      case "inactive":
        return "#bdbdbd";
      case "suspended":
        return "#e53935";
      default:
        return "#43a047";
    }
  };

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        User Management
      </Typography>
      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              mb: 2,
              alignItems: { sm: "center" },
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {roles.map((role) => (
                <Button
                  key={role.value}
                  variant={roleFilter === role.value ? "contained" : "outlined"}
                  color="primary"
                  onClick={() => {
                    setRoleFilter(role.value);
                    setCurrentPage(1);
                  }}
                  sx={{ minWidth: 100 }}
                >
                  {role.label}
                </Button>
              ))}
            </Box>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <TextField
                placeholder="Search users..."
                size="small"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 200 }}
              />
              <Select
                size="small"
                value={regionFilter}
                onChange={(e) => {
                  setRegionFilter(e.target.value);
                  setCurrentPage(1);
                }}
                sx={{ minWidth: 160 }}
              >
                {regions.map((region) => (
                  <MenuItem key={region} value={region}>
                    {region}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Region</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 5 }).map((_, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Skeleton variant="circular" width={40} height={40} />
                            <Box sx={{ ml: 2 }}>
                              <Skeleton width={80} />
                              <Skeleton width={40} />
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Skeleton width={100} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={60} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={60} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={60} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={80} />
                        </TableCell>
                        <TableCell align="right">
                          <Skeleton width={60} />
                        </TableCell>
                      </TableRow>
                    ))
                  : currentUsers.length > 0
                  ? currentUsers.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar
                              src={user.profileImage}
                              alt={user.name}
                              sx={{ width: 40, height: 40, bgcolor: "#e0e0e0" }}
                            >
                              {user.name?.charAt(0)}
                            </Avatar>
                            <Box sx={{ ml: 2 }}>
                              <Typography fontWeight={600}>{user.name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                #{user._id?.toString().slice(-4)}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography>{user.email}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {user.phone || "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ textTransform: "capitalize" }}>
                            {user.role}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>{user.region || "N/A"}</Typography>
                        </TableCell>
                        <TableCell>
                          <span
                            style={{
                              background: getStatusColor(user.status),
                              color: "#fff",
                              borderRadius: 12,
                              padding: "2px 12px",
                              fontSize: 12,
                              fontWeight: 600,
                              textTransform: "capitalize",
                            }}
                          >
                            {user.status || "active"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(user.createdAt)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Button variant="outlined" size="small" sx={{ mr: 1 }}>
                            Edit
                          </Button>
                          <Button variant="outlined" size="small">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No users found. Try adjusting your filter criteria.
                      </TableCell>
                    </TableRow>
                  )}
              </TableBody>
            </Table>
          </TableContainer>
          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, page) => setCurrentPage(page)}
                color="primary"
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}