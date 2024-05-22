import {
  Button,
  Dialog,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import { Type } from "../../app/models/Type";
import { useForm, FieldValues } from "react-hook-form";
import { useAppDispatch } from "../../app/store/ConfigureStore";
import AppTextInput from "../../app/components/AppTextInput";
import { useEffect } from "react";
import { addTypeAsync, updateTypeAsync } from "./TypeSlice";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
interface Props {
  type: Type | null;
  cancelEdit: () => void;
  actionName: string;
}

export default function TypeForm({ type, cancelEdit, actionName }: Props) {
  const {
    control,
    reset,
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm({
    mode: "all",
  });

  useEffect(() => {
    if (type) reset(type);
  }, [type, reset]);

  const dispatch = useAppDispatch();

  async function submitForm(data: FieldValues) {
    try {
      const formData = {
        id: type?.id,
        name: data.name,
      };

      if (type) {
        await dispatch(updateTypeAsync(formData));
      } else {
        await dispatch(addTypeAsync(formData));
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
                label="Type name"
                {...register("name", {
                  required: "Type name is required",
                  pattern: {
                    value: /^[a-zA-Z\s]+$/,
                    message: "Invalid type name",
                  },
                })}
              />
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
