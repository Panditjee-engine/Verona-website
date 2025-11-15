import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { useLocation } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FileUpload from '@/components/FileUpload';
import FileGallery from '@/components/FileGallery';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function Admin() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    category: 'ring',
    price: '',
    imageUrl: '',
  });

  const { data: products, isLoading: productsLoading, refetch: refetchProducts } = trpc.products.list.useQuery();
  const createProductMutation = trpc.products.create.useMutation();

  // Redirect if not authenticated or not admin
  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">You need admin access to view this page.</p>
          <Button onClick={() => setLocation('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productForm.name || !productForm.category || !productForm.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    createProductMutation.mutate(
      {
        name: productForm.name,
        description: productForm.description || undefined,
        category: productForm.category,
        price: parseInt(productForm.price) * 100, // Convert to cents
        imageUrl: productForm.imageUrl || undefined,
      },
      {
        onSuccess: () => {
          toast.success('Product created successfully');
          setProductForm({
            name: '',
            description: '',
            category: 'ring',
            price: '',
            imageUrl: '',
          });
          refetchProducts();
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to create product');
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage jewelry products and uploaded assets</p>
        </div>

        <Tabs defaultValue="uploads" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="uploads">File Uploads</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>

          {/* Uploads Tab */}
          <TabsContent value="uploads" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Upload Jewelry Images</CardTitle>
                <CardDescription>Upload high-quality images for your jewelry collection</CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload
                  onUploadSuccess={(file) => {
                    setProductForm({
                      ...productForm,
                      imageUrl: file.fileUrl,
                    });
                  }}
                />
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Uploaded Files</CardTitle>
                <CardDescription>Manage your jewelry image assets</CardDescription>
              </CardHeader>
              <CardContent>
                <FileGallery
                  onFileSelect={(file) => {
                    setProductForm({
                      ...productForm,
                      imageUrl: file.fileUrl,
                    });
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Create New Product</CardTitle>
                <CardDescription>Add a new jewelry piece to your collection</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Product Name *</label>
                    <Input
                      placeholder="e.g., Signature Diamond Ring"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                      placeholder="Describe your jewelry piece..."
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      className="bg-gray-800 border-gray-700"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Category *</label>
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                      >
                        <option value="ring">Ring</option>
                        <option value="necklace">Necklace</option>
                        <option value="bracelet">Bracelet</option>
                        <option value="earring">Earring</option>
                        <option value="pendant">Pendant</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Price (USD) *</label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        className="bg-gray-800 border-gray-700"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Image URL</label>
                    <Input
                      placeholder="https://..."
                      value={productForm.imageUrl}
                      onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={createProductMutation.isPending}
                    className="w-full"
                  >
                    {createProductMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Product'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Products</CardTitle>
                <CardDescription>Manage your jewelry collection</CardDescription>
              </CardHeader>
              <CardContent>
                {productsLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                  </div>
                ) : products && products.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="border border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        {product.imageUrl && (
                          <div className="aspect-square overflow-hidden bg-gray-800">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="font-medium text-sm truncate">{product.name}</h3>
                          <p className="text-xs text-gray-400 mt-1">{product.category}</p>
                          <p className="text-sm font-bold mt-2 text-blue-400">
                            ${(product.price / 100).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 text-gray-500">
                    <p>No products yet. Create your first product above.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
