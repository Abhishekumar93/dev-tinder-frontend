import { useApiQuery } from '../../Hooks/useApiQuery';
import type { IUserProfile } from '../../interfacesAndTypes';
import { getUserFeed } from '../../Services';
import UserDetails from '../UserDetails';

const Feed = () => {
  const feedQuery = getUserFeed();
  const { data, isLoading, error } = useApiQuery<IUserProfile>(feedQuery);

  return <UserDetails data={data} isLoading={isLoading} error={error} />;
};

export default Feed;
