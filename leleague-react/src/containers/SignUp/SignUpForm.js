import React, { useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import PasswordStrengthBar from "react-password-strength-bar";
import * as yup from "yup";

import { useSignIn } from "../../api/signIn";
import { useSignUp } from "../../api/signUp";
import Button from "../../components/Button";
import Checkbox from "../../components/Checkbox";
import PasswordInput from "../../components/PasswordInput";
import Spinner from "../../components/Spinner";
import useAuth from "../../hooks/useAuth";

const schema = yup
  .object({
    name: yup
      .string()
      .min(4, "Name must be at least 4 characters")
      .max(32, "Name must be at most 32 characters")
      .required("Name is required"),
    email: yup
      .string()
      .email("Email must be a valid email")
      .lowercase("Email must be lowercase")
      .strict()
      .required("Email is required"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(32, "Password must be at most 32 characters")
      .required("Password is required"),
    passwordScore: yup
      .number()
      .min(2, "Password is too weak")
      .required("Password is too weak"),
    termsOfService: yup
      .boolean()
      .required("The terms and conditions must be accepted.")
      .oneOf([true], "The terms and conditions must be accepted."),
  })
  .required();

const SignUpForm = () => {
  // Old
  const auth = useAuth();
  const [confirmation, setConfirmation] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const signUp = useSignUp();
  // Old
  const signIn = useSignIn();

  // Old signIn.isLoading
  const isLoading = React.useMemo(() => {
    return signUp.isLoading || signIn.isLoading;
  }, [signUp.isLoading, signIn.isLoading]);

  const onSubmit = React.useCallback(
    async (data) => {
      const { email, password, name } = data;

      const payload = {
        email: email.toLowerCase(),
        password,
        fullname: name,
      };

      try {
        await signUp.execute(payload);
        // Old
        const {
          data: { token },
        } = await signIn.execute({ email, password });
        localStorage.setItem("token", token);
        auth.signIn();
        // toast.success("An email has been sent to you to confirm your account.", { duration: 3000 });
      } catch (error) {
        toast.error(error.message);
      }
    },
    [signUp, signIn, auth]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-12 flex flex-col">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-400">Name</label>
        <input
          {...register("name")}
          type="text"
          className="rounded-lg border-gray-200 py-5 px-6"
          id="input-name"
        />
        {errors.name && (
          <span className="text-sm text-red-400">{errors.name?.message}</span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label className="mt-4 text-xs text-gray-400">Email</label>
        <input
          {...register("email")}
          type="email"
          className="rounded-lg border-gray-200 py-5 px-6"
        />
        {errors.email && (
          <span className="text-sm text-red-400">{errors.email?.message}</span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label className="mt-4 text-xs text-gray-400">Password</label>
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
            {errors.password?.message}
          </span>
        )}
        <span className="inline-flex items-center text-sm">
          <Checkbox
            {...register("termsOfService")}
            onClick={() => setConfirmation(!confirmation)}
          />
          <p className="font-small ml-2">
            I agree to the{" "}
            <span>
              <a
                className="text-blue-400"
                target="_blank"
                href="https://www.leaderboardle.com/tandcs.html?external=true"
                rel="noreferrer">
                Terms & Conditions
              </a>
            </span>{" "}
            and{" "}
            <span>
              <a
                className="text-blue-400"
                target="_blank"
                href="https://www.leaderboardle.com/tandcs.html?external=true"
                rel="noreferrer">
                Privacy Policy
              </a>
            </span>
          </p>
        </span>
        {(errors.termsOfService || errors.termsOfServiceScore) && (
          <span className="text-sm text-red-400">
            {errors.termsOfService?.message || errors.termsOfService?.message}
          </span>
        )}
      </div>
      <div className="mt-7 flex flex-col">
        {isLoading ? (
          <Button type="submit" disabled>
            <Spinner />
            Creating account...
          </Button>
        ) : (
          <Button type="submit" className="focus-visible:ring-offset-white">
            <span className="font-semibold">Create account</span>
          </Button>
        )}
      </div>
    </form>
  );
};

export default SignUpForm;
