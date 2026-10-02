interface UserInputFieldProps {
  label: string | undefined;
  userData: string | undefined;
}

export default function UserProfileFields({
  label,
  userData,
}: UserInputFieldProps) {
  return (
    <>
      <label className="text-2xl text-green-300 font-bold">{label}</label>
      <p className="border-b  rounded-4xl border-green-400">{userData}</p>
    </>
  );
}
