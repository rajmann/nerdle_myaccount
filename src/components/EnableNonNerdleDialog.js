import React from 'react';

import BaseDialog from './BaseDialog';
import Button from './Button';

const EnableNonNerdleDialog = ({ isOpen, onClose, onConfirm }) => {
  return (
    <BaseDialog open={isOpen} closeDialog={onClose}>
      <div className="p-6">
        <h3 className="text-lg font-medium text-black dark:text-white mb-4">
          Enable Non-Nerdle Games
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
          Do you want to enable logging of non-nerdle games such as Wordle in this app?
        </p>
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-4 py-2"
          >
            No
          </Button>
          <Button
            onClick={onConfirm}
            className="px-4 py-2 bg-nerdle-primary text-white hover:bg-nerdle-primary/90"
          >
            Yes
          </Button>
        </div>
      </div>
    </BaseDialog>
  );
};

export default EnableNonNerdleDialog;