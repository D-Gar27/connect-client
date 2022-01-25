import Image from 'next/image';
import styles from '../styles/components/UploadArea.module.scss';
import { FaPhotoVideo } from 'react-icons/fa';
import { ChangeEvent, useState } from 'react';
import { useSelector } from 'react-redux';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { storage } from '../firebase';
import axios from 'axios';

const UploadArea = () => {
  const [image, setImage] = useState<any | string>('');
  const [caption, setCaption] = useState<string>('');

  const previewImage = (e: ChangeEvent<any>) => {
    const reader = new FileReader();
    if (!e.target.files[0]) return;
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = (readerEvent) => setImage(readerEvent.target?.result);
  };

  const UserData = useSelector((state: any) => state?.user?.user);

  const handleUpload = async (e: any) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/posts`,
        { username: UserData?.username, caption },
        { headers: { authorization: `Bearer ${UserData?.token}` } }
      );
      const imageRef = ref(storage, data?._id);
      await uploadString(imageRef, image, 'data_url').then(async (snap) => {
        const downloadUrl = await getDownloadURL(imageRef);
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/posts/${data._id}`,
          { postImgs: [downloadUrl] },
          { headers: { authorization: `Bearer ${UserData?.token}` } }
        );
      });
      setImage('');
      setCaption('');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.uploadArea}>
      <div className={styles.user}>
        <div className={styles.userImg}>
          <Image
            src={UserData.userImg || '/images/account.svg'}
            alt="user"
            layout="fill"
            objectFit="cover"
            className={styles.Img}
          />
        </div>
        <input
          type="text"
          placeholder="What are your thoughts"
          className={styles.input}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
      </div>
      {image && (
        <div className={styles.postImgContainer}>
          <Image
            src={image}
            alt=""
            layout="fill"
            objectFit="contain"
            className={styles.postImg}
          />
        </div>
      )}
      <div className={styles.actions}>
        <label htmlFor="image">
          <FaPhotoVideo className={styles.mediaIcon} />
          <input type="file" name="image" id="image" onChange={previewImage} />
        </label>
        <button onClick={handleUpload}>Post</button>
      </div>
    </div>
  );
};

export default UploadArea;
