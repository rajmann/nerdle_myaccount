import React from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import PasswordStrengthBar from "react-password-strength-bar";
import { useParams, useNavigate } from "react-router-dom";
import * as yup from "yup";

import { useResetPassword } from "../../api/resetPassword";
import Button from "../../components/Button";
import PasswordInput from "../../components/PasswordInput";
import Spinner from "../../components/Spinner";

const schema = yup
  .object({
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(16, "Password must be at most 16 characters")
      .required("Password is required"),
    passwordScore: yup
      .number()
      .min(2, "Password is too weak")
      .required("Password is too weak"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Password must match"),
  })
  .required();

const ResetPasswordForm = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
  } = useForm({ resolver: yupResolver(schema) });

  const navigate = useNavigate();
  const { token } = useParams();
  const { isLoading, execute } = useResetPassword();

  const onSubmit = React.useCallback(
    async ({ password }) => {
      try {
        await execute({ password }, token);
        toast.success("Password has been reset successfully!");
        navigate("/sign-in");
      } catch (error) {
        toast.error(error.message);
      }
    },
    [execute, token, navigate]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-9">
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-xs text-gray-400">
          Password
        </label>
        <PasswordInput {...register("password")} />
        <PasswordStrengthBar
          password={watch("password")}
          scoreWords={["Very Weak", "Weak", "Average", "Strong", "Very Strong"]}
          shortScoreWord="Too Short"
          onChangeScore={(score) => setValue("passwordScore", score)}
          minLength={8}
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
        <PasswordInput {...register("confirmPassword")} />
        {errors.confirmPassword && (
          <span className="text-sm text-red-400">
            {errors.confirmPassword.message}
          </span>
        )}
      </div>
      {isLoading ? (
        <Button
          type="submit"
          className="mt-8 w-full focus-visible:ring-offset-white"
          disabled>
          <Spinner />
          Resetting password...
        </Button>
      ) : (
        <Button
          type="submit"
          className="mt-8 w-full focus-visible:ring-offset-white">
          <span className="font-semibold text-white">Reset password</span>
        </Button>
      )}
    </form>
  );
};

export default ResetPasswordForm;
