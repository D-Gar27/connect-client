import styles from '../styles/pages/Setting.module.scss';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

interface ModalProps {
  type: 'password' | 'delete';
  setShowModal: any;
}

const PasswordModal = ({ type, setShowModal }: ModalProps) => {
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(true);
  const [verified, SetVerified] = useState<boolean>();

  const UserData = useSelector((state: any) => state?.user?.user);

  const router = useRouter();

  const checkPassword = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/check-password`,
        { username: UserData?.username, password },
        { headers: { authorization: `Bearer ${UserData?.token}` } }
      );
      setLoading(false);
      if (res.data?.isMatched) {
        SetVerified(true);
      } else {
        SetVerified(false);
      }
      setLoading(false);
      setSuccess(false);
    } catch (error) {
      setLoading(false);
      setSuccess(false);
    }
  };

  const updatePassword = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (newPassword.length < 8) {
        throw new Error('Password need to be at least 8 characters');
      }
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${UserData?.username}`,
        { password: newPassword },
        { headers: { authorization: `Bearer ${UserData?.token}` } }
      );
      setLoading(false);
      setSuccess(true);
      setShowModal(false);
    } catch (error) {
      setLoading(false);
      setSuccess(false);
    }
  };
  const deleteUser = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${UserData?.username}`
      );
      setLoading(false);
      signOut();
      router.push('/sign-in');
    } catch (error) {
      setLoading(false);
    }
  };
  return (
    <div className={styles.modal}>
      {verified && type === 'password' ? (
        <form className={styles.container}>
          <h3>Enter your new password</h3>
          <input
            type="password"
            placeholder="Your New Password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <div className={styles.buttons}>
            <button onClick={() => setShowModal(false)}>Cancel</button>
            {loading ? (
              <button disabled>Updating...</button>
            ) : (
              <button onClick={updatePassword}>Edit</button>
            )}
          </div>
          {!success && (
            <p style={{ color: 'red' }}>
              Password is too short or network error
            </p>
          )}
        </form>
      ) : verified && type === 'delete' ? (
        <form className={styles.container}>
          <div className={styles.buttons}>
            <button onClick={() => setShowModal(false)}>Cancel</button>

            <button onClick={deleteUser} className={styles.delete}>
              Delete
            </button>
          </div>
        </form>
      ) : (
        <form className={styles.container}>
          <h3>Enter your password</h3>
          <input
            type="password"
            placeholder="Your Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className={styles.buttons}>
            <button onClick={() => setShowModal(false)}>Cancel</button>
            {loading ? (
              <button disabled>Verifying...</button>
            ) : (
              <button onClick={checkPassword}>Next</button>
            )}
          </div>
          {!success && <p style={{ color: 'red' }}>Password not correct</p>}
        </form>
      )}
    </div>
  );
};

export default PasswordModal;
