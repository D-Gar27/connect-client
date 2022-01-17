import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { restoreUserData } from '../redux/userSlice';
import Navbar from './Navbar';
import axios from 'axios';

interface Children {
  children: JSX.Element;
}

const Layout = ({ children }: Children) => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const getUser = async (user: { username: any; token: any }) => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${user.username}`,
          {
            headers: { authorization: `Bearer ${user.token}` },
          }
        );
        dispatch(
          restoreUserData({
            username: user.username,
            token: user.token,
            userImg: data?.profilePic,
          })
        );
      } catch (error) {
        console.log(error);
      }
    };
    getSession().then((session) => {
      if (!session && router.pathname !== '/sign-in') {
        return router.replace('/sign-in');
      } else {
        const user: any = session?.user;
        getUser({ username: user?.username, token: user?.token });
      }
    });
  }, [router, dispatch]);

  return (
    <>
      {router.pathname !== '/sign-in' && <Navbar />}
      <div>{children}</div>
    </>
  );
};

export default Layout;
