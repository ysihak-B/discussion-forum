import axios from "axios";

const upload = async (data) => {
  try {
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/djmt7dhrl/image/upload",
      data,
      {
        withCredentials: false,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const { url } = res.data;
    return url;
  } catch (err) {
    console.log(err);
  }
  console.log(data);
};

export default upload;
