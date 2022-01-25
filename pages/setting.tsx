import Head from 'next/head';
import styles from '../styles/pages/Setting.module.scss';
import { FaPen } from 'react-icons/fa';
import { ChangeEvent, useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

import { storage } from '../firebase.js';
import { getDownloadURL, uploadString, ref } from 'firebase/storage';
import PasswordModal from '../components/PasswordModal';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

interface Userdata {
  bio: string;
  email: string;
}

const EditProfile = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<{ success: boolean; msg: string }>({
    success: false,
    msg: '',
  });

  const [bio, setBio] = useState('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDelModal, setShowDelModal] = useState<boolean>(false);

  const [image, setImage] = useState<any>();
  const [changeImg, setChangeImg] = useState<boolean>(false);

  const UserData = useSelector((state: any) => state?.user?.user);

  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${UserData?.username}`,
          {
            headers: {
              authorization: `Bearer ${UserData?.token}`,
            },
          }
        );
        setImage(data?.profilePic);
        setBio(data?.bio);
        setLoading(false);
        setStatus({ success: true, msg: 'success' });
      } catch (error) {
        setLoading(false);
        setStatus({ success: false, msg: 'failed' });
      }
    };
    fetchUserData();
  }, [UserData]);

  const previewImage = (e: ChangeEvent<any>) => {
    const reader = new FileReader();
    if (!e.target.files[0]) return;

    if (e.target.files[0]?.type?.includes('image')) {
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (readerE) => setImage(readerE.target?.result);
      setChangeImg(true);
    }
  };

  const handleEdit = async (e: any) => {
    e.preventDefault();
    try {
      let img: string = '';
      if (changeImg) {
        const imageRef = ref(storage, UserData?.username);
        await uploadString(imageRef, image, 'data_url').then(async (snap) => {
          const downloadUrl = await getDownloadURL(imageRef);
          img = downloadUrl;
        });
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${UserData?.username}`,
          { profilePic: img, bio },
          { headers: { authorization: `Bearer ${UserData?.token}` } }
        );
        return router.reload();
      }
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${UserData?.username}`,
        { bio },
        { headers: { authorization: `Bearer ${UserData?.token}` } }
      );
      return router.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Head>
        <title>Setting</title>
      </Head>
      <main className={styles.settingPage}>
        <form className={styles.container}>
          <label className={styles.imgContainer}>
            <Image
              src={image || '/images/account.svg'}
              layout="fill"
              objectFit="cover"
              alt=""
              className={styles.img}
            />
            <input type="file" onChange={previewImage} />
            <FaPen className={styles.editIcon} />
          </label>
          <div className={styles.inputsContainer}>
            <input
              type="text"
              placeholder="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <p className={styles.changePW} onClick={() => setShowModal(true)}>
              Change Password
            </p>
            <button type="submit" onClick={handleEdit}>
              Edit
            </button>
            <p className={styles.delete} onClick={() => setShowDelModal(true)}>
              Delete Account
            </p>
          </div>
        </form>
      </main>
      {showModal && (
        <PasswordModal setShowModal={setShowModal} type={'password'} />
      )}
      {showDelModal && (
        <PasswordModal setShowModal={setShowDelModal} type={'delete'} />
      )}
    </>
  );
};

export default EditProfile;
