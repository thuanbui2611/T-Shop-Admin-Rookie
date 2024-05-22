import {
  Button,
  Dialog,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import { ModelProduct } from "../../app/models/ModelProduct";
import { useForm, FieldValues } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../app/store/ConfigureStore";
import AppTextInput from "../../app/components/AppTextInput";
import { useEffect, useState } from "react";
import {
  addModelProductAsync,
  updateModelProductAsync,
} from "./ModelProductSlice";
import { toast } from "react-toastify";
import { Autocomplete, LoadingButton } from "@mui/lab";
import { getBrandsAsync } from "../filter/FilterSlice";
import { Brand } from "../../app/models/Brand";
import LoaderButton from "../../app/components/LoaderButton";
interface Props {
  modelProduct: ModelProduct | null;
  cancelEdit: () => void;
  actionName: string;
}

export default function ModelProductForm({
  modelProduct,
  cancelEdit,
  actionName,
}: Props) {
  const {
    control,
    reset,
    handleSubmit,
    register,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    mode: "all",
  });

  const { brands, brandLoading } = useAppSelector((state) => state.filter);
  const [defaultBrand, setDefaultBrand] = useState<Brand | null>(null);

  //Get all brands
  useEffect(() => {
    if (brands.length === 0 && !brandLoading) {
      dispatch(getBrandsAsync());
    }
  }, []);

  useEffect(() => {
    if (modelProduct) {
      reset(modelProduct);

      const defaultBrand = brands.find(
        (brand) => brand.id === modelProduct.brand.id
      );
      setDefaultBrand(defaultBrand || null);
      setValue("brandId", modelProduct.brand.id);
    }
  }, [modelProduct, reset]);

  const dispatch = useAppDispatch();

  async function submitForm(data: FieldValues) {
    try {
      const formData = {
        id: modelProduct?.id,
        name: data.name,
        year: data.year,
        brandId: data.brandId,
      };

      if (modelProduct) {
        await dispatch(updateModelProductAsync(formData));
      } else {
        await dispatch(addModelProductAsync(formData));
      }
      cancelEdit();
    } catch (error: any) {
      toast.error("Error: " + error.message);
    }
  }

  const onClose = () => {
    cancelEdit();
  };
  return (
    <>
      <Dialog
        size="xs"
        open={true}
        handler={cancelEdit}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardHeader className="text-center">
            <Typography
              variant="h3"
              className="text-center py-4 bg-orange-500 text-white rounded-sm dark:bg-boxdark dark:text-blue-gray-50"
            >
              {actionName}
            </Typography>
          </CardHeader>
          <form onSubmit={handleSubmit(submitForm)}>
            <CardBody className="flex flex-col gap-4 overflow-y-auto max-h-[600px]">
              <AppTextInput
                control={control}
                label="Model name"
                {...register("name", {
                  required: "Model name is required",
                  pattern: {
                    value: /^[a-zA-Z\s]+$/,
                    message: "Invalid model name",
                  },
                })}
              />
              <AppTextInput
                control={control}
                label="Year"
                {...register("year", {
                  required: "Model year is required",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Invalid model year, accept only number",
                  },
                })}
              />
              {brandLoading ? (
                <LoaderButton />
              ) : (
                <Autocomplete
                  disablePortal
                  value={defaultBrand}
                  options={brands}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, newValue) => {
                    const brandId = newValue?.id;
                    setValue("brandId", brandId, { shouldValidate: true });
                    setDefaultBrand(newValue);
                  }}
                  renderInput={(params) => (
                    <AppTextInput
                      {...params}
                      control={control}
                      label="Brand"
                      {...register("brandId", {
                        required: "Brand is required",
                      })}
                      error={!!errors.brandId}
                      helperText={errors?.brandId?.message as string}
                    />
                  )}
                />
              )}
            </CardBody>
            <CardFooter className="pt-0 flex flex-row justify-between gap-10">
              <LoadingButton
                className="bg-gradient-to-tr from-light-blue-600 to-light-blue-400 text-white shadow-md shadow-light-blue-500/20 hover:shadow-lg hover:shadow-light-blue-500/40 active:opacity-[0.85]"
                loading={isSubmitting}
                type="submit"
                variant="contained"
                color="success"
              >
                <span className="font-bold">Confirm</span>
              </LoadingButton>
              <Button
                variant="gradient"
                color="red"
                size="lg"
                onClick={onClose}
              >
                Cancel
              </Button>
            </CardFooter>
          </form>
        </Card>
      </Dialog>
    </>
  );
}
