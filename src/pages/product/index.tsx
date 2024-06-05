import { useEffect, useState } from "react";
import Breadcrumb from "../../app/components/Breadcrumb";
import { useAppDispatch, useAppSelector } from "../../app/store/ConfigureStore";
import {
  deleteProductAsync,
  getProductsAsync,
  setProductParams,
  productSelectors,
} from "./ProductSlice";
import Loader from "../../app/components/Loader";
import Pagination from "../../app/components/Pagination";
import { Product } from "../../app/models/Product";
// import ProductForm from "./ProductForm";
import ConfirmDeleteDialog from "../../app/components/ConfirmDeleteDialog";
// import ProductDetails from "./ProductDetails";
import { useSearchParams } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import { TextField } from "@mui/material";
import { Brand } from "../../app/models/Brand";
import { ModelProduct } from "../../app/models/ModelProduct";
import LoaderButton from "../../app/components/LoaderButton";
import SelectPageSize from "../../app/components/SelectPageSize";
import {
  getBrandsAsync,
  getColorsAsync,
  getModelsAsync,
  getTypesAsync,
} from "../filter/FilterSlice";
import { Type } from "../../app/models/Type";
import { Color } from "../../app/models/Color";
import ProductForm from "./ProductForm";
import useDebounce from "../../app/hooks/useDebounce";
import ProductDetails from "./ProductDetails";

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams({});

  const [actionName, setActionName] = useState(String);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [confirmDeleteDiaglog, setConfirmDeleteDiaglog] = useState(false);
  const [productDeleted, setProductDeleted] = useState<Product>({} as Product);
  const [openDetails, setOpenDetails] = useState(false);
  //Filter
  const [isStartFilter, setIsStartFilter] = useState(false);
  const [selectedPageSize, setSelectedPageSize] = useState<number>(5);
  const [selectedBrands, setSelectedBrands] = useState<Brand[]>([]);
  const [selectedColors, setSelectedColors] = useState<Color[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<Type[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedModels, setSelectedModels] = useState<ModelProduct[]>([]);

  const products = useAppSelector(productSelectors.selectAll);
  const { productLoaded, metaData, productParams } = useAppSelector(
    (state) => state.product
  );

  //get data for filter from state
  const {
    brands,
    brandLoading,
    types,
    typeLoading,
    models,
    modelProductLoading,
    colors,
    colorLoading,
  } = useAppSelector((state) => state.filter);

  const dispatch = useAppDispatch();
  //Get params value from url
  const pageNum = searchParams.get("pageNumber");
  const pageSize = searchParams.get("pageSize");
  const brandsParam = searchParams.get("Brands");
  const modelsParam = searchParams.get("Models");
  const typesParam = searchParams.get("Types");
  const colorsParam = searchParams.get("Colors");
  const searchQueryParam = searchParams.get("Search");

  // Get data for filter
  useEffect(() => {
    if (brands.length === 0 && !brandLoading) {
      dispatch(getBrandsAsync());
    }
    if (types.length === 0 && !typeLoading) {
      dispatch(getTypesAsync());
    }
    if (models.length === 0 && !modelProductLoading) {
      dispatch(getModelsAsync());
    }
    if (colors.length === 0 && !colorLoading) {
      dispatch(getColorsAsync());
    }
  }, []);
  // End of Get data for filter
  //Get valueFilter from url params, then set selected filterValue and request (dispatch).
  useEffect(() => {
    if (
      models.length > 0 &&
      types.length > 0 &&
      brands.length > 0 &&
      colors.length > 0
    ) {
      //Types filter
      if (typesParam !== "") {
        let typesFilter: string[] = [];
        if (typesParam) {
          typesFilter = typesParam.split("%2C");
        } else if (productParams.types && productParams.types.length > 0) {
          typesFilter = productParams.types;
        }
        const typesSelected = types.filter((type) =>
          typesFilter.includes(type.name)
        );
        setSelectedTypes(typesSelected);
        dispatch(setProductParams({ types: typesFilter }));
      } else {
        setSearchParams((prev) => {
          prev.delete("Types");
          return prev;
        });
      }
      //Model filter
      if (modelsParam !== "") {
        let modelsFilter: string[] = [];
        if (modelsParam) {
          modelsFilter = modelsParam.split("%2C");
        } else if (productParams.models && productParams.models.length > 0) {
          modelsFilter = productParams.models;
        }
        const modelsSelected = models.filter((model) =>
          modelsFilter.includes(model.name)
        );
        setSelectedModels(modelsSelected);
        dispatch(setProductParams({ models: modelsFilter }));
      } else {
        setSearchParams((prev) => {
          prev.delete("Models");
          return prev;
        });
      }
      //Brand filter
      if (brandsParam !== "") {
        let brandsFilter: string[] = [];
        if (brandsParam) {
          brandsFilter = brandsParam.split("%2C");
        } else if (productParams.brands && productParams.brands.length > 0) {
          brandsFilter = productParams.brands;
        }
        const brandsSelected = brands.filter((brand) =>
          brandsFilter.includes(brand.name)
        );
        setSelectedBrands(brandsSelected);
        dispatch(setProductParams({ brands: brandsFilter }));
      } else {
        setSearchParams((prev) => {
          prev.delete("Brands");
          return prev;
        });
      }

      //Color filter
      if (colorsParam !== "") {
        let colorsFilter: string[] = [];
        if (colorsParam) {
          colorsFilter = colorsParam.split("%2C");
        } else if (productParams.colors && productParams.colors.length > 0) {
          colorsFilter = productParams.colors;
        }
        const colorsSelected = colors.filter((color) =>
          colorsFilter.includes(color.name)
        );
        setSelectedColors(colorsSelected);
        dispatch(setProductParams({ colors: colorsFilter }));
      } else {
        setSearchParams((prev) => {
          prev.delete("Colors");
          return prev;
        });
      }
    } else {
      switch (true) {
        case models === null || typeof models === "undefined":
          console.log("models is null or undefined");
          break;
        case types === null || typeof types === "undefined":
          console.log("types is null or undefined");
          break;
        case brands === null || typeof brands === "undefined":
          console.log("brands is null or undefined");
          break;
        case colors === null || typeof colors === "undefined":
          console.log("colors is null or undefined");
          break;
        default:
      }
    }
  }, [
    modelsParam,
    models,
    colorsParam,
    colors,
    brandsParam,
    brands,
    typesParam,
    types,
  ]);
  // End of Get valueFilter from url params, then set selected filterValue and request (dispatch).

  useEffect(() => {
    if (pageNum === "1") {
      setSearchParams((prev) => {
        prev.delete("pageNumber");
        return prev;
      });
      dispatch(setProductParams({ pageNumber: 1 }));
    } else if (pageNum) {
      dispatch(setProductParams({ pageNumber: +pageNum }));
    }
  }, [pageNum, dispatch]);

  useEffect(() => {
    if (pageSize === "5") {
      setSearchParams((prev) => {
        prev.delete("pageSize");
        return prev;
      });
      dispatch(setProductParams({ pageSize: 5 }));
    } else {
      let pageSizeCurrent: number = 5;
      if (pageSize) {
        pageSizeCurrent = +pageSize;
      } else {
        pageSizeCurrent = productParams.pageSize;
      }
      setSelectedPageSize(pageSizeCurrent);
      dispatch(setProductParams({ pageSize: pageSizeCurrent }));
    }
  }, [pageSize, dispatch]);
  //End of get valueFilter from url params and set selected

  //Search
  //handle get search from params
  useEffect(() => {
    if (searchQueryParam) {
      handleSearch(searchQueryParam);
    }
  }, []);
  //handle debounce search when input
  var debouncedSearchQuery = useDebounce(searchQuery, 300);
  useEffect(() => {
    handleSearch();
  }, [debouncedSearchQuery, dispatch]);

  //Starting filter
  useEffect(() => {
    if (!isStartFilter) {
      if (
        pageNum ||
        pageSize ||
        searchQueryParam ||
        brandsParam ||
        modelsParam ||
        typesParam ||
        colorsParam
      ) {
        setIsStartFilter(true);
      }
    }
  }, [productParams, pageNum]);

  // Handle change filter
  const handleSelectTypeChange = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: Type[]
  ) => {
    // set to url params
    if (newValue.length > 0) {
      const typesFiltered = newValue?.map((type) => type.name);
      if (searchParams.get("Types")) {
        setSearchParams((prev) => {
          prev.set("Types", typesFiltered?.join("%2C") || "");
          return prev;
        });
      } else {
        setSearchParams((prev) => {
          prev.append("Types", typesFiltered?.join("%2C") || "");
          return prev;
        });
      }
    } else {
      setSearchParams((prev) => {
        prev.delete("Types");
        return prev;
      });
      dispatch(setProductParams({ types: [] }));
      setSelectedTypes([]);
    }
    setSearchParams((prev) => {
      prev.set("pageNumber", "1");
      return prev;
    });
    setIsStartFilter(true);
  };
  const handleSelectModelChange = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: ModelProduct[]
  ) => {
    // set to url params
    if (newValue.length > 0) {
      const modelsFiltered = newValue?.map((model) => model.name);
      if (searchParams.get("Models")) {
        setSearchParams((prev) => {
          prev.set("Models", modelsFiltered?.join("%2C") || "");
          return prev;
        });
      } else {
        setSearchParams((prev) => {
          prev.append("Models", modelsFiltered?.join("%2C") || "");
          return prev;
        });
      }
    } else {
      setSearchParams((prev) => {
        prev.delete("Models");
        return prev;
      });
      dispatch(setProductParams({ models: [] }));
      setSelectedModels([]);
    }
    setIsStartFilter(true);
    setSearchParams((prev) => {
      prev.set("pageNumber", "1");
      return prev;
    });
  };
  const handleSelectBrandChange = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: Brand[]
  ) => {
    // set to url params
    if (newValue.length > 0) {
      const brandsFiltered = newValue?.map((brand) => brand.name);
      if (searchParams.get("Brands")) {
        setSearchParams((prev) => {
          prev.set("Brands", brandsFiltered?.join("%2C") || "");
          return prev;
        });
      } else {
        setSearchParams((prev) => {
          prev.append("Brands", brandsFiltered?.join("%2C") || "");
          return prev;
        });
      }
    } else {
      setSearchParams((prev) => {
        prev.delete("Brands");
        return prev;
      });
      dispatch(setProductParams({ brands: [] }));
      setSelectedBrands([]);
    }
    setIsStartFilter(true);
    setSearchParams((prev) => {
      prev.set("pageNumber", "1");
      return prev;
    });
  };
  const handleSelectColorChange = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: Color[]
  ) => {
    // set to url params
    if (newValue.length > 0) {
      const colorsFiltered = newValue?.map((color) => color.name);
      if (searchParams.get("Colors")) {
        setSearchParams((prev) => {
          prev.set("Colors", colorsFiltered?.join("%2C") || "");
          return prev;
        });
      } else {
        setSearchParams((prev) => {
          prev.append("Colors", colorsFiltered?.join("%2C") || "");
          return prev;
        });
      }
    } else {
      setSearchParams((prev) => {
        prev.delete("Colors");
        return prev;
      });
      dispatch(setProductParams({ colors: [] }));
      setSelectedColors([]);
    }
    setIsStartFilter(true);
    setSearchParams((prev) => {
      prev.set("pageNumber", "1");
      return prev;
    });
  };

  const handleSelectPageSize = (pageSize: number) => {
    setSearchParams((prev) => {
      prev.set("pageSize", pageSize.toString());
      return prev;
    });
    setSearchParams((prev) => {
      prev.set("pageNumber", "1");
      return prev;
    });
    setIsStartFilter(true);
  };
  // End of handle change filter
  const handleSearch = (value?: string) => {
    var searchQuery = "";
    if (value) {
      searchQuery = value.trim();
      setSearchQuery(searchQuery);
    }

    if (value === undefined) {
      searchQuery = debouncedSearchQuery.trim();
    }
    setSearchParams((prev) => {
      prev.set("Search", searchQuery.trim());
      return prev;
    });

    dispatch(setProductParams({ search: searchQuery }));

    if (!searchQuery) {
      setSearchParams((prev) => {
        prev.delete("Search");
        return prev;
      });
    }

    setSearchParams((prev) => {
      prev.set("pageNumber", "1");
      return prev;
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };
  // End of filter

  useEffect(() => {
    if (!productLoaded) {
      if (
        isStartFilter &&
        brands.length > 0 &&
        models.length > 0 &&
        types.length > 0 &&
        colors.length > 0
      ) {
        if (
          productParams.search ||
          (productParams.brands && productParams.brands.length > 0) ||
          (productParams.models && productParams.models.length > 0) ||
          (productParams.types && productParams.types.length > 0) ||
          (productParams.colors && productParams.colors.length > 0) ||
          productParams.pageSize
        ) {
          dispatch(getProductsAsync());
        }
      } else if (searchParams.size === 0 && products.length === 0) {
        dispatch(getProductsAsync());
      }
    }
  }, [dispatch, productParams, isStartFilter]);

  const handleSelectProduct = (actionName: string, product?: Product) => {
    setOpenEditForm((cur) => !cur);
    if (product) {
      setSelectedProduct(product);
    }
    setActionName(actionName);
  };

  async function handleDeleteProduct(productDeleted: Product) {
    await dispatch(deleteProductAsync(productDeleted.id));
  }

  const cancelEditForm = () => {
    setOpenEditForm((cur) => !cur);
    setSelectedProduct(null);
  };

  const handleOpenDetails = (product: Product) => {
    setSelectedProduct(product);
    setOpenDetails((cur) => !cur);
  };

  const openConfirmDeleteDiaglog = (product: Product) => {
    setConfirmDeleteDiaglog((cur) => !cur);
    setProductDeleted(product);
  };

  const cancelDetailsDialog = () => {
    setSelectedProduct(null);
    setOpenDetails((cur) => !cur);
  };

  const cancelConfirmDeleteDialog = () => setConfirmDeleteDiaglog(false);

  const handleLockVehicle = async (product: Product) => {
    // dispatch(updateIsLockProduct(product));
    // await dispatch(lockProductAsync(product.id));
  };

  if (!metaData) {
    return <Loader />;
  } else
    return (
      <>
        <Breadcrumb pageName="Products" />
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="flex justify-between">
            <div className="flex items-center ml-2 order-2 md:order-1">
              <label htmlFor="simple-search" className="sr-only">
                Search
              </label>
              <div className="w-full">
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[200px] p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search..."
                  value={searchQuery}
                  maxLength={30}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                  }}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <button
                onClick={() => handleSearch()}
                className="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
                <span className="sr-only">Search</span>
              </button>
            </div>
            <button
              onClick={() => handleSelectProduct("Add new Product")}
              type="button"
              className="flex order-1 ml-auto md:order-2 w-fit text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              <svg
                className="h-5 w-5 mr-2"
                viewBox="0 0 21.00 21.00"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                fill="#ffffff"
                stroke="#ffffff"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <g
                    id="Page-1"
                    strokeWidth="0.00021000000000000004"
                    fill="none"
                    fillRule="evenodd"
                  >
                    <g
                      id="Dribbble-Light-Preview"
                      transform="translate(-419.000000, -520.000000)"
                      fill="#ffffff"
                    >
                      <g
                        id="icons"
                        transform="translate(56.000000, 160.000000)"
                      >
                        <path
                          d="M374.55,369 L377.7,369 L377.7,371 L374.55,371 L374.55,374 L372.45,374 L372.45,371 L369.3,371 L369.3,369 L372.45,369 L372.45,366 L374.55,366 L374.55,369 Z M373.5,378 C368.86845,378 365.1,374.411 365.1,370 C365.1,365.589 368.86845,362 373.5,362 C378.13155,362 381.9,365.589 381.9,370 C381.9,374.411 378.13155,378 373.5,378 L373.5,378 Z M373.5,360 C367.70085,360 363,364.477 363,370 C363,375.523 367.70085,380 373.5,380 C379.29915,380 384,375.523 384,370 C384,364.477 379.29915,360 373.5,360 L373.5,360 Z"
                          id="plus_circle-[#ffffff]"
                        ></path>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
              <span>Add new product</span>
            </button>
          </div>
          <div className="flex overflow-auto scrollbar max-h-[333px] justify-center items-center">
            <div className="flex flex-wrap space-x-2 space-y-2 justify-start items-center mb-2 w-full">
              <div className="max-w-[25%] min-w-[170px] flex-1  ml-2 mt-2">
                {/* Filter by types */}
                {typeLoading ? (
                  <LoaderButton />
                ) : (
                  <Autocomplete
                    className="bg-white rounded-md"
                    fullWidth={true}
                    size="small"
                    multiple={true}
                    disablePortal
                    value={selectedTypes}
                    options={types}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) =>
                      handleSelectTypeChange(event, newValue)
                    }
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Type" />
                    )}
                  />
                )}
              </div>
              <div className="max-w-[25%] min-w-[170px] flex-1">
                {/* Filter by models */}
                {modelProductLoading ? (
                  <LoaderButton />
                ) : (
                  <Autocomplete
                    className="bg-white rounded-md"
                    fullWidth={true}
                    size="small"
                    multiple={true}
                    disablePortal
                    value={selectedModels}
                    options={models}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) =>
                      handleSelectModelChange(event, newValue)
                    }
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Models" />
                    )}
                  />
                )}
              </div>
              <div className="max-w-[25%] min-w-[170px] flex-1">
                {/* Filter by brands */}
                {brandLoading ? (
                  <LoaderButton />
                ) : (
                  <Autocomplete
                    className="bg-white rounded-md"
                    fullWidth={true}
                    size="small"
                    multiple={true}
                    disablePortal
                    value={selectedBrands}
                    options={brands}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) =>
                      handleSelectBrandChange(event, newValue)
                    }
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Brands" />
                    )}
                  />
                )}
              </div>
              <div className="max-w-[25%] min-w-[170px] flex-1">
                {/* Filter by colors */}
                {brandLoading ? (
                  <LoaderButton />
                ) : (
                  <Autocomplete
                    className="bg-white rounded-md"
                    fullWidth={true}
                    size="small"
                    multiple={true}
                    disablePortal
                    value={selectedColors}
                    options={colors}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) =>
                      handleSelectColorChange(event, newValue)
                    }
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Colors" />
                    )}
                  />
                )}
              </div>
              <div className="max-w-[25%] min-w-[170px] flex-1">
                {/* Filter by colors */}
                {colorLoading ? (
                  <LoaderButton />
                ) : (
                  <Autocomplete
                    className="bg-white rounded-md"
                    fullWidth={true}
                    size="small"
                    multiple={true}
                    disablePortal
                    value={selectedColors}
                    options={colors}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) =>
                      handleSelectColorChange(event, newValue)
                    }
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Color" />
                    )}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="max-w-full overflow-x-auto scrollbar">
            <table className="w-full table-auto">
              <thead>
                <tr className=" bg-gray-2 text-left dark:bg-meta-4  font-bold">
                  <th className="min-w-[200px] py-4 px-4 text-black dark:text-blue-gray-50">
                    Variant
                  </th>
                  <th className="min-w-[150px] py-4 px-4 text-black dark:text-blue-gray-50">
                    Brand
                  </th>
                  <th className="min-w-[150px] py-4 px-4 text-black dark:text-blue-gray-50">
                    Model
                  </th>
                  <th className="min-w-[120px] py-4 px-4 text-black dark:text-blue-gray-50">
                    Type
                  </th>
                  <th className="min-w-[120px] py-4 px-4 text-black dark:text-blue-gray-50">
                    Price
                  </th>
                  <th className="w-18 py-4 px-4 text-black dark:text-blue-gray-50">
                    Quantity
                  </th>
                  <th className="w-27 py-4 px-4 text-black dark:text-blue-gray-50">
                    Status
                  </th>
                  <th className="py-4 px-4">
                    <SelectPageSize
                      onSelectPageSize={handleSelectPageSize}
                      defaultValue={selectedPageSize}
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {productLoaded ? (
                  <tr>
                    <td colSpan={9}>
                      <div className="flex justify-center items-center w-full h-20">
                        <LoaderButton />
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan={9}>
                          <div className="flex justify-center items-center w-full h-20">
                            <p className="text-black dark:text-blue-gray-50">
                              No Items Found.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => (
                        <tr
                          key={product.id}
                          className="dark:border-strokedark border-[#eee] border-b"
                        >
                          <td className="py-5 px-4">
                            <div className="flex items-center h-full ">
                              <div className="h-12 w-12 rounded-md">
                                <img
                                  className="h-full w-full rounded-md object-cover"
                                  src={
                                    product.images.find((i) => i.isMain)
                                      ?.imageUrl! ?? undefined
                                  }
                                  alt="Product image"
                                />
                              </div>
                              <div className="ml-3 flex flex-1 flex-col">
                                <div className="flex">
                                  <h5 className="font-medium text-black dark:text-blue-gray-50  line-clamp-2">
                                    {product.variant}
                                  </h5>
                                  <a
                                    className="bg-blue-500 bg-opacity-20 rounded-full w-4 h-4 ml-1 hover:bg-opacity-50 p-[2px]"
                                    href={
                                      process.env
                                        .REACT_APP_MOTORMATE_CLIENT_BASE_URL +
                                      "/product-detail/" +
                                      product.id
                                    }
                                    target="_blank"
                                  >
                                    <svg
                                      className="w-full h-full "
                                      fill="#0683d0"
                                      viewBox="0 0 36 36"
                                      version="1.1"
                                      preserveAspectRatio="xMidYMid meet"
                                      xmlns="http://www.w3.org/2000/svg"
                                      xmlnsXlink="http://www.w3.org/1999/xlink"
                                      stroke="#009dff"
                                      strokeWidth="0.00036"
                                    >
                                      <g
                                        id="SVGRepo_bgCarrier"
                                        strokeWidth="0"
                                      ></g>
                                      <g
                                        id="SVGRepo_tracerCarrier"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        stroke="#CCCCCC"
                                        strokeWidth="0.36"
                                      ></g>
                                      <g id="SVGRepo_iconCarrier">
                                        <title>pop-out-line</title>
                                        <path
                                          className="clr-i-outline clr-i-outline-path-1"
                                          d="M27,33H5a2,2,0,0,1-2-2V9A2,2,0,0,1,5,7H15V9H5V31H27V21h2V31A2,2,0,0,1,27,33Z"
                                        ></path>
                                        <path
                                          className="clr-i-outline clr-i-outline-path-2"
                                          d="M18,3a1,1,0,0,0,0,2H29.59L15.74,18.85a1,1,0,1,0,1.41,1.41L31,6.41V18a1,1,0,0,0,2,0V3Z"
                                        ></path>
                                        <rect
                                          x="0"
                                          y="0"
                                          width="36"
                                          height="36"
                                          fillOpacity="0"
                                        ></rect>{" "}
                                      </g>
                                    </svg>
                                  </a>
                                </div>

                                <p className="text-sm font-medium">
                                  {product.color.name}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="py-5 px-4">
                            <p className="text-black dark:text-blue-gray-50 line-clamp-1">
                              {product.model.brand.name}
                            </p>
                          </td>

                          <td className="py-5 px-4">
                            <p className="text-black dark:text-blue-gray-50 line-clamp-1">
                              {product.model.name}
                            </p>
                          </td>

                          <td className="py-5 px-4">
                            <p className="text-black dark:text-blue-gray-50 line-clamp-1">
                              {product.type.name}
                            </p>
                          </td>

                          <td className="py-5 px-4">
                            <p className="text-meta-3 dark:text-blue-gray-50">
                              ${product.price.toLocaleString()}
                            </p>
                          </td>

                          <td className="py-5 px-4">
                            <p className="text-black dark:text-blue-gray-50">
                              {product.quantity}
                            </p>
                          </td>

                          <td className="px-4 py-5">
                            <div className="flex flex-col justify-center items-center">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="sr-only peer"
                                  checked={!product.isOnStock}
                                  onChange={() => handleLockVehicle(product)}
                                />
                                <div className="w-11 h-6 bg-success rounded-full dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-blue-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-blue-gray-600 peer-checked:bg-danger"></div>
                              </label>
                              <span
                                className={`mt-1 text-sm rounded-full px-[3px] font-semibold bg-opacity-10 text-black 
                                ${
                                  product.isOnStock
                                    ? "bg-success text-meta-3"
                                    : "bg-danger text-meta-1"
                                }`}
                              >
                                {product.isOnStock ? "On Stock" : "Disabled"}
                              </span>
                            </div>
                          </td>

                          <td className="py-5 px-4">
                            <div className="flex flex-col items-center justify-start space-y-2">
                              <div className="flex items-center justify-center space-x-2">
                                <button
                                  className="hover:text-primary"
                                  onClick={() => handleOpenDetails(product)}
                                >
                                  <svg
                                    className="fill-current"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 18 18"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                                      fill=""
                                    />
                                    <path
                                      d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                                      fill=""
                                    />
                                  </svg>
                                </button>
                                <button
                                  className="  hover:text-primary hover:bg-primary/30 rounded-full "
                                  onClick={() =>
                                    handleSelectProduct("Edit Product", product)
                                  }
                                >
                                  <svg
                                    className="fill-current"
                                    width="18px"
                                    height="18px"
                                    viewBox="0 -0.5 21 21"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    fill="none"
                                  >
                                    <g
                                      id="SVGRepo_bgCarrier"
                                      strokeWidth="0"
                                    ></g>
                                    <g
                                      id="SVGRepo_tracerCarrier"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    ></g>
                                    <g id="SVGRepo_iconCarrier">
                                      <defs> </defs>
                                      <g
                                        id="Page-1"
                                        fill="none"
                                        fillRule="evenodd"
                                      >
                                        <g
                                          id="Dribbble-Light-Preview"
                                          transform="translate(-339.000000, -360.000000)"
                                          fill="#000000"
                                        >
                                          <g
                                            id="icons"
                                            transform="translate(56.000000, 160.000000)"
                                          >
                                            <path
                                              d="M283,220 L303.616532,220 L303.616532,218.042095 L283,218.042095 L283,220 Z M290.215786,213.147332 L290.215786,210.51395 L296.094591,205.344102 L298.146966,207.493882 L292.903151,213.147332 L290.215786,213.147332 Z M299.244797,202.64513 L301.059052,204.363191 L299.645788,205.787567 L297.756283,203.993147 L299.244797,202.64513 Z M304,204.64513 L299.132437,200 L288.154133,209.687714 L288.154133,215.105237 L293.78657,215.105237 L304,204.64513 Z"
                                              className="fill-current"
                                            ></path>
                                          </g>
                                        </g>
                                      </g>
                                    </g>
                                  </svg>
                                </button>
                                <button
                                  className="hover:text-red-600 hover:bg-red-600/30 rounded-full p-1"
                                  onClick={() =>
                                    openConfirmDeleteDiaglog(product)
                                  }
                                >
                                  <svg
                                    className="fill-current"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 18 18"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                                      fill=""
                                    />
                                    <path
                                      d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                                      fill=""
                                    />
                                    <path
                                      d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                                      fill=""
                                    />
                                    <path
                                      d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                                      fill=""
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-center">
            <Pagination
              metaData={metaData}
              onPageChange={(page: number) => {
                setSearchParams((prev) => {
                  prev.set("pageNumber", page.toString());
                  return prev;
                });
              }}
              loading={productLoaded}
            />
          </div>
        </div>
        {openDetails && (
          <ProductDetails
            product={selectedProduct}
            onClose={cancelDetailsDialog}
          />
        )}
        {openEditForm && (
          <ProductForm
            product={selectedProduct}
            cancelEdit={cancelEditForm}
            actionName={actionName}
          />
        )}

        {confirmDeleteDiaglog && (
          <ConfirmDeleteDialog
            objectName={
              productDeleted.model.brand.name +
              " " +
              productDeleted.model.name +
              " " +
              productDeleted.variant
            }
            actionDelete={() => handleDeleteProduct(productDeleted)}
            cancelDelete={cancelConfirmDeleteDialog}
          />
        )}
      </>
    );
}
