interface TableHeadProps {
  title: string;
}

export default function TableHead({ title }: TableHeadProps) {
  return (
    <th className="px-8 py-4 text-left border-2 border-green-800">{title}</th>
  );
}
