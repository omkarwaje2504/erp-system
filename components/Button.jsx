import { LuLoader } from "react-icons/lu";

export default function Button({ type, label, onClick, isLoading }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full bg-black text-white p-2 text-lg rounded-md hover:bg-gray-800 transition disabled:opacity-50 flex items-center justify-center"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <LuLoader className="w-4 h-4 fill-white animate-spin" /> Please wait
        </>
      ) : (
        label
      )}
    </button>
  );
}
