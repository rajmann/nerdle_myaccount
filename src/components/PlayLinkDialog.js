import React from 'react';

import BaseDialog from './BaseDialog';
import Button from './Button';

const PlayLinkDialog = ({ 
  isOpen, 
  onClose, 
  onViewGameDiary, 
  onGoToGame, 
  gameName 
}) => {
  return (
    <BaseDialog isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">
          Choose an action for {gameName}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          Would you like to view the game diary for this game or play it directly?
        </p>
        
        <div className="flex flex-col gap-3">
          <Button
            onClick={onViewGameDiary}
            className="w-full bg-nerdle-primary text-white hover:bg-nerdle-primary/90">
            View Game Diary
          </Button>
          
          <Button
            onClick={onGoToGame}
            className="w-full bg-gray-600 text-white hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600">
            Go to Game
          </Button>
          
          <Button
            onClick={onClose}
            className="w-full bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600">
            Cancel
          </Button>
        </div>
      </div>
    </BaseDialog>
  );
};

export default PlayLinkDialog;