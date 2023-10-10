import { User } from "@prisma/client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps extends React.HTMLProps<HTMLDivElement> {
  user: Pick<User, "name" | "image">;
}

export const UserAvatar = ({ user, className, ...props }: UserAvatarProps) => {
  return (
    <Avatar className={className}>
      <AvatarImage
        src={user.image ?? "avatar_fallback.jpg"}
        alt={user.name ?? "MysteriousOne"}
      />
    </Avatar>
  );
};
