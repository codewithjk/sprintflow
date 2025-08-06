import { UserProps } from "../../../../../../../libs/domain/entities/user.entity";

type Props = {
  members: UserProps[];
};

export default function OnlineMembers({ members }: Props) {
  return (
    <div className="p-4 text-black  dark:text-white">
      <h3 className="mb-2 font-semibold">Online Members</h3>
      <ul className="space-y-1">
        {members.map((m) => m&& (
          <li key={m.id} className="text-sm">
            {m.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
