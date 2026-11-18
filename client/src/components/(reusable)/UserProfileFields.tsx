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
      <label className="text-2xl text-[#ecc999] font-bold">{label}</label>
      <p className="border-b  rounded-4xl border-[#ecc999]">{userData}</p>
    </>
  );
}
