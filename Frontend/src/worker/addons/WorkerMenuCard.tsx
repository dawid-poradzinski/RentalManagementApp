import { Link } from "react-router-dom";

type Props = { name: string; singleLink: string };

export default function WorkerMenuCard({ name, singleLink }: Props) {
  return (
    <Link to={singleLink} className="h-50 flex items-center justify-center p-4 bg-white/7 hover:bg-white/10 text-white rounded-lg shadow-md transition-transform transform hover:-translate-y-1">
      <div className="font-medium text-center text-3xl">{name}</div>
    </Link>
  );
}