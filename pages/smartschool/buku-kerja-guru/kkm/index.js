import { deleteBukuKerja } from "client/BukuKerjaGuruClient";
import CardBukuKerja from "components/BukuKerjaGuru/CardBukuKerja";
import LayoutBukuKerjaDetail from "components/BukuKerjaGuru/LayoutBukuKerjaDetail";
import Title from "components/BukuKerjaGuru/Title";
import useBukuKerjaDetail from "hooks/useBukuKerjaDetail";
import useEditModal from "hooks/useEditModal";
import toast from "react-hot-toast";
import swal from "sweetalert";
import { getPreviewURL } from "utilities/FileViewer";
import { showModal } from "utilities/ModalUtils";

const index = (props) => {
  const { bukuKerjaDetailData, refetchBukuKerjaDetail, refetchData } =
    useBukuKerjaDetail();
  const { setEditModal } = useEditModal();
  const { data: datas } = bukuKerjaDetailData || {};

  const _deleteBukuKerja = (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await deleteBukuKerja(id);
        if (data) {
          toast.success(data?.message);
          refetchBukuKerjaDetail(!refetchData);
        } else {
          toast.error(error?.message);
        }
      }
    });
  };

  const onClickEdit = (editData) => {
    showModal("modalTambahKKM");
    setEditModal("modalTambahKKM", editData);
  };

  return (
    <LayoutBukuKerjaDetail>
      <Title>KKM / KKTP</Title>

      <div className="row mt-4 pt-4 g-4">
        {datas?.map((data) => (
          <CardBukuKerja
            key={data?.id}
            title={data?.mataPelajaran?.nama}
            topLabel={[{ text: `${data?.ta?.tahun} - ${data?.ta?.semester}` }]}
            bottomLabel={[
              {
                icon: "/img/icon-skl-ki-kd.svg",
                text: `Kelas ${data?.tingkat}`,
              },
            ]}
            backgroundIcon="/img/icon-buku-kerja-1.png"
            withDropdown={{
              dropdownId: `dropdown-buku-kerja-${data?.id}`,
              onClickEdit: () => onClickEdit(data),
              onClickDelete: () => _deleteBukuKerja(data?.id),
            }}
            onClick={() =>
              data?.lampiran && window.open(getPreviewURL(data?.lampiran))
            }
          />
        ))}
      </div>
    </LayoutBukuKerjaDetail>
  );
};

export default index;
