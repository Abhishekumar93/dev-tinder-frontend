import { useApiQuery } from '../../Hooks/useApiQuery';
import type { IUserProfile } from '../../interfacesAndTypes';
import { getAllConnections } from '../../Services/Api/user';
import UserDetails from '../UserDetails';

const Connections = () => {
  const connectionQuery = getAllConnections();
  const { data, isLoading, error } = useApiQuery<IUserProfile>(connectionQuery);

  return (
    <UserDetails
      data={data}
      isLoading={isLoading}
      error={error}
      showCtas={false}
    />
  );
};

export default Connections;
