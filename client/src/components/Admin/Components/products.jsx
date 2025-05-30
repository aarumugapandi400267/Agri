import ProductApproval from "@/components/admin/ProductApproval";
import { Helmet } from "react-helmet";

const Products = () => {
  return (
    <>
      <Helmet>
        <title>Product Approval - FarmConnect Admin</title>
        <meta name="description" content="Manage and approve product listings from farmers on the FarmConnect platform" />
      </Helmet>
      <ProductApproval />
    </>
  );
};

export default Products;