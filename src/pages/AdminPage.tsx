import React, { useState, useEffect } from 'react';
import { Upload, Plus, Trash2, Edit, Tag, Package, FileText } from 'lucide-react';
import { Product, Category, Tag as TagType } from '../types';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [loading, setLoading] = useState(true);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes, tagsRes] = await Promise.all([
        apiService.getProducts(),
        apiService.getCategories(),
        apiService.getTags(),
      ]);
      setProducts(productsRes);
      setCategories(categoriesRes);
      setTags(tagsRes);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCsvUpload = async () => {
    if (!csvFile) return;
    
    setUploading(true);
    try {
      // Parse CSV file
      const text = await csvFile.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const products = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const product: any = {};
        
        headers.forEach((header, index) => {
          const value = values[index] || '';
          
          switch (header.toLowerCase()) {
            case 'name':
              product.name = value;
              break;
            case 'category':
              product.category = value;
              break;
            case 'description':
              product.description = value;
              break;
            case 'price':
              product.price = parseFloat(value) || 0;
              break;
            case 'images':
              product.images = value ? value.split('|') : [];
              break;
            case 'tags':
              product.tags = value ? value.split('|') : [];
              break;
            case 'instock':
              product.inStock = value.toLowerCase() === 'true';
              break;
            case 'featured':
              product.featured = value.toLowerCase() === 'true';
              break;
            case 'noofproducts':
              product.noOfProducts = parseInt(value) || 0;
              break;
            default:
              if (header.startsWith('spec_')) {
                const specKey = header.replace('spec_', '');
                product.specifications = product.specifications || {};
                product.specifications[specKey] = value;
              }
          }
        });
        
        return {
          ...product,
          noOfProducts: product.noOfProducts || 0,
          specifications: product.specifications || {},
          variants: {},
          preorderAvailable: false,
          rating: 0,
          reviews: 0,
        };
      }).filter(p => p.name); // Filter out empty lines
      
      await apiService.importProducts(products);
      await loadData();
      setCsvFile(null);
      alert('Products imported successfully!');
    } catch (error) {
      console.error('Error uploading CSV:', error);
      alert('Error uploading CSV file');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAllProducts = async () => {
    if (confirm('Are you sure you want to delete all products?')) {
      try {
        await apiService.deleteProducts();
        await loadData();
        alert('All products deleted successfully!');
      } catch (error) {
        console.error('Error deleting products:', error);
        alert('Error deleting products');
      }
    }
  };

  const handleCreateCategory = async () => {
    const name = prompt('Enter category name:');
    const description = prompt('Enter category description:');
    
    if (name) {
      try {
        await apiService.createCategory({ name, description: description || '' });
        await loadData();
      } catch (error) {
        console.error('Error creating category:', error);
        alert('Error creating category');
      }
    }
  };

  const handleCreateTag = async () => {
    const name = prompt('Enter tag name:');
    
    if (name) {
      try {
        await apiService.createTag({ name });
        await loadData();
      } catch (error) {
        console.error('Error creating tag:', error);
        alert('Error creating tag');
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your jewelry store inventory and settings</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'products', label: 'Products', icon: Package },
              { id: 'categories', label: 'Categories', icon: FileText },
              { id: 'tags', label: 'Tags', icon: Tag },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Upload Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Import Products</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload CSV File
                  </label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={handleCsvUpload}
                    disabled={!csvFile || uploading}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>{uploading ? 'Uploading...' : 'Upload Products'}</span>
                  </button>
                  <button
                    onClick={handleDeleteAllProducts}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 flex items-center space-x-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete All Products</span>
                  </button>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">CSV Format Guide:</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Your CSV should include these columns:
                </p>
                <code className="text-xs bg-white p-2 rounded block">
                  name,category,description,price,images,tags,instock,featured,noOfProducts,spec_material,spec_weight
                </code>
                <p className="text-xs text-gray-500 mt-2">
                  • Use | to separate multiple images or tags<br/>
                  • Use spec_ prefix for specifications<br/>
                  • instock and featured should be true/false<br/>
                  • noOfProducts should be a number
                </p>
              </div>
            </div>

            {/* Products List */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  Products ({products.length})
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={product.images[0] || 'https://images.pexels.com/photos/1191537/pexels-photo-1191537.jpeg'}
                              alt={product.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {product.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                Stock: {product.noOfProducts || 0} | {product.tags.join(', ')}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{product.price.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mb-1 ${
                              product.inStock
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {product.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                            <span className="text-xs text-gray-500">
                              Qty: {product.noOfProducts || 0}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-purple-600 hover:text-purple-900 mr-3">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Categories ({categories.length})
                </h2>
                <button
                  onClick={handleCreateCategory}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Category</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800">{category.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                    <div className="mt-3 flex justify-end">
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tags Tab */}
        {activeTab === 'tags' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Tags ({tags.length})
                </h2>
                <button
                  onClick={handleCreateTag}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Tag</span>
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <div key={tag.id} className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                    <span className="text-sm font-medium">{tag.name}</span>
                    <button className="ml-2 text-purple-600 hover:text-purple-900">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;