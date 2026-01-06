import React, { useEffect, useState } from "react";
import ProductLists from "../homeFeed/ProductLists";
import SingleProductCard from "../homeFeed/SingleProductCard";
import ProductCreationModal from "./ProductCreationModal";
import { useSelector } from "react-redux";
import axios from "axios";

const FarmerMainContent = () => {
  const [showModal, setShowModal] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const [products, setProducts] = useState([]);
  const [productToEdit, setProductToEdit] = useState(null);

  const [stats, setStats] = useState({
    totalProducts: 0,
    inStock: 0,
    lowStock: 0
  });

  useEffect(() => {
    axios
      .get("http://localhost:5050/api/product/all")
      .then((res) => {
        console.log(res.data);
        const farmerProducts = res.data.data.filter((product) => product.owner._id === user.id);
        setProducts(farmerProducts);

        setStats({
          totalProducts: farmerProducts.length,
          inStock: farmerProducts.filter(p => p.stock > 0).length,
          lowStock: farmerProducts.filter(p => p.stock < 10).length
        });
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []);

  const handleProductSubmit = async (newProduct) => {
    const data = {
      name: newProduct.title,
      pricePerkg: newProduct.price,
      stock: newProduct.stock,
      productImage: newProduct.image,
      isAvailable: true,
    };

    try {
      if (productToEdit) {
        // Update existing product
        const response = await axios.put(
          `http://localhost:5050/api/product/update/${productToEdit._id}`,
          { ...data, pricePerKg: data.pricePerkg }, // Ensure key match
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        console.log("Product updated successfully:", response.data);
      } else {
        // Create new product
        const response = await axios.post(
          "http://localhost:5050/api/product/create",
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        console.log("Product created successfully:", response.data);
      }
      window.location.reload();
    } catch (error) {
      console.error(
        "Error submitting product:",
        error.response?.data || error.message
      );
    }
  };

  const handleEdit = (product) => {
    setProductToEdit(product);
    setShowModal(true);
  };

  return (
    <div className="flex-1 w-full bg-white pb-8 rounded-lg px-6 pt-4 mt-6">
      <div className="flex justify-between items-center gap-6 ">
        <h3 className="title-three">
          All Products <span>({products.length})</span>
        </h3>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="footnote bg-teal-800 font-medium text-white py-1.5 px-6 rounded-xl cursor-pointer"
        >
          Add new
        </button>
        <ProductCreationModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setProductToEdit(null);
          }}
          onSubmit={handleProductSubmit}
          initialData={productToEdit}
        />
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-4">
        <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-6 rounded-xl shadow-sm border border-teal-200">
          <h3 className="text-gray-600 text-sm font-medium">Total Products</h3>
          <p className="text-3xl font-bold text-teal-800 mt-2">{stats.totalProducts}</p>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl shadow-sm border border-green-200">
          <h3 className="text-gray-600 text-sm font-medium">In Stock</h3>
          <p className="text-3xl font-bold text-green-800 mt-2">{stats.inStock}</p>
        </div>
        <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-xl shadow-sm border border-red-200">
          <h3 className="text-gray-600 text-sm font-medium">Low Stock</h3>
          <p className="text-3xl font-bold text-red-800 mt-2">{stats.lowStock}</p>
        </div>
      </section>

      {products.length === 0 && (
        <div className="w-full flex justify-center items-center mt-8">
          <p className="text-gray-500">No products found</p>
        </div>
      )}
      <section className="w-full grid grid-cols-3 mt-6 gap-3 ">
        {products.map((product) => (
          <SingleProductCard
            key={product._id}
            product={product}
            onEdit={handleEdit}
          />
        ))}
      </section>
    </div>
  );
};

export default FarmerMainContent;
