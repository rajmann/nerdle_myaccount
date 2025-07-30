import React from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { MdEdit } from "react-icons/md";
import { useParams } from "react-router-dom";
import * as yup from "yup";

import { useDeleteMember } from "../../api/deleteMember";
import { useProfile } from "../../api/profile";
import { useUpdateMember } from "../../api/updateMember";
import { ReactComponent as CheckIcon } from "../../assets/icons/check.svg";
import Checkbox from "../../components/Checkbox";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import DeleteButton from "../../components/DeleteButton";
import Spinner from "../../components/Spinner";
import TextButton from "../../components/TextButton";

const schema = yup
  .object({
    members: yup.array(
      yup.object({
        id: yup.string().required(),
        fullname: yup.string().required(),
        delete: yup.bool(),
        makeAdmin: yup.bool(),
        deleteAdmin: yup.bool(),
      })
    ),
  })
  .required();

const LeagueMembers = ({ members, isValidating, mutate }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [ID, setID] = React.useState(false);
  const [SK, setSK] = React.useState(false);
  const { execute: executeDeleteMember } = useDeleteMember();
  const { data } = useProfile();
  const editMembers = React.useCallback(() => {
    setIsEditing(true);
  }, []);

  const params = useParams();

  const [isLoading, setIsLoading] = React.useState(false);

  const { execute } = useUpdateMember();

  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    reset
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      members,
    },
  });

  const onSubmit = React.useCallback(
    () => {
      const data = getValues();
      if (data.members.filter(function (s) { return s.makeAdmin; }).length === 0) {
        toast.error("Please select atleast one Admin");
      } else {
        const promiseArr = data.members.map((member) => {
          const payload = {
            leagueId: params.leagueId,
            memberId: member.id,
            body: {
              fullname: member.fullname,
              makeDelete: member.makeDelete,
              makeAdmin: member.makeAdmin,
            },
          };

          return execute(payload);
        });

        setIsLoading(true);

        Promise.all(promiseArr)
          .then(() => {
            mutate();
            toast.success("Updated league members");
          })
          .catch((err) => {
            console.log(err)
            toast.error("Cannot update league members");
            setIsLoading(false);
          });

        setIsEditing(false);
      }
    },
    [execute, getValues, mutate, params.leagueId]
  );

  const deleteMember = React.useCallback(async () => {
    try {
      await executeDeleteMember({ SK, ID });
      toast.success("Successfully Deleted!");
      mutate();
      setShowMemberModal(false);
    } catch (e) {
      console.log(e)
      toast.error("Cannot delete account");
    }
  }, [executeDeleteMember, SK, ID, mutate]);

  React.useEffect(() => {
    if (!isValidating) {
      setIsLoading(false);
    }
  }, [isValidating]);

  React.useEffect(() => {
    reset({ members });
  }, [reset, members]);

  const [showMemberModal, setShowMemberModal] = React.useState(false);

  return (
    <>
      <ConfirmationDialog
        showModal={showMemberModal}
        setShowModal={setShowMemberModal}
        title="Are you sure you want to delete this member?"
        click={() => deleteMember()}
      />
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-white">Members</h2>
          {isEditing ? (
            <TextButton type="submit">Save</TextButton>
          ) : (
            <button
              onClick={editMembers}
              className="text-violet-400 hover:text-violet-500">
              <MdEdit className="h-4 w-4" />
            </button>
          )}
        </div>
        {isLoading ? (
          <div className="mt-5 flex justify-center">
            <Spinner />
          </div>
        ) : (
          <>
            <div className="mt-5 grid grid-cols-5 text-xs text-gray-400">
              <span className="">Rank</span>
              <span className="col-span-2">User</span>
              <span className="border-x border-gray-700 text-center">
                Make Admin
              </span>
              <span className="border-r border-gray-700 text-center">
                Delete
              </span>
            </div>
            {isEditing
              ? members.map((member, index) => (
                <div
                  key={member.rank}
                  className="grid grid-cols-5 text-sm text-white">
                  <span>{member.rank}</span>
                  <span className="col-span-2 pr-4 pb-2">
                    {member.fullname}
                  </span>
                  <span className="flex items-center justify-center border-x border-gray-700">
                    <Checkbox
                      defaultChecked={member.makeAdmin}
                      {...register(`members.${index}.makeAdmin`)}
                    />
                  </span>
                  <span className="flex items-center justify-center border-r border-gray-700">
                    <DeleteButton disabled={members.length === 1 || member.memberId === data.id} onClick={() => {
                      setShowMemberModal(true);
                      setSK(member.SK)
                      setID(member.id)
                    }} />
                  </span>
                </div>
              ))
              : members.map((member) => (
                <div
                  key={member.rank}
                  className="grid grid-cols-5 text-sm text-white">
                  <span className="flex items-center">{member.rank}</span>
                  <span className="col-span-2 flex items-center pr-4 pb-2">
                    {member.fullname}
                  </span>
                  <span className="flex items-center justify-center border-x border-gray-700">
                    {member.makeAdmin ? <CheckIcon /> : "-"}
                  </span>
                  <span className="flex items-center justify-center border-r border-gray-700">
                    <DeleteButton disabled />
                  </span>
                </div>
              ))}
          </>
        )}
        {errors.members && (
          <span className="mt-1 text-sm text-red-400">
            {errors.members.message}
          </span>
        )}
      </form>
    </>
  );
};

export default LeagueMembers;
