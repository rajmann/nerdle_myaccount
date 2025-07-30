import { ImCross } from "react-icons/im";

const DeleteButton = ({ onClick, ...props }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="m-2 rounded-full bg-red-600 p-1 disabled:cursor-not-allowed disabled:bg-red-400"
      {...props}>
      <ImCross className="h-2 w-2" />
    </button>
  );
};

export default DeleteButton;
