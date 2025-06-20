import React, { useState } from 'react';
import { ProductTable } from '../components/productTable';
import { ProductModal } from '../components/productModal';
import { ProductPagination } from '../components/productPagination';
import { SearchInput } from '../components/searchInput';
import { Product, ProductFormData } from '../types/productTypes';
import { useProductContext } from '../contexts/ProductContext';
import './productPage.css';

const ProductPage: React.FC = () => {
  const {
    products,
    pagination,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  } = useProductContext();

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    await deleteProduct(id);
  };

  const handleSubmit = async (formData: ProductFormData) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
      } else {
        await createProduct(formData);
      }
      
      await fetchProducts(1, 10, searchTerm);
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handlePageChange = (page: number) => {
    fetchProducts(page, 10, searchTerm);
  };

  const handleSearch = () => {
    fetchProducts(1, 10, searchTerm);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    fetchProducts(1, 10);
  };

  const displayedProducts = products || [];

  return (
    <div className="products-container">
      <div className="products-header">
        <h1>Gerenciamento de Produtos</h1>
        <div className="header-actions">
          <button 
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            Novo Produto
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <ProductTable
        products={displayedProducts}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <div className="search-section">
        <SearchInput 
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar por nome..."
        />
        <button 
          onClick={handleSearch}
          className="btn-secondary"
        >
          Pesquisar
        </button>
        <button 
          onClick={handleClearSearch}
          className="btn-secondary"
        >
          Limpar
        </button>
      </div>

      {pagination && (
        <ProductPagination
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}

      <ProductModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        editingProduct={editingProduct}
        loading={loading}
      />
    </div>
  );
};

export default ProductPage;
