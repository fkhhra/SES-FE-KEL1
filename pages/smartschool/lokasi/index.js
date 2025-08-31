import Layout from "../../../components/Layout/Layout";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import useTa from "../../../hooks/useTa";
import { ssURL } from "../../../client/clientAxios";
import ModalTambahPrasarana from "../../../components/Prasarana/ModalTambahPrasarana";
import { useEffect, useState } from "react";
import {
  deleteSarana,
  dowloadSarana,
  getSarana,
} from "../../../client/SaranaPrasaranaClient";
import toast from "react-hot-toast";
import swal from "sweetalert";
import { Pagination } from "antd";
import { useRouter } from "next/router";
import ModalImportExcel from "../../../components/Shared/Modal/ModalImportExcel";
import { useDebounce } from "use-debounce";
import HeaderLokasi from "../../../components/Lokasi/HeaderLokasi";
import ListPrasarana from "../../../components/Lokasi/ListPrasarana";
import EmptystateLokasi from "../../../components/Lokasi/EmptystateLokasi";

const PrasaranaPage = () => {
  const router = useRouter();

  const { page = 1 } = router.query;

  const { ta } = useTa();

  const [listPrasarana, setListPrasarana] = useState([]);
  const [total, setTotal] = useState(1);

  const [editData, setEditData] = useState(null);

  const [search, setSearch] = useState("");
  const [debounceSearch] = useDebounce(search, 600);

  const handleClickEdit = (editData) => {
    setEditData(editData);
  };

  const _getSarana = async () => {
    const { data } = await getSarana({ page: page, search: debounceSearch });
    if (data) {
      setListPrasarana(data?.lokasi?.data);
      setTotal(data?.lokasi?.total);
    }
  };

  const handleClickDelete = (deleteId) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await deleteSarana(deleteId);
        if (data) {
          toast.success(data?.message);
          _getSarana();
        } else {
          toast.error(error?.message);
        }
      }
    });
  };

  useEffect(() => {
    _getSarana();
  }, [page, debounceSearch]);

  return (
    <Layout>
      <AnimatePage>
        <div className="row">
          <div className="col-12">
            {ta ? (
              <>
                <HeaderLokasi
                  setEditData={setEditData}
                  search={search}
                  setSearch={setSearch}
                />
                <div className="card card-ss">
                  <div className="row gy-4 px-4 pt-4">
                    {listPrasarana?.length > 0 &&
                      listPrasarana?.map((data, idx) => (
                        <ListPrasarana
                          data={data}
                          handleClickEdit={handleClickEdit}
                          handleClickDelete={handleClickDelete}
                          key={`${idx}-${new Date().getTime()}`}
                        />
                      ))}
                    <div className="d-flex align-items-center justify-content-center mt-5 pb-5">
                      <Pagination
                        total={total}
                        showSizeChanger={false}
                        current={page || 1}
                        pageSize={20}
                        onChange={(e) =>
                          router.push(`${ssURL}/lokasi?page=${e}`)
                        }
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <EmptystateLokasi />
            )}
          </div>
        </div>
        <ModalTambahPrasarana
          editData={editData}
          setEditData={setEditData}
          _getSarana={_getSarana}
        />
        <ModalImportExcel
          fileTemplate="/import/template-import-lokasi.xlsx"
          name="Lokasi"
          endpointUrl="lokasi/import"
        />
      </AnimatePage>
    </Layout>
  );
};

export default PrasaranaPage;
