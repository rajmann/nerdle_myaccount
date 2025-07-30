import React from "react";

import { Dialog, Transition } from "@headlessui/react";

import { useLeague } from "../../api/league";
import Button from "../../components/Button";
import LeagueInvite from "../../components/LeagueInvite";

const CreatedLeagueModal = ({ open, onClose, league }) => {
  const leagueId = React.useMemo(() => league?.ID, [league?.ID]);

  const { data, isValidating, mutate } = useLeague({ id: leagueId });

  const title = React.useMemo(
    () => data?.data.details.title,
    [data?.data.details.title]
  );

  const code = React.useMemo(
    () => data?.data.invitationCode,
    [data?.data.invitationCode]
  );

  return (
    <Transition appear show={open} as={React.Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="flex w-full max-w-sm transform flex-col gap-4 overflow-hidden rounded-2xl bg-background p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-xl font-semibold text-white">
                  {title}
                </Dialog.Title>
                <LeagueInvite
                  leagueId={leagueId}
                  title={title}
                  code={code}
                  isValidating={isValidating}
                  mutate={mutate}
                />
                <Button onClick={onClose}>Close</Button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CreatedLeagueModal;
