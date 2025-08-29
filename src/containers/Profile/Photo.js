import React from "react";

import toast from "react-hot-toast";

import { useUploadPhoto } from "../../api/uploadPhoto";
import Avatar from "../../components/Avatar";
import Spinner from "../../components/Spinner";

const Photo = ({isVerified, photo, name, isValidating, mutate, children }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const fileInputRef = React.useRef(null);

  const onOpenFileBrowser = React.useCallback(() => {

    if(!isVerified)
    {
      toast.error("Please verify your email first!");
      return;
    }

    fileInputRef.current.click();
  }, [isVerified]);

  const { execute } = useUploadPhoto();

  const onChangePhoto = React.useCallback(
    async (event) => {

      if(!isVerified)
      {
        toast.error("Please verify your email first!");
        return;
      }
      
      try {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("file", event.target.files[0]);
        await execute(formData);
        mutate();
        toast.success("Changed photo");
      } catch (e) {
        toast.error("Cannot change photo");
        setIsLoading(false);
      }
    },
    [execute, mutate, isVerified]
  );

  React.useEffect(() => {
    if (!isValidating) {
      setIsLoading(false);
    }
  }, [isValidating]);

  return (
    <div className="mt-4 flex items-center">
      {isLoading ? (
        <div className="flex h-16 w-16 items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <Avatar src={photo} alt={name} />
      )}
      <div className="flex-1 ml-3">
        {children}
        <input
          type="file"
          ref={fileInputRef}
          onChange={onChangePhoto}
          accept="image/png, image/jpeg"
          className="hidden"
        />
        <button
          onClick={onOpenFileBrowser}
          className={`text-xs underline ${
            !isVerified 
              ? 'text-gray-400 dark:text-gray-500' 
              : 'text-nerdle-primary hover:text-nerdle-secondary dark:!text-white dark:hover:!text-gray-300'
          }`}
        >
          Change Photo
        </button>
      </div>
    </div>
  );
};

export default Photo;
