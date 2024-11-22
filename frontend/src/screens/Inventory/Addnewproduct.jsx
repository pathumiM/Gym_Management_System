import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import { useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [Cvalidation, setCValidation] = useState(null);

  const navigate = useNavigate();

  const handleUpdloadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/items/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        alert("Product added successfully");
        navigate("/inventory");
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  const handlepriceChange = (e) => {
    const price = e.target.value.trim();
    const pricePattern = /^[1-9]\d*$/; // Pattern for positive integers 

    // Validation of price
    if (price === "") {
      setCValidation(null);
    } else if (!pricePattern.test(price)) {
      if (isNaN(price)) {
        setCValidation("Price must be a number");
      } else {
        setCValidation("Price must be a positive integer");
      }
    } else {
      setFormData({ ...formData, price });
      setCValidation(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <Link to="/inventory" className="flex items-center text-yellow-600 hover:text-yellow-700 transition duration-150 ease-in-out mb-6">
            <ArrowLeft size={20} className="mr-2" />
            <span>Back to Inventory</span>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Add New Product
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="product-name" className="sr-only">Product Name</label>
              <input
                id="product-name"
                name="product-name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                placeholder="Product Name"
                onChange={(e) => setFormData({ ...formData, ItemsN: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="price" className="sr-only">Price</label>
              <input
                id="price"
                name="price"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                placeholder="Price"
                onChange={handlepriceChange}
              />
            </div>
            <div>
              <label htmlFor="quantity" className="sr-only">Quantity</label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                placeholder="Quantity"
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="size" className="sr-only">Size</label>
              <input
                id="size"
                name="size"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                placeholder="Size"
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="flavor" className="sr-only">Flavor</label>
              <input
                id="flavor"
                name="flavor"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                placeholder="Flavor"
                onChange={(e) => setFormData({ ...formData, flavor: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="description" className="sr-only">Description</label>
              <textarea
                id="description"
                name="description"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                placeholder="Description"
                rows="3"
                onChange={(e) => setFormData({ ...formData, descrip: e.target.value })}
              ></textarea>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-yellow-50 file:text-yellow-700
                  hover:file:bg-yellow-100"
              />
              <button
                type="button"
                onClick={handleUpdloadImage}
                disabled={imageUploadProgress}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
              >
                {imageUploadProgress ? (
                  <CircularProgressbar
                    value={imageUploadProgress}
                    text={`${imageUploadProgress || 0}%`}
                    styles={{
                      root: { width: '24px', height: '24px', marginRight: '8px' },
                      path: { stroke: '#ffffff' },
                      text: { fill: '#ffffff', fontSize: '24px' },
                    }}
                  />
                ) : (
                  <Upload size={20} className="mr-2" />
                )}
                Upload Image
              </button>
            </div>
            {imageUploadError && (
              <p className="mt-2 text-sm text-red-600">{imageUploadError}</p>
            )}
            {formData.image && (
              <img
                src={formData.image}
                alt="Uploaded"
                className="mt-4 w-full h-32 object-cover rounded-md"
              />
            )}
          </div>

          {Cvalidation && (
            <p className="mt-2 text-sm text-red-600">{Cvalidation}</p>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Add Product
            </button>
          </div>

          {publishError && (
            <p className="mt-2 text-sm text-red-600">{publishError}</p>
          )}
        </form>
      </div>
    </div>
  );
}