import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, useWatch, type SubmitHandler } from 'react-hook-form';
import type { IUser, LoginForm } from '../../interfacesAndTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../SchemaValidation';
import { loginUser } from '../../Services';
import { Eye, EyeClosed } from 'lucide-react';
import { useAppStore } from '../../Store';
import { useApiMutation } from '../../Hooks';
import FormField from '../Atoms/FormField';

const Login = () => {
  const navigate = useNavigate();
  const { executeMutation, isMutating } = useApiMutation();
  const setUser = useAppStore((state) => state.setUser);

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

  const [passwordHidden, setPasswordHidden] = useState(true);

  const currentLoginMethod = useWatch({
    control,
    name: 'loginMethod',
  });
  const isDisabled = !isDirty || !isValid || isMutating;

  const handleLoginMethodChange = () => {
    setValue(
      'loginMethod',
      currentLoginMethod === 'password' ? 'otp' : 'password'
    );
  };
  const handlePasswordToggle = () => {
    setPasswordHidden((prev) => !prev);
  };
  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    const requestBody = loginUser(data);
    const response = await executeMutation(requestBody);
    if (response?.status === 200 && response?.data) {
      setUser(response.data as IUser);
      navigate('/feed');
    }
  };

  return (
    <div className="flex justify-center items-center h-[75vh]">
      <div className="card bg-base-200 dark:bg-base-300 w-96 shadow-md">
        <div className="card-body">
          <h2 className="card-title text-3xl mb-3">Login</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormField
              type="email"
              label="Email"
              placeholder="Enter your email"
              name="email"
              control={control}
              error={errors.email?.message}
            />
            {currentLoginMethod === 'password' ? (
              <FormField
                type={passwordHidden ? 'password' : 'text'}
                label="Password"
                placeholder="Enter your password"
                name="password"
                control={control}
                error={errors.password?.message}
                iconPosition="end"
                icon={
                  passwordHidden ? (
                    <EyeClosed
                      width={20}
                      height={20}
                      onClick={handlePasswordToggle}
                      cursor="pointer"
                    />
                  ) : (
                    <Eye
                      width={20}
                      height={20}
                      onClick={handlePasswordToggle}
                      cursor="pointer"
                    />
                  )
                }
              />
            ) : (
              <FormField
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
                className={`btn-class ${isDisabled ? 'button-disabled' : ''}`}
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
          <div className="mt-4">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-400!">
              Signup
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
