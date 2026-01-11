import { Link } from "react-router-dom";

type Props = { name: string; singleLink: string };

export default function WorkerMenuCard({ name, singleLink }: Props) {
  return (
    <Link to={singleLink} className="h-50 flex items-center justify-center p-4 bg-black/7 hover:bg-black/10 rounded-lg shadow-md backdrop-blur-lg transition-transform transform hover:-translate-y-1">
      <div className="font-medium text-center text-3xl">{name}</div>
    </Link>
  );
}