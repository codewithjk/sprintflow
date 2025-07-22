import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const ProfileImage = ({ user, src  } : {user : any , src : string}) => {

  const altText = user?.name || "Profile Picture";

  return (
    <LazyLoadImage
      src={src}
      alt={altText}
      effect="blur"
      width={100}
      height={50}
      style={{
        height: '100%',
        borderRadius: '9999px', // equivalent to Tailwind's rounded-full
        objectFit: 'cover',
      }}
    />
  );
};

export default ProfileImage;
