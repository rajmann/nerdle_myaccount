import React from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

import { useUpdatePassword } from "../../api/updatePassword";
import Button from "../../components/Button";

const schema = yup
  .object({
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(16, "Password must be at most 16 characters")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Password must match"),
  })
  .required();

const ChangePasswordForm = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ resolver: yupResolver(schema) });

  const navigate = useNavigate();

  const { execute } = useUpdatePassword();

  const onSubmit = React.useCallback(
    async (data) => {
      try {
        const payload = {
          password: data.password,
          confirmpassword: data.confirmPassword,
        };
        await execute(payload);
        navigate("success");
      } catch (e) {
        toast.error("Cannot change password");
      }
    },
    [execute, navigate]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-9">
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-xs text-gray-400">
          Password
        </label>
        <input
          {...register("password")}
          type="password"
          id="password"
          className="rounded-lg border-gray-200 py-5 px-6"
        />
        {errors.password && (
          <span className="text-sm text-red-400">
            {errors.password.message}
          </span>
        )}
      </div>
      <div className="mt-4 flex flex-col gap-1">
        <label htmlFor="confirmPassword" className="text-xs text-gray-400">
          Confirm Password
        </label>
        <input
          {...register("confirmPassword")}
          type="password"
          id="confirmPassword"
          className="rounded-lg border-gray-200 py-5 px-6"
        />
        {errors.confirmPassword && (
          <span className="text-sm text-red-400">
            {errors.confirmPassword.message}
          </span>
        )}
      </div>
      <Button
        type="submit"
        className="mt-8 w-full focus-visible:ring-offset-white"
      >
        <span className="font-semibold text-white">Reset password</span>
      </Button>
    </form>
  );
};

export default ChangePasswordForm;
