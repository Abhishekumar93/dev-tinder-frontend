import { useApiQuery } from '../../Hooks/useApiQuery';

const Feed = () => {
  const { data, isLoading, error, mutate } = useApiQuery({
    url: '/user/feed',
    displayErrorToast: true,
    displaySuccessToast: true,
  });
  console.log(data, isLoading, 'devtinder', error, mutate);

  return <div>Feed</div>;
};

export default Feed;
