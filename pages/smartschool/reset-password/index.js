import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { resetPassword } from "../../../client/UserClient";
import FormResetPassword from "../../../components/Login/FormResetPassword";

const index = ({ auth, userId }) => {
  const router = useRouter();
  const initialFormData = {
    konfirmasiPassword: "",
    passwordBaru: "",
    lihatPasswordLama: false,
    lihatPasswordBaru: false,
    lihatKonfirmasiPassword: false,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [success, setSuccess] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.passwordBaru != formData.konfirmasiPassword) {
      toast.error("password tidak sesuai");
      return;
    }

    const { data, error } = await resetPassword({
      token: auth,
      userId,
      password: formData.passwordBaru,
    });
    if (data) {
      toast.success("Password berhasil diubah");
      router.push("/smartschool");
      setSuccess(1);
      return;
    } else {
      toast.error(error?.message);
      return;
    }
  };

  useEffect(() => {
    if (!auth || !userId) {
      router.push("/smartschool");
    }
  }, []);
  return (
    <div>
      {success ? (
        <div className="">
          Password berhasil diubah. Kembali ke Halaman smartschool
        </div>
      ) : (
        <FormResetPassword
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export async function getServerSideProps({ query: { auth, userId } }) {
  return {
    props: {
      auth: auth || "",
      userId: userId || "",
    },
  };
}

export default index;
