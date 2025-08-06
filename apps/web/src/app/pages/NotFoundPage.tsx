import { Flag } from "lucide-react";
import { useNavigate } from "react-router-dom";




export function NotFoundPage() {
    const navigate = useNavigate();

  return (
      <div className="h-screen mx-auto grid place-items-center text-center px-8 dark:bg-slate-800 bg-white">
          <div>
              
          <Flag className="w-20 h-20 mx-auto text-white" />
          <h1
            color="blue-gray"
            className="mt-10 !text-3xl !leading-snug md:!text-4xl text-black dark:text-white"
          >
            Error 404 <br /> It looks like something went wrong.
          </h1>
          <p className="mt-8 mb-14 text-[18px] font-normal text-gray-500 mx-auto md:max-w-sm">
            Don&apos;t worry, our team is already on it.Please try refreshing
            the page or come back later.
          </p>
          <button onClick={()=>navigate(-1)} color="gray" className="w-full px-4 md:w-[8rem] text-2xl font-bold  text-black dark:text-white border bottom-[0.2px] rounded-lg p-2">
           Go Back 
          </button>
        </div>
      </div>
  );
}

