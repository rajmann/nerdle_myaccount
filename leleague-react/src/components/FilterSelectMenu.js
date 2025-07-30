import React from "react";

import { Listbox, Transition } from "@headlessui/react";
import { HiCheck, HiSelector } from "react-icons/hi";

const FilterSelectMenu = ({ options, value, onChange }) => {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        <Listbox.Button className="relative w-full rounded-lg py-1 px-2 pr-8 text-violet-400 hover:text-violet-500">
          <span className="block truncate text-sm font-semibold">
            {value?.label}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-white">
            <HiSelector className="h-4 w-4" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition
          as={React.Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-50 mt-1 max-h-60 overflow-auto rounded-md bg-slate-600 py-1 shadow-md">
            {options.map((option, index) => (
              <Listbox.Option
                key={index}
                className={({ active }) =>
                  `relative select-none py-2 px-8 pl-8 text-sm ${
                    active ? "bg-violet-300 text-violet-900" : "text-white"
                  }`
                }
                value={option?.value}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-semibold" : "font-normal"
                      }`}
                    >
                      {option?.label}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-violet-500">
                        <HiCheck className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default FilterSelectMenu;
