import { lazy } from 'react';
import { useApiQuery } from '../../Hooks/useApiQuery';
import Loader from '../Atoms/Loader';
import type { IUserProfile } from '../../interfacesAndTypes';
import type { IApiListResponse } from '../../interfacesAndTypes/response';
import { getUserFeed } from '../../Services';

const UserCard = lazy(() => import('../Atoms/UserCard'));

const Feed = () => {
  const feedQuery = getUserFeed();
  const { data, isLoading, error } = useApiQuery<IUserProfile>(feedQuery);

  if (isLoading) return <Loader />;
  if (error)
    return <div>Error: Something Went Wrong! Please try again later.</div>;

  const feedData = (data as IApiListResponse<IUserProfile>).data?.records || [];

  if (feedData.length === 0) return <div>No feed to show.</div>;

  return feedData.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {feedData.map((user) => (
        <UserCard key={user._id} {...user} />
      ))}
    </div>
  ) : (
    <div>No users found.</div>
  );
};

export default Feed;
