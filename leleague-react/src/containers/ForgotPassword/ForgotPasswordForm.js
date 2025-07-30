import React from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from "yup";

import { useForgotPassword } from "../../api/forgotPassword";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";

const schema = yup
  .object({
    email: yup
      .string()
      .email("Email must be a valid email")
      .required("Email is required"),
  })
  .required();

const ForgotPasswordForm = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ resolver: yupResolver(schema) });

  const { isLoading, execute } = useForgotPassword();

  const onSubmit = React.useCallback(
    async (data) => {
      try {
        await execute(data);
        toast.success(
          "An email has been sent to you with a link to reset your password"
        );
      } catch (error) {
        toast.error(error.message);
      }
    },
    [execute]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-9 flex flex-col">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-400">Email</label>
        <input
          {...register("email")}
          className="rounded-lg border-gray-200 py-5 px-6"
          type="email"
        />
        {errors.email && (
          <span className="text-sm text-red-400">{errors.email?.message}</span>
        )}
      </div>
      <div className="mt-4 flex flex-col">
        {isLoading ? (
          <Button type="submit" disabled>
            <Spinner />
            Sending email...
          </Button>
        ) : (
          <Button type="submit" className="focus-visible:ring-offset-white">
            <span className="font-semibold">Send Email</span>
          </Button>
        )}
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
