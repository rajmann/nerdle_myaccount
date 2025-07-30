import React from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { MdEdit } from "react-icons/md";
import * as yup from "yup";

import { useProfile } from "../../api/profile";
import { useSendEmail } from "../../api/sendEmailVerification";
import { useUpdateEmail } from "../../api/updateEmail";
import Spinner from "../../components/Spinner";
import TextButton from "../../components/TextButton";

const schema = yup
  .object({
    email: yup
      .string()
      .email("Email must be a valid email")
      .lowercase("Email must be lowercase")
      .strict()
      .required("Email is required"),
  })
  .required();

const Email = ({isVerified,  email, isValidating, mutate }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const onEdit = React.useCallback(() => {
    if(!isVerified)
    {
      toast.error("Please verify your email first!");
      return;
    }
    setIsEditing(true);
  }, [isVerified]);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email },
  });

  const { data: profile } = useProfile();

  const { execute } = useUpdateEmail();
  const { execute: sendEmail } = useSendEmail();

  const onSendEmail = React.useCallback(async () => {
    try {
      setIsLoading(true);
      await sendEmail({ email });
      toast.success("Email sent");
    } catch (e) {
      toast.error("Cannot send email");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }, [sendEmail, email]);

  const onSubmit = React.useCallback(
    async (data) => {
      try {
        setIsLoading(true);
        await execute(data);
        mutate();
        toast.success("Updated email");
      } catch (e) {
        toast.error("Cannot update email");
        setIsLoading(false);
      } finally {
        setIsEditing(false);
      }
    },
    [execute, mutate]
  );

  React.useEffect(() => {
    if (!isValidating) {
      setIsLoading(false);
    }
  }, [isValidating]);

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-white">Email Address</div>
          <TextButton type="submit">Save</TextButton>
        </div>
        <input {...register("email")} type="email" className="rounded-lg" />
        {errors.email && (
          <span className="ml-2 text-sm text-red-400">
            {errors.email.message}
          </span>
        )}
      </form>
    );
  }

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-white">Email Address</div>
        <button
          onClick={onEdit}
          className={`${(!isVerified) ? 'text-gray-400': 'text-violet-400 hover:text-violet-500'}`}>
          <MdEdit className="h-4 w-4" />
        </button>
      </div>
      {isLoading ? (
        <div className="mt-2 flex justify-center">
          <Spinner />
        </div>
      ) : (
        <p className="mt-2 text-sm text-white">{email}</p>
      )}
      {profile.isVerified === false && (
        <p className="mt-2 text-xs text-white">
          <span>Your email is unverified. </span>
          <button
            onClick={onSendEmail}
            className="text-left text-xs text-violet-400 underline hover:text-violet-500">
            Resend verification email.
          </button>
        </p>
      )}
    </div>
  );
};

export default Email;
