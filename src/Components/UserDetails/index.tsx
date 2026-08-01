import { lazy } from 'react';
import Loader from '../Atoms/Loader';
import type { IUserProfile, IUserDetails } from '../../interfacesAndTypes';
import type { IApiListResponse } from '../../interfacesAndTypes/response';

const UserCard = lazy(() => import('../Atoms/UserCard'));

const UserDetails = ({ data, isLoading, error, showCtas }: IUserDetails) => {
  if (isLoading) return <Loader />;
  if (error)
    return <div>Error: Something Went Wrong! Please try again later.</div>;

  const feedData = (data as IApiListResponse<IUserProfile>).data?.records || [];

  if (feedData.length === 0) return <div>No feed to show.</div>;

  return feedData.length > 0 ? (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {feedData.map((user) => (
        <UserCard key={user._id} showCtas={showCtas} {...user} />
      ))}
    </div>
  ) : (
    <div>No users found.</div>
  );
};

export default UserDetails;
