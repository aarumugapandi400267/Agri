import * as types from "../constants/actionTypes";

const initialState = {
  admin: null,
  users: [],
  user: null,
  products: [],
  product: null,
  orders: [],
  order: null,
  categories: [],
  regions: [],
  dashboardKPIs: {},
  loading: false,
  error: null,
};

export default function adminReducer(state = initialState, action) {
  switch (action.type) {
    // --- Auth ---
    case types.ADMIN_LOGIN:
      return { ...state, admin: action.payload, error: null };
    case types.ADMIN_LOGOUT:
      return { ...initialState };

    // --- Users ---
    case types.ADMIN_FETCH_USERS:
      return { ...state, users: action.payload, error: null };
    case types.ADMIN_FETCH_USER:
      return { ...state, user: action.payload, error: null };
    case types.ADMIN_UPDATE_USER:
      return {
        ...state,
        users: state.users.map(u => u._id === action.payload._id ? action.payload : u),
        user: action.payload,
        error: null,
      };
    case types.ADMIN_DELETE_USER:
      return {
        ...state,
        users: state.users.filter(u => u._id !== action.payload),
        error: null,
      };

    // --- Products ---
    case types.ADMIN_FETCH_PRODUCTS:
      return { ...state, products: action.payload, error: null };
    case types.ADMIN_CREATE_PRODUCT:
      return { ...state, products: [action.payload, ...state.products], error: null };
    case types.ADMIN_UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map(p => p._id === action.payload._id ? action.payload : p),
        product: action.payload,
        error: null,
      };
    case types.ADMIN_DELETE_PRODUCT:
      return {
        ...state,
        products: state.products.filter(p => p._id !== action.payload),
        error: null,
      };

    // --- Orders ---
    case types.ADMIN_FETCH_ORDERS:
      return { ...state, orders: action.payload, error: null };
    case types.ADMIN_FETCH_ORDER:
      return { ...state, order: action.payload, error: null };
    case types.ADMIN_UPDATE_ORDER:
      return {
        ...state,
        orders: state.orders.map(o => o._id === action.payload._id ? action.payload : o),
        order: action.payload,
        error: null,
      };
    case types.ADMIN_DELETE_ORDER:
      return {
        ...state,
        orders: state.orders.filter(o => o._id !== action.payload),
        error: null,
      };

    // --- Categories ---
    case types.ADMIN_FETCH_CATEGORIES:
      return { ...state, categories: action.payload, error: null };
    case types.ADMIN_CREATE_CATEGORY:
      return { ...state, categories: [action.payload, ...state.categories], error: null };
    case types.ADMIN_UPDATE_CATEGORY:
      return {
        ...state,
        categories: state.categories.map(c => c._id === action.payload._id ? action.payload : c),
        error: null,
      };
    case types.ADMIN_DELETE_CATEGORY:
      return {
        ...state,
        categories: state.categories.filter(c => c._id !== action.payload),
        error: null,
      };

    // --- Regions ---
    case types.ADMIN_FETCH_REGIONS:
      return { ...state, regions: action.payload, error: null };
    case types.ADMIN_CREATE_REGION:
      return { ...state, regions: [action.payload, ...state.regions], error: null };
    case types.ADMIN_UPDATE_REGION:
      return {
        ...state,
        regions: state.regions.map(r => r._id === action.payload._id ? action.payload : r),
        error: null,
      };
    case types.ADMIN_DELETE_REGION:
      return {
        ...state,
        regions: state.regions.filter(r => r._id !== action.payload),
        error: null,
      };

    // --- Dashboard KPIs ---
    case types.ADMIN_FETCH_DASHBOARD_KPIS:
      return { ...state, dashboardKPIs: action.payload, error: null };

    // --- Error handling (optional) ---
    default:
      return state;
  }
}