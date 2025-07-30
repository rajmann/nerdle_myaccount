import React, { useEffect } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

import { useJoinLeague } from "../../api/joinLeague";
import BaseDialog from "../../components/BaseDialog";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";
import useRefreshUserLeagues from "../../hooks/useRefreshUserLeagues";

const schema = yup
  .object({
    code: yup.string().required("League Code is required"),
  })
  .required();

const JoinLeagueDialog = ({ open, onClose, onSubmit, code, mutate }) => {
  const navigate = useNavigate();
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: { code },
  });
  const refreshUserLeagues = useRefreshUserLeagues();
  const {
    register,
    formState: { errors },
    reset,
  } = form;

  useEffect(() => {
    reset({ code });
  }, [reset, code]);

  const { execute, isLoading } = useJoinLeague();

  const handleSubmit = React.useCallback(
    async (data) => {
      try {
        const payload = { inviteCode: data.code };
        await execute(payload);
        refreshUserLeagues.refresh();
        toast.success("Joined league");
        navigate("../my-leagues");
      } catch (e) {
        toast.error("League already joined");
      } finally {
        form.reset();
        onSubmit();
      }
    },
    [execute, navigate, form, onSubmit, refreshUserLeagues]
  );

  return (
    <BaseDialog open={open} closeDialog={onClose} className="z-21">
      <div className="flex items-center justify-end">
        <button
          className="rounded-full p-2 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
          onClick={onClose}
        >
          <MdClose className="h-5 w-5" />
        </button>
      </div>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-7 flex flex-1 flex-col"
      >
        <h1 className="text-xl font-semibold text-black">Join League</h1>
        <label className="mt-2 flex flex-col text-sm font-semibold text-black">
          Enter League Code
          <input
            {...register("code")}
            type="text"
            disabled={code}
            placeholder="Type 8 digit league code here"
            className="mt-2 rounded-lg border-gray-200 p-5 text-sm text-black"
          />
        </label>
        {errors.code && (
          <span className="mt-2 text-sm text-red-400">
            {errors.code.message}
          </span>
        )}
        {isLoading ? (
          <Button className="mt-5 focus-visible:ring-offset-dialog" disabled>
            <Spinner />
            Joining league...
          </Button>
        ) : (
          <Button
            type="submit"
            className="mt-5 focus-visible:ring-offset-dialog"
          >
            Join League
          </Button>
        )}
      </form>
    </BaseDialog>
  );
};

export default JoinLeagueDialog;
