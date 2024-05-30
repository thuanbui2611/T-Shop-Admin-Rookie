import { Button, CardFooter } from "@material-tailwind/react";
import { ImageOfProduct, Product } from "../../app/models/Product";
import Autocomplete from "@mui/material/Autocomplete";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Brand, ModelOfBrand } from "../../app/models/Brand";
import { Color } from "../../app/models/Color";
import { FieldValues, useForm } from "react-hook-form";
import AppTextInput from "../../app/components/AppTextInput";
import { TextField } from "@mui/material";
import { updateProductAsync, addProductAsync } from "./ProductSlice";
import { useAppDispatch, useAppSelector } from "../../app/store/ConfigureStore";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import {
  getBrandsAsync,
  getColorsAsync,
  getTypesAsync,
} from "../filter/FilterSlice";
import { Type } from "../../app/models/Type";

interface Props {
  product: Product | null;
  cancelEdit: () => void;
  actionName: string;
}

type ImageFile = {
  name?: string | null;
  url: string | null;
};

export default function ProductForm({
  product,
  cancelEdit,
  actionName,
}: Props) {
  const [imagesDefault, setImagesDefault] = useState<ImageOfProduct[]>([]);
  //   ImageOfProduct[]
  //   >([]);
  const [imagesSelected, setImagesSelected] = useState<ImageFile[] | null>(
    null
  );
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const [selectedType, setSelectedType] = useState<Type | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [modelsOfBrand, setModelsOfBrand] = useState<ModelOfBrand[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelOfBrand | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    mode: "all",
  });

  const dispatch = useAppDispatch();

  const { brands, brandLoading, types, typeLoading, colors, colorLoading } =
    useAppSelector((state) => state.filter);

  useEffect(() => {
    if (product) {
      const productDetails = { ...product };
      reset(productDetails);

      //get images and set selected images
      const defaultImage: ImageFile[] = product.images.map((image) => ({
        url: image.imageUrl,
      }));
      setImagesSelected(defaultImage);
      setImagesDefault(product.images);
      //Set selected/ default values
      const selectedBrand = brands.find((b) => b.id === product.model.brand.id);
      setSelectedBrand(selectedBrand || null);
      setSelectedModel(product.model);
      setSelectedColor(product.color);
      setSelectedType(product.type);
      //set models of selected brand
      setModelsOfBrand(selectedBrand?.models || []);
    }
  }, [product, reset, brands]);

  // Get data for select option
  useEffect(() => {
    if (brands.length === 0 && !brandLoading) {
      dispatch(getBrandsAsync());
    }
    if (types.length === 0 && !typeLoading) {
      dispatch(getTypesAsync());
    }
    if (colors.length === 0 && !colorLoading) {
      dispatch(getColorsAsync());
    }
  }, []);

  //trigger add selected images when user upload
  useEffect(() => {
    if (selectedFiles) {
      const imagesSelected: ImageFile[] = [];
      // Set image default
      if (imagesDefault) {
        const setImageSelected: ImageFile[] = imagesDefault.map((image) => ({
          url: image.imageUrl,
        }));
        setImagesSelected(setImageSelected);
      }
      // Set image from user upload
      // Convert selectedFiles to selectedImages
      for (let i = 0; i < selectedFiles?.length; i++) {
        const file = selectedFiles[i];
        const name = file.name;
        const url = URL.createObjectURL(file);
        imagesSelected.push({ name, url });
      }
      setImagesSelected((prevImages) => [...prevImages!, ...imagesSelected]);
    }
  }, [selectedFiles]);

  const onClose = () => {
    cancelEdit();
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setSelectedFiles((prevFiles) => {
      // Check type
      for (let i = 0; i < files?.length!; i++) {
        if (!files![i].type.startsWith("image/")) {
          toast.error("Accept only image file");
          return prevFiles;
        }
      }
      // Check limit file upload
      if (files?.length! > 5) {
        toast.error("You can only upload 5 images");
        return prevFiles;
      }
      // Check prev files limit
      if (imagesSelected && imagesSelected.length + files!.length > 5) {
        toast.error("You can only use 5 images");
        return prevFiles;
      }
      if (prevFiles) {
        // Convert the FileList to an array
        const prevFilesArray = Array.from(prevFiles);
        // Convert the new files to an array
        const newFilesArray = Array.from(files || []);
        // Concatenate the previous and new files arrays
        const combinedFilesArray = [...prevFilesArray, ...newFilesArray];
        // Convert the combined files array back to a FileList
        const combinedFilesList = createFileList(combinedFilesArray);
        return combinedFilesList;
      }
      // If there were no previous files, simply use the new FileList
      return files;
    });
    e.target.files = null;
  };

  const removeImageFromList = (file: ImageFile, index: number) => {
    if (!imagesSelected) return;
    const imageToRemove = imagesSelected[index];
    const isImageRemovedFromDefaultImage: Boolean = imagesDefault.some(
      (i) =>
        i.imageUrl?.toLowerCase() === imageToRemove.url?.toLocaleLowerCase()
    );
    if (isImageRemovedFromDefaultImage) {
      //Remove image from default image
      const imagesDefaultModified = [...imagesDefault].filter(
        (i) => i.imageUrl?.toLowerCase() !== imageToRemove.url?.toLowerCase()
      );
      setImagesDefault(imagesDefaultModified);
      //Remove image from selected image to display
    } else if (selectedFiles) {
      // Remove image from upload
      const imagesUploadModifiedArray = Array.from(selectedFiles).filter(
        (file) => file.name.toLowerCase() !== imageToRemove.name?.toLowerCase()
      );
      setSelectedFiles(createFileList(imagesUploadModifiedArray));
    }
    //Update imagesSelected
    const imagesSelectedModified = imagesSelected.filter(
      (i) => i.url?.toLowerCase() !== imageToRemove.url?.toLowerCase()
    );
    setImagesSelected(imagesSelectedModified);
  };

  const createFileList = (files: File[]) => {
    const dataTransfer = new DataTransfer();
    files.forEach((file) => {
      dataTransfer.items.add(file);
    });
    return dataTransfer.files;
  };

  const handleBrandChange = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: Brand | null
  ) => {
    if (!newValue) return;
    setSelectedBrand(newValue);
    if (newValue.models.length > 0) {
      setModelsOfBrand(newValue.models);
    }
  };

  const handleTypeChange = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: Type | null
  ) => {
    if (newValue) {
      setSelectedType(newValue);
    }
  };

  const handleModelChange = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: ModelOfBrand | null
  ) => {
    setSelectedModel(newValue);
  };

  const handleColorChange = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: Color | null
  ) => {
    setSelectedColor(newValue);
  };

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevents the form from automatically submitting
    }
  };

  async function submitForm(data: FieldValues) {
    try {
      //Check images
      if (imagesDefault.length === 0 && !selectedFiles) {
        toast.error("Product need at least one image");
        return;
      }
      //create form
      const dataOfForm = {
        modelId: selectedModel?.id,
        colorId: selectedColor?.id,
        typeId: selectedType?.id,
        variant: data.variant,
        price: data.price,
        quantity: data.quantity,
        description: data.description,
      };

      const formData = new FormData();
      //append data
      Object.entries(dataOfForm).forEach(([key, value]) => {
        formData.append(key, value);
      });
      //append list Current image
      debugger;
      if (imagesDefault.length !== 0) {
        formData.append("images", JSON.stringify(imagesDefault));
      }
      //append list Upload file
      if (selectedFiles) {
        Array.from(selectedFiles).forEach((file) => {
          formData.append(`imagesUpload`, file);
        });
      }
      //start action
      if (product) {
        //Edit Product
        await dispatch(
          updateProductAsync({
            formData: formData,
            id: product.id,
          })
        );
      } else {
        //Add product
        await dispatch(addProductAsync(formData));
      }
      cancelEdit();
    } catch (error) {
      console.log("Error when submit form:", error);
    }
  }

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };
  return (
    <>
      <div
        className={`fixed inset-0 h-screen w-screen z-9999 bg-black bg-opacity-30 flex items-center justify-center`}
        onClick={handleClickOutside}
      >
        <form
          className="relative bg-white max-w-5xl h-fit p-10 rounded-xl max-h-[600px] scrollbar overflow-auto"
          onKeyDown={handleKeyPress}
          onSubmit={handleSubmit(submitForm)}
        >
          <div className="border-b-2 border-neutral-100 border-opacity-100 mb-5 pb-5">
            <p className="text-center text-4xl font-bold text-gradient">
              {actionName}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="absolute right-1 top-1 rounded-md flex text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col">
              <label className="block mb-2 text-sm font-semibold text-black">
                Type
              </label>
              <Autocomplete
                size="small"
                disablePortal
                value={selectedType}
                options={types}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) =>
                  handleTypeChange(event, newValue)
                }
                renderInput={(params) => <TextField {...params} required />}
              />
            </div>

            <div className="flex flex-col">
              <label className="block mb-2 text-sm font-semibold text-black">
                Brand
              </label>
              <Autocomplete
                size="small"
                disablePortal
                value={selectedBrand}
                options={brands}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) =>
                  handleBrandChange(event, newValue)
                }
                renderInput={(params) => <TextField {...params} required />}
              />
            </div>

            <div className="flex flex-col">
              <label className="block mb-2 text-sm font-semibold text-black">
                Model
              </label>
              <Autocomplete
                disabled={!selectedBrand}
                size="small"
                disablePortal
                value={selectedModel}
                options={modelsOfBrand}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) =>
                  handleModelChange(event, newValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    className={`${
                      !selectedBrand && "bg-blue-gray-50 rounded-md"
                    }`}
                  />
                )}
              />
            </div>
            <div className="flex flex-col">
              <label className="block mb-2 text-sm font-semibold text-black">
                Color
              </label>
              <Autocomplete
                disabled={!selectedModel}
                size="small"
                disablePortal
                value={selectedColor}
                options={colors}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) =>
                  handleColorChange(event, newValue)
                }
                renderInput={(params) => <TextField {...params} required />}
              />
            </div>
          </div>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div className="flex justify-between gap-6">
              <div>
                <label className="block mb-2 text-sm font-semibold text-black">
                  Variant
                </label>
                <AppTextInput
                  label=""
                  control={control}
                  size="small"
                  type="text"
                  {...register("variant", {
                    required: "Variant is required",
                  })}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-black">
                  Price
                </label>
                <AppTextInput
                  label=""
                  control={control}
                  size="small"
                  type="number"
                  placeholder="100.000"
                  {...register("price", {
                    required: "Price is required",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Invalid price, accept only number",
                    },
                  })}
                />
              </div>
            </div>
            <div className="flex justify-between gap-6">
              <div>
                <label className="block mb-2 text-sm font-semibold text-black">
                  Quantity
                </label>
                <AppTextInput
                  label=""
                  control={control}
                  size="small"
                  type="number"
                  {...register("quantity", {
                    required: "Quantity is required",
                  })}
                />
              </div>
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-black">
                Description
              </label>
              <AppTextInput
                label=""
                control={control}
                size="medium"
                type="text"
                placeholder="This is a lastest car..."
                {...register("description", {
                  required: "Description is required",
                })}
              />
            </div>
          </div>
          <div className="mb-1">
            <label className="block text-sm font-semibold text-black">
              Images
            </label>
            {!imagesSelected && (
              <div className="mb-8 mt-2">
                <input
                  type="file"
                  name="logo"
                  id="file"
                  className="sr-only"
                  onChange={handleImageChange}
                  accept="image/*"
                  ref={fileInputRef}
                  multiple
                />
                <label
                  htmlFor="file"
                  className="relative flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center hover:bg-gray-100 cursor-pointer"
                >
                  <div>
                    <span className="mb-2 block text-xl font-semibold text-[#07074D]">
                      Drop image here
                    </span>
                    <span className="mb-2 block text-base font-medium text-[#6B7280]">
                      Or
                    </span>
                    <span className="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#07074D]">
                      Browse
                    </span>
                  </div>
                </label>
              </div>
            )}
          </div>

          {imagesSelected && (
            <div className="flex h-[190px] gap-3 mb-5 rounded-md bg-[#F5F7FB] py-4 px-8 w-full scrollbar overflow-auto">
              {imagesSelected.map((image, index) => (
                <div className="w-1/5 pb-4" key={index}>
                  <div className="flex items-center justify-between pb-1 ">
                    <span className="truncate text-xs font-medium text-[#07074D]">
                      {image.name}
                    </span>
                    <div
                      className="text-[#07074D] cursor-pointer hover:text-red-600"
                      onClick={() => removeImageFromList(image, index)}
                    >
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M0.279337 0.279338C0.651787 -0.0931121 1.25565 -0.0931121 1.6281 0.279338L9.72066 8.3719C10.0931 8.74435 10.0931 9.34821 9.72066 9.72066C9.34821 10.0931 8.74435 10.0931 8.3719 9.72066L0.279337 1.6281C-0.0931125 1.25565 -0.0931125 0.651788 0.279337 0.279338Z"
                          fill="currentColor"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M0.279337 9.72066C-0.0931125 9.34821 -0.0931125 8.74435 0.279337 8.3719L8.3719 0.279338C8.74435 -0.0931127 9.34821 -0.0931123 9.72066 0.279338C10.0931 0.651787 10.0931 1.25565 9.72066 1.6281L1.6281 9.72066C1.25565 10.0931 0.651787 10.0931 0.279337 9.72066Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex"></div>
                  <img
                    className="h-full w-full"
                    src={image.url || undefined}
                    alt="Product Images"
                  />
                </div>
              ))}
              {imagesSelected && imagesSelected?.length < 5 && (
                <div className=" border w-40 h-full">
                  <input
                    type="file"
                    name="logo"
                    id="file"
                    className="sr-only"
                    onChange={handleImageChange}
                    accept="image/*"
                    ref={fileInputRef}
                    multiple
                  />
                  <label
                    htmlFor="file"
                    className="w-full h-full flex flex-col justify-center items-center hover:bg-blue-gray-50 cursor-pointer"
                  >
                    <svg
                      width="30px"
                      height="30px"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="#1C274C"
                          strokeWidth="1.2"
                        ></circle>
                        <path
                          d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15"
                          stroke="#1C274C"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                        ></path>
                      </g>
                    </svg>
                    <span className=" text-xs font-medium ml-1">
                      Add more images
                    </span>
                  </label>
                </div>
              )}
            </div>
          )}
          <CardFooter className="pt-0 pb-0 flex flex-row justify-center gap-16 ">
            <LoadingButton
              className="bg-gradient-to-tr from-light-blue-600 to-light-blue-400 text-white shadow-md shadow-light-blue-500/20 hover:shadow-lg hover:shadow-light-blue-500/40 active:opacity-[0.85]"
              loading={isSubmitting}
              disabled={isSubmitting || brandLoading}
              type="submit"
              variant="contained"
              color="success"
            >
              <span className="font-bold">Confirm</span>
            </LoadingButton>
            <Button variant="gradient" color="red" size="lg" onClick={onClose}>
              Cancel
            </Button>
          </CardFooter>
        </form>
      </div>
    </>
  );
}
