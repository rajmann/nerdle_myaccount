import React from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import * as yup from "yup";

import { useSignIn } from "../../api/signIn";
import Button from "../../components/Button";
import PasswordInput from "../../components/PasswordInput";
import Spinner from "../../components/Spinner";
import useAuth from "../../hooks/useAuth";

const schema = yup
  .object({
    email: yup
      .string()
      .email("Email must be a valid email")
      .lowercase()
      .required("Email is required"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(32, "Password must be at most 32 characters")
      .required("Password is required"),
  })
  .required();

const SignInForm = () => {
  const auth = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: localStorage.getItem("email") }
  });

  const { isLoading, execute } = useSignIn();

  const onSubmit = React.useCallback(
    async (data) => {
      try {
        const {
          data: { token },
        } = await execute(data);
        localStorage.setItem("token", token);
        localStorage.setItem("email", data.email)
        auth.signIn();
      } catch (error) {
        toast.error(error.message);
      }
    },
    [auth, execute]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-12 flex flex-col">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-400">Email</label>
        <input
          {...register("email")}
          className="rounded-lg border-gray-200 py-5 px-6 bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600"
          type="email"
          id="input-email"
        />
        {errors.email && (
          <span className="text-sm text-red-400">{errors.email?.message}</span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label className="mt-4 text-xs text-gray-400">Password</label>
        <PasswordInput {...register("password")} />
        {errors.password && (
          <span className="text-sm text-red-400">
            {errors.password?.message}
          </span>
        )}
      </div>
      <Link
        to="../forgot-password"
        className="mt-2 self-end text-xs font-medium text-black dark:text-white hover:underline"
      >
        Forgot Password?
      </Link>
      <div className="mt-7 flex flex-col">
        {isLoading ? (
          <Button type="submit" disabled>
            <Spinner />
            Signing in...
          </Button>
        ) : (
          <Button type="submit" className="focus-visible:ring-offset-white">
            <span className="font-semibold">Sign in</span>
          </Button>
        )}
      </div>
    </form>
  );
};

export default SignInForm;
