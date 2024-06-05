import {
  Dialog,
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import { Product } from "../../app/models/Product";
import { LoadingButton } from "@mui/lab";
import { ConvertToDateStr } from "../../app/utils/ConvertDatetimeToDate";
import { SlideshowLightbox } from "lightbox.js-react";
import "lightbox.js-react/dist/index.css";
import { useEffect, useState } from "react";

interface Props {
  product: Product | null;
  onClose: () => void;
}

export default function ProductDetails({ product, onClose }: Props) {
  const [openImage, setOpenImage] = useState<number>();
  const [openSlideShow, setOpenSlideShow] = useState(false);

  useEffect(() => {
    if (openImage || openImage === 0) {
      setOpenSlideShow(true);
    }
  }, [openImage]);

  return (
    <>
      <Dialog
        size="md"
        open={true}
        handler={onClose}
        className="bg-transparent shadow-none w-fit"
      >
        <Card className="mx-auto ">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-1 top-1 rounded-md bg-blue-gray-50 flex text-gray-500 hover:text-gray-800 hover:bg-blue-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
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
          <CardHeader className=" mx-auto text-center w-fit px-10 bg-orange-500">
            <Typography
              variant="h3"
              className="text-center py-4 text-white rounded-sm "
            >
              Product Detail
            </Typography>
          </CardHeader>
          <CardBody className=" max-h-[35rem] lg:max-h-[40rem] overflow-auto scrollbar p-0">
            <section className="flex items-center bg-gray-100 ">
              <div className="justify-center flex-1 max-w-6xl px-8 py-4 mx-auto">
                <div>
                  <div className="flex border-b border-gray-200   items-stretch justify-start w-full h-full px-4 mb-8 md:flex-row xl:flex-col md:space-x-6 lg:space-x-8 xl:space-x-0">
                    <div className="flex items-start justify-start flex-shrink-0">
                      <div className="flex items-center justify-center w-full pb-6 space-x-4 flex-wrap gap-1">
                        {product?.images.map((image, index) => (
                          <img
                            key={index}
                            src={image.imageUrl || undefined}
                            className="object-cover w-30 h-30 rounded-md inline-block relative object-center shadow-lg shadow-blue-gray-500/40 cursor-pointer hover:brightness-75"
                            alt="Product image"
                            onClick={() => setOpenImage(index)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="px-4 mb-4">
                    <div className="flex flex-col items-stretch justify-center w-full space-y-4 md:flex-row md:space-y-0 md:space-x-8">
                      <div className="flex flex-col w-full text-left space-y-2">
                        <h2 className="mb-2 text-xl font-bold text-black md:text-left ">
                          Product details
                        </h2>
                        <div className="flex flex-col items-start justify-center w-full pb-4 space-y-4 border-b border-gray-200 md:border-0">
                          <div className="flex justify-center items-center">
                            <p className="text-sm leading-5 text-black font-bold">
                              Type:
                            </p>
                            <p className="ml-1 text-base leading-4 text-black break-all">
                              {product?.type.name}
                            </p>
                          </div>
                          <div className="flex justify-center items-center">
                            <p className="text-sm leading-5 text-black font-bold">
                              Brand:
                            </p>
                            <p className="ml-1 text-base leading-4 text-black break-all">
                              {product?.model.brand.name}
                            </p>
                          </div>

                          <div className="flex justify-center items-center">
                            <p className="text-sm leading-5 text-black font-bold">
                              Model:
                            </p>
                            <p className="ml-1 text-base leading-4 text-black break-all">
                              {product?.model.name}
                            </p>
                          </div>
                          <div className="flex justify-center items-center">
                            <p className="text-sm leading-5 text-black font-bold">
                              Variant:
                            </p>
                            <p className="ml-1 text-base leading-4 text-black break-all">
                              {product?.variant}
                            </p>
                          </div>
                          <div className="flex justify-center items-center">
                            <p className="text-sm leading-5 text-black font-bold">
                              Color:
                            </p>
                            <p className="ml-1 text-base leading-4 text-black break-all">
                              {product?.color.name}
                            </p>
                          </div>
                          <div className="flex justify-center items-center">
                            <p className="text-sm leading-5 text-black font-bold">
                              Year:
                            </p>
                            <p className="ml-1 text-base leading-4 text-black break-all">
                              {product?.model.year}
                            </p>
                          </div>
                          <div className="flex justify-center items-center">
                            <p className="text-sm leading-5 text-black font-bold ">
                              Price:
                            </p>
                            <p className="ml-1 text-base leading-4 break-all text-meta-3">
                              ${product?.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col w-full text-left space-y-4">
                        <div className="space-y-2">
                          <h2 className="mb-2 text-xl font-bold text-black ">
                            Specific information
                          </h2>
                          <div className="flex flex-col items-start justify-center w-full pb-4 space-y-4 border-b border-gray-200 ">
                            <div className="flex justify-center items-center">
                              <p className="text-sm leading-5 text-black font-bold">
                                Total Review:
                              </p>
                              <p className="ml-1 text-base leading-4 text-black break-all">
                                {product?.totalReviews.toLocaleString()}
                              </p>
                            </div>

                            <div className="flex justify-center items-center">
                              <p className="text-sm leading-5 text-black font-bold">
                                Rating:
                              </p>
                              <p className="ml-1 text-base leading-4 text-black break-all">
                                {product?.rating}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h2 className="mb-2 text-xl font-bold text-black ">
                            Overseeing
                          </h2>
                          <div className="flex flex-col items-start justify-center w-full pb-4 space-y-4">
                            <div className="flex justify-center items-center">
                              <p className="text-sm leading-5 text-black font-bold">
                                Created at:
                              </p>
                              <p className="ml-1 text-base leading-4 text-black break-all">
                                {ConvertToDateStr(product?.createdAt!)}
                              </p>
                            </div>

                            <div className="flex justify-center items-center">
                              <p className="text-sm leading-5 text-black font-bold">
                                Last updated:
                              </p>
                              <p className="ml-1 text-base leading-4 text-black break-all">
                                {ConvertToDateStr(product?.lastUpdated!)}
                              </p>
                            </div>

                            <div className="w-1/2 justify-start flex items-center min-w-fit">
                              <p className="text-sm leading-5 text-black font-bold">
                                Status:
                              </p>
                              <p
                                className={`ml-1 text-sm leading-4 break-all inline-flex rounded-full bg-opacity-10  py-1 px-2 font-bold  ${
                                  product?.isOnStock
                                    ? "text-meta-3 bg-success"
                                    : "bg-danger text-danger"
                                }`}
                              >
                                {product?.isOnStock ? "On Stock" : "Disabled"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <SlideshowLightbox
                      startingSlideIndex={openImage}
                      className="container grid grid-cols-3 gap-2 mx-auto"
                      showThumbnails={true}
                      open={openSlideShow}
                      onClose={() => {
                        setOpenImage(undefined);
                        setOpenSlideShow(false);
                      }}
                    >
                      {product?.images.map((image, index) => (
                        <img
                          className="w-full rounded hidden"
                          src={image.imageUrl || undefined}
                          key={index}
                        />
                      ))}
                    </SlideshowLightbox>
                  </div>
                </div>
              </div>
            </section>
            <div className=" text-center pb-4">
              <Button
                variant="gradient"
                color="red"
                size="lg"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </CardBody>
        </Card>
      </Dialog>
    </>
  );
}
