import { deleteBukuKerja } from "client/BukuKerjaGuruClient";
import CardBukuKerja from "components/BukuKerjaGuru/CardBukuKerja";
import LayoutBukuKerjaDetail from "components/BukuKerjaGuru/LayoutBukuKerjaDetail"
import Title from "components/BukuKerjaGuru/Title";
import useBukuKerjaDetail from "hooks/useBukuKerjaDetail";
import useEditModal from "hooks/useEditModal";
import toast from "react-hot-toast";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import swal from "sweetalert";
import { getPreviewURL } from "utilities/FileViewer";
import { momentPackage } from "utilities/HelperUtils";
import { showModal } from "utilities/ModalUtils";

const index = () => {

  const { bukuKerjaDetailData, refetchBukuKerjaDetail, refetchData } = useBukuKerjaDetail();
  const { setEditModal } = useEditModal();
  const {
    data: datas
  } = bukuKerjaDetailData || {};

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
  }

  const onClickEdit = (editData) => {
    showModal("modalTambahKumpulanSoal");
    setEditModal("modalTambahKumpulanSoal", editData);
  }

  const getBottomLabel = (data) => {
    return [
      {
        icon: "/img/icon-buku-kerja.svg",
        text: data?.mataPelajaran?.nama
      },
      {
        icon: "/img/icon-jumlah-soal.svg",
        text: `${data?.soal} Soal`
      },
      {
        icon: "/img/icon-kalender.svg",
        text: momentPackage(data?.tanggal).format("dddd, DD MMM YYYY")
      },
      {
        icon: "/img/icon-waktu-pengerjaan-soal.svg",
        text: `${data?.waktu} Menit`
      },
    ]
  }

  return (
    <LayoutBukuKerjaDetail>
      <Title>
        Kumpulan Soal
      </Title>

      <div className="row mt-4 pt-4 g-4">
        { datas?.map(data => 
          <CardBukuKerja
            key={data?.id}
            title={`Kelas ${data?.tingkat} - ${data?.judul}`}
            topLabel={[{ text: `${data?.ta?.tahun} - ${data?.ta?.semester}` }]}
            bottomLabel={getBottomLabel(data)}
            colClass="col-md-12"
            withDropdown={{ dropdownId: `dropdown-buku-kerja-${data?.id}`, onClickEdit: () => onClickEdit(data), onClickDelete: () => _deleteBukuKerja(data?.id) }}
            backgroundIcon="/img/icon-buku-kerja-3.png"
            penyusun={data?.penyusun}
          />
        )}
      </div>
    </LayoutBukuKerjaDetail>
  )
}

export default index