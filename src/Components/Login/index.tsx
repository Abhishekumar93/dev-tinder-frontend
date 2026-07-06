import { useForm, useWatch, type SubmitHandler } from 'react-hook-form';
import { InputFields } from '../Atoms';
import type { LoginForm } from '../../interfacesAndTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../SchemaValidation';
import { loginUser } from '../../Services';

const Login = () => {
  const {
    handleSubmit,
    control,
    formState: { errors, isValid, isDirty },
    setValue,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      loginMethod: 'password',
    },
  });

  const currentLoginMethod = useWatch({
    control,
    name: 'loginMethod',
  });

  const handleLoginMethodChange = () => {
    setValue(
      'loginMethod',
      currentLoginMethod === 'password' ? 'otp' : 'password'
    );
  };
  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    const response = await loginUser(data);
    console.log(response, 'response devtinder');
  };

  return (
    <div className="flex justify-center items-center h-[75vh]">
      <div className="card bg-base-200 dark:bg-base-300 w-96 shadow-md">
        <div className="card-body">
          <h2 className="card-title text-3xl mb-3">
            <span className="text-center w-100">Login</span>
          </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <InputFields
              type="email"
              label="Email"
              placeholder="Enter your email"
              name="email"
              control={control}
              error={errors.email?.message}
            />
            {currentLoginMethod === 'password' ? (
              <InputFields
                type="password"
                label="Password"
                placeholder="Enter your password"
                name="password"
                control={control}
                error={errors.password?.message}
              />
            ) : (
              <InputFields
                label="OTP"
                placeholder="Enter your otp"
                name="otp"
                control={control}
                error={errors.otp?.message}
              />
            )}
            <div className="card-actions justify-between mt-4">
              <button
                type="submit"
                className={`btn btn-primary bg-base-100 text-black dark:text-white hover:scale-105 transform transition duration-300 ${isDirty || isValid ? '' : 'btn-disabled opacity-50'}`}
              >
                Login
              </button>
              <button
                type="button"
                className="text-primary dark:text-primary-content bg-transparent! border-none"
                onClick={handleLoginMethodChange}
              >
                {`Login using ${currentLoginMethod === 'password' ? 'OTP' : 'Password'}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
