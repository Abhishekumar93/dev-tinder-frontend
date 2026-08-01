import { USER_GENDER } from '../../../constants';
import type { IUserProfile } from '../../../interfacesAndTypes';

const UserCard = ({
  age,
  firstName,
  gender,
  lastName,
  profilePic,
  bio,
}: IUserProfile) => {
  const userGender = USER_GENDER[gender as keyof typeof USER_GENDER];

  return (
    <div className="card bg-base-100 dark:bg-gray-950 w-96 shadow-sm hover:scale-105 transform transition duration-300">
      <figure className="p-2">
        <img
          src={
            profilePic ||
            'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp'
          }
          alt={firstName || 'profile-pic'}
          loading="lazy"
          className="rounded-md aspect-square"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{`${firstName} ${lastName} (${userGender}, ${age})`}</h2>
        <p>{bio}</p>
        <div className="card-actions justify-between mt-1">
          <button className="btn btn-error bg-red-400!">Ignore</button>
          <button className="btn btn-primary">Send Request</button>
        </div>
      </div>
    </div>
  );
};
export default UserCard;
