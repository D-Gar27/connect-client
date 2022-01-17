import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from '../styles/components/Login.module.scss';
import { getProviders, signIn } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from 'axios';

const Signin = ({ providers }: any) => {
  const [isSignIn, setIsSignIn] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState({
    success: false,
    msg: '',
  });
  const [values, setValues] = useState({
    email: '',
    username: '',
    auth: '',
    password: '',
    confirm: '',
  });
  const [showMsg, setShowMsg] = useState<boolean>(false);

  const router = useRouter();

  const signInHandler = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const credentials = {
        auth: values.auth,
        password: values.password,
      };

      const res: any = await signIn(providers?.credentials?.id, {
        ...credentials,
        redirect: false,
      });

      if (res.error) {
        setLoading(false);
        return setStatus({
          success: false,
          msg: 'Email or password is not correct',
        });
      }
      setStatus({ success: true, msg: 'Successfully logged in' });
      setLoading(false);
      router.push('/');
    } catch (error) {
      setStatus({ success: false, msg: 'Email or password is not correct' });
      setLoading(false);
    }
  };

  const signUpHandler = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    if (values.username.includes(' ')) {
      setLoading(false);
      return setStatus({
        success: false,
        msg: "Username can't include space",
      });
    }
    if (values.username.length < 5) {
      setLoading(false);
      return setStatus({
        success: false,
        msg: 'Username need to be at least 5 characters',
      });
    }
    if (values.username.length > 20) {
      setLoading(false);
      return setStatus({
        success: false,
        msg: 'Username need to be less than 20 characters',
      });
    }
    if (values.confirm !== values.password) {
      setLoading(false);
      return setStatus({ success: false, msg: 'Passwords not match' });
    }
    if (values.password.length < 8) {
      setLoading(false);
      return setStatus({
        success: false,
        msg: 'Password need to be at least 8 characters',
      });
    }
    try {
      const credentials = {
        username: values.username,
        email: values.email,
        password: values.password,
      };
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/sign-up`,
        credentials
      );
      const data = await res.data;
      console.log(data);

      if (data === 'Created') {
        setStatus({ success: true, msg: 'You can now sign in' });
        setLoading(false);
        setIsSignIn(true);
      }
    } catch (error: any) {
      const err = error?.response?.data?.error;

      if (err?.code === 11000) {
        if (err?.keyPattern?.username === 1) {
          setLoading(false);
          return setStatus({
            success: false,
            msg: 'Username has taken',
          });
        }
        if (err?.keyPattern?.email === 1) {
          setLoading(false);
          return setStatus({
            success: false,
            msg: 'Email is already in use',
          });
        }
      } else {
        setLoading(false);
        return setStatus({
          success: false,
          msg: 'Something went wrong try again later',
        });
      }
    }
  };

  useEffect(() => {
    setShowMsg(true);
    const timeOut = setTimeout(() => setShowMsg(false), 3000);
    return () => clearTimeout(timeOut);
  }, [status]);

  return (
    <>
      <Head>{isSignIn ? <title>Sign In</title> : <title>Sign Up</title>}</Head>
      <main className={styles.signInPage}>
        <div className={styles.signInContainer}>
          <div className={styles.svg}>
            <Image
              src={'/images/login.svg'}
              alt="Login illustrations"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <div className={styles.formContainer}>
            <form
              className={styles.signInForm}
              onSubmit={isSignIn ? signInHandler : signUpHandler}
            >
              {isSignIn && (
                <input
                  type="text"
                  placeholder="Username/Email"
                  required
                  onChange={(e) =>
                    setValues({ ...values, auth: e.target.value })
                  }
                />
              )}
              {!isSignIn && (
                <input
                  type="text"
                  placeholder="Username"
                  required
                  onChange={(e) =>
                    setValues({ ...values, username: e.target.value })
                  }
                />
              )}
              {!isSignIn && (
                <input
                  type="email"
                  placeholder="Email"
                  required
                  onChange={(e) =>
                    setValues({ ...values, email: e.target.value })
                  }
                />
              )}
              <input
                type="password"
                placeholder="Password"
                required
                onChange={(e) =>
                  setValues({ ...values, password: e.target.value })
                }
              />
              {!isSignIn && (
                <input
                  type="password"
                  placeholder="Confirm password"
                  required
                  onChange={(e) =>
                    setValues({ ...values, confirm: e.target.value })
                  }
                />
              )}
              {isSignIn ? (
                <p>
                  <b onClick={() => setIsSignIn(false)}>Sign up</b> for free
                </p>
              ) : (
                <p>
                  <b onClick={() => setIsSignIn(true)}>Sign in</b> to your
                  account
                </p>
              )}
              {showMsg && !status.success && (
                <p className={styles.showMsg}>{status.msg}</p>
              )}
              {showMsg && status.success && (
                <p className={styles.showMsgSuccess}>{status.msg}</p>
              )}
              {loading ? (
                <button disabled type="submit">
                  Wait...
                </button>
              ) : isSignIn ? (
                <button type="submit">Sign In</button>
              ) : (
                <button type="submit">Sign Up</button>
              )}
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
}

export default Signin;
