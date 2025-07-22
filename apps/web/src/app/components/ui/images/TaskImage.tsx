import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const TaskImage = ({ task, src  } : {task : any , src : string}) => {

  const altText = task.attachments[0].fileName || "Task Picture";

  return (
    <LazyLoadImage
      src={src}
      alt={altText}
      effect="blur"

      style={{
        height: '100%',
        borderRadius: '9999px', 
        objectFit: 'cover',
      }}
          width={400}
          height={200}
          className="h-auto w-full rounded-t-md"
    />
  );
};

export default TaskImage;
