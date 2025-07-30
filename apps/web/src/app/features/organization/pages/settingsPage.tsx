import Header from "../../../components/ui/header";
import { useAuth } from "../../auth/useAuth";



export const SettingsPage = () => {

  
    const { user } = useAuth();

    const stripeCustomerPortalLink = import.meta.env.VITE_STRIPE_CUSTOMER_PORTAL_LINK;
    console.log(stripeCustomerPortalLink)

  return (
    <div className="flex w-full flex-col p-8">
      <Header
        name="Settings"
          />
          <button className="boarder border-[0.5px] rounded border-white w-fit px-3 py-1">
             <a className="dark:text-white" href={stripeCustomerPortalLink+'?prefilled_email='+user?.email} target="_blank">Billing</a>
          </button>
     
    </div>
  );
};