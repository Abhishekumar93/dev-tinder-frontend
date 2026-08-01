import { useForm, useWatch } from 'react-hook-form';
import { type IUser, type IUserProfile } from '../../interfacesAndTypes';
import { useAppStore } from '../../Store';
import FormField from '../Atoms/FormField';
import UserCard from '../Atoms/UserCard';
import { USER_GENDER_OPTIONS } from '../../constants';
import { updateUserProfile } from '../../Services';
import { useApiMutation } from '../../Hooks';

const Profile = () => {
  const userData = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const { executeMutation, isMutating } = useApiMutation();

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<IUser>({
    defaultValues: {
      firstName: userData?.firstName || '',
      lastName: userData?.lastName || '',
      age: userData?.age || 18,
      gender: userData?.gender || '',
      bio: userData?.bio || '',
      about: userData?.about || '',
    },
    mode: 'onChange',
  });

  const fieldValues = useWatch({ control });
  const isDisabled = Object.keys(errors).length > 0 || isMutating;

  const onSubmit = async (data: IUser) => {
    const requestBody = updateUserProfile(data);
    console.log(requestBody, 'devtinder Form submitted:', data);
    const response = await executeMutation(requestBody);
    if (response?.status === 200 && response?.data) {
      setUser(response.data as IUserProfile);
    }
  };

  return (
    <div className="flex justify-center items-center h-[75vh]">
      <div className="flex justify-center items-start gap-8">
        <div className="card bg-base-200 dark:bg-base-300 w-96 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-3xl mb-3">Profile</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                label="First Name"
                placeholder="Enter your first name"
                name="firstName"
                control={control}
                error={errors.firstName?.message}
              />
              <FormField
                label="Last Name"
                placeholder="Enter your last name"
                name="lastName"
                control={control}
                error={errors.lastName?.message}
              />
              <FormField
                type="number"
                label="Age"
                placeholder="Enter your age"
                name="age"
                control={control}
                error={errors.age?.message}
                min={18}
              />
              <FormField
                fieldType="select"
                label="Gender"
                placeholder="Select your gender"
                name="gender"
                options={USER_GENDER_OPTIONS}
                control={control}
                error={errors.gender?.message}
              />
              <div className="card-actions justify-between mt-4">
                <button
                  type="submit"
                  className={`btn-class ${isDisabled ? 'button-disabled' : ''}`}
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
        {userData && fieldValues && (
          <UserCard
            _id={userData?._id}
            age={fieldValues.age || userData.age}
            bio={fieldValues.bio || userData.bio}
            about={fieldValues.about || userData.about}
            gender={fieldValues.gender || userData.gender}
            firstName={fieldValues.firstName || userData.firstName}
            lastName={fieldValues.lastName || userData.lastName}
            profilePic={fieldValues.profilePic || userData.profilePic}
            email={userData.email}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
