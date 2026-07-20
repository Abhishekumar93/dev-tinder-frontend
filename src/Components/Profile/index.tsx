import { useAppStore } from '../../Store';

const Profile = () => {
  const userData = useAppStore((state) => state.user);
  return <div>{userData?.firstName}</div>;
};

export default Profile;
