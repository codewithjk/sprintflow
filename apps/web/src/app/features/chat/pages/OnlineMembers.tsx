import { UserProps } from "../../../../../../../libs/domain/entities/user.entity";

import { UserIcon } from "lucide-react";
import Image from "../../../components/ui/images";
import { useAuth } from "../../auth/useAuth";

type Props = {
  members: UserProps[];
};

export default function OnlineMembers({ members }: Props) {
  const {user} = useAuth()
  const userId = user?.id;
  return (
    <div className="p-4 text-black dark:text-white">
      <h3 className="mb-3 text-base font-semibold">Online Members
      <span className="inline-block bg-blue-500 text-white text-xs font-semibold px-2 mx-2 py-0.5 rounded-full">
      {members.length-1}
    </span>
      </h3>
    <ul className="space-y-2">
        {members.map(
          (m) => {
            
            if (m && m !== undefined) {
              const you = m.id === userId
              return (
                <li
                  key={m.id}
                  className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-dark-accent transition-colors"
                >
                  {/* Avatar */}
                  {m.profileUrl ? (
                    <Image
                      src={m.profileUrl}
                      alt={m.name || "User"}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-8 w-8 rounded-full text-gray-500 dark:text-white" />
                  )}

                  {/* Name (and optional subtitle) */}
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{you ? "You" : m.name}</p>
                    {/* Optional subtitle, e.g. email or role */}
                    {/* <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{m.email}</p> */}
                  </div>
                </li>
              )
            }
            }
        )}
      </ul>
    </div>
  );
}
