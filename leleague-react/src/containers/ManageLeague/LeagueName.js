import React from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { MdEdit } from "react-icons/md";
import { useParams } from "react-router-dom";
import * as yup from "yup";

import { useUpdateLeague } from "../../api/updateLeague";
import Spinner from "../../components/Spinner";
import TextButton from "../../components/TextButton";

const schema = yup
  .object({
    name: yup
      .string()
      .min(4, "League Name must be at least 4 characters")
      .max(32, "League Name must be at most 32 characters")
      .required("League Name is required"),
  })
  .required();

const LeagueName = ({ name, games, scoringSystem, mutate, isValidating }) => {
  const [isEditing, setIsEditing] = React.useState(false);

  const editName = React.useCallback(() => {
    setIsEditing(true);
  }, []);

  const params = useParams();

  const { execute } = useUpdateLeague();

  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = React.useCallback(
    async (data) => {
      const payload = {
        leagueId: params.leagueId,
        body: {
          title: data.name,
          games,
          scoringSystem,
        },
      };

      try {
        setIsLoading(true);
        await execute(payload);
        mutate();
        toast.success("Updated league name");
      } catch (e) {
        toast.error("Cannot update league name");
        setIsLoading(false);
      }

      setIsEditing(false);
    },
    [execute, games, mutate, params.leagueId, scoringSystem]
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

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-center justify-between">
        {isEditing ? (
          <input {...register("name")} type="text" className="rounded-lg" />
        ) : (
          <h1 className="text-xl font-semibold text-white">{name}</h1>
        )}
        {isEditing ? (
          <TextButton type="submit">Save</TextButton>
        ) : (
          <button
            onClick={editName}
            className="text-violet-400 hover:text-violet-500"
          >
            <MdEdit className="h-4 w-4" />
          </button>
        )}
      </div>
      {errors.name && (
        <span className="mt-1 text-sm text-red-400">{errors.name.message}</span>
      )}
    </form>
  );
};

export default LeagueName;
