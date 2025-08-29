import React from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { MdEdit } from "react-icons/md";
import * as yup from "yup";

import { useUpdateName } from "../../api/updateName";
import Spinner from "../../components/Spinner";
import TextButton from "../../components/TextButton";

const schema = yup
  .object({
    name: yup
      .string()
      .min(4, "Name must be at least 4 characters")
      .max(32, "Name must be at most 32 characters")
      .required("Name is required"),
  })
  .required();

const Name = ({isVerified, name, isValidating, mutate }) => {
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

  const { execute } = useUpdateName();

  const onSubmit = React.useCallback(
    async (data) => {
      try {
        setIsLoading(true);
        await execute(data);
        mutate();
        toast.success("Updated name");
      } catch (e) {
        toast.error("Cannot update name");
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

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name },
  });

  if (isEditing) {
    return (
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
          <input {...register("name")} type="text" className="rounded-lg" style={{maxWidth: 170}}/>
          <TextButton type="submit">Save</TextButton>
        </form>
        {errors.name && (
          <span className="mt-2 text-sm text-red-400">
            {errors.name.message}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      {isLoading ? (
        <div className="flex justify-center">
          <Spinner />
        </div>
      ) : (
        <p className="font-semibold text-black dark:text-white">{name}</p>
      )}
      <button
        onClick={onEdit}
        className={`${(!isVerified) ? 'text-gray-400': 'text-violet-400 hover:text-violet-500'}`}
      >
        <MdEdit className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Name;
