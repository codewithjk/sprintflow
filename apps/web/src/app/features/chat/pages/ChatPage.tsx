import Header from "../../../components/ui/header";
import { NotFoundPage } from "../../../pages/NotFoundPage";
import { useAuth } from "../../auth/useAuth";
import { ChatLayout } from "./ChatLayout";

export function ChatPage() {
  const { user } = useAuth();
  const orgId = user?.role === "user" ? user.orgId : user?.id;
  const userId = user?.id;
  if (!orgId || !userId) return <NotFoundPage />;
  return (
    <div id="chat page" className="flex flex-1 w-full  flex-col  ">

        <Header name="Messages" isSmallText />


      <ChatLayout orgId={orgId} userId={userId} />
    </div>
  );
}
