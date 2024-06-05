import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import AppTextInput from "./AppTextInput";
import { toast } from "react-toastify";
import { TextField } from "@mui/material";
import { TransactionStatus } from "../utils/TransactionHelpers";

interface Props {
  actionName: "Approve" | "Complete" | "Deny";
  action: (reason?: string) => Promise<void>;
  onClose: () => void;
}
export default function ConfirmChangeStatusDialog({
  actionName,
  onClose,
  action,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reason, setReason] = useState("");

  const validateReason = (reason: string) => {
    const regex =
      /^(?!.*[<>])(?!.*<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>)(?!.*\b(xss|XSS)\b).*$/i;
    return regex.test(reason);
  };

  const onAction = async () => {
    setIsSubmitting(true);
    debugger;
    if (actionName == "Deny") {
      if (validateReason(reason)) {
        await action(reason);
      } else {
        toast.error("Invalid reason");
        return;
      }
    } else {
      await action();
    }

    onClose();
    setIsSubmitting(false);
  };
  return (
    <>
      <Dialog open={true} handler={onClose}>
        <DialogHeader
          className={`text-3xl ${
            actionName == "Deny"
              ? "text-red-600"
              : actionName == "Approve"
              ? "text-blue-600"
              : "text-green-600"
          }`}
        >
          Confirm {actionName}
        </DialogHeader>
        <DialogBody divider>
          <p className=" text-xl font-bold text-red-600 mb-3">
            You should read this carefully!
          </p>
          <p className=" text-base font-medium text-black-2">
            Are you sure you want to{" "}
            <span
              className={`font-bold
                ${
                  actionName == "Approve"
                    ? "text-blue-600"
                    : actionName == "Deny"
                    ? "text-red-600"
                    : "text-green-600"
                }`}
            >
              {actionName}
            </span>{" "}
            this transaction?
          </p>
          {actionName == "Deny" && (
            <>
              <div className="flex gap-4 mt-4 mr-2">
                <p className="text-base font-bold text-black-2">Reason:</p>
                <TextField
                  className="grow"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  multiline
                  rows={2}
                  maxRows={5}
                  placeholder="The products was not in good condition..."
                  sx={{
                    "& .MuiOutlinedInput-input": {
                      boxShadow: "none",
                      fontSize: "14px",
                    },
                    "& .MuiInputBase-root": {
                      padding: 1,
                      fontSize: "14px",
                    },
                  }}
                />
              </div>
            </>
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={onClose} className="mr-1">
            <span>Cancel</span>
          </Button>
          <LoadingButton
            size="large"
            className="transition-all rounded-lg bg-gradient-to-tr from-green-600 to-green-400 shadow-md shadow-green-500/20 hover:shadow-lg hover:shadow-green-500/40 active:opacity-[0.85]"
            loading={isSubmitting}
            onClick={() => onAction()}
            variant="contained"
          >
            <span
              className={`font-bold text-xs ${
                isSubmitting ? "text-transparent" : "text-white"
              }`}
            >
              Confirm
            </span>
          </LoadingButton>
        </DialogFooter>
      </Dialog>
    </>
  );
}
