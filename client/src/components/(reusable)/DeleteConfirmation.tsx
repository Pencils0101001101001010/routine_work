interface DeleteConfirmProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmation({
  onConfirm,
  onCancel,
}: DeleteConfirmProps) {
  return (
    <div className="flex justify-center bg-red-950/90 rounded-2xl w-75 border-l border-r border-red-500 ">
      <div className="w-75  text-center p-5 my-2">
        <h2 className="text-2xl">Are you sure?</h2>
        <p className="mb-2">This action can't not be undone.</p>
        <div className="flex justify-around items-center">
          <button
            className=" hover:border hover:border-green-400/40 hover:text-green-400 rounded-2xl px-4"
            onClick={onCancel}
          >
            No
          </button>
          <button
            className=" hover:border hover:border-red-400/40 hover:text-red-400 rounded-2xl px-4 "
            onClick={onConfirm}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
