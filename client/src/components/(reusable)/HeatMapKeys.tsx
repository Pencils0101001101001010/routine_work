interface MapKey {
  description: string;
  hexColor: string;
}

export default function MapKeys({ description, hexColor }: MapKey) {
  return (
    <span className="flex items-center justify-center gap-2 ">
      <div className={`h-4 w-4 bg-[${hexColor}] rounded-xs`}></div>
      <p>{description}</p>
    </span>
  );
}
