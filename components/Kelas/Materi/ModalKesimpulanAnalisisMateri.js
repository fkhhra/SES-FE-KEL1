import { editMateriKesimpulan } from "client/MateriClient";
import NewModal from "components/Shared/NewModal/NewModal";
import { useState } from "react";
import toast from "react-hot-toast";
import ReactiveButton from "reactive-button";
import { momentPackage } from "utilities/HelperUtils";
import { hideModal } from "utilities/ModalUtils";

const ModalKesimpulanAnalisisMateri = ({ kesimpulan, singleMateri, _getDetailTopik }) => {

	const { mTopikId } = singleMateri || {};
  const [buttonState, setButtonState] = useState("idle");

	const tandaiSudahDibaca = async (id) => {
    setButtonState("loading");
    let body = { dibaca: 1 }
    const { data, error } = await editMateriKesimpulan(body, id);
    if (data) {
      setButtonState("success");
      toast.success(data?.message);
      _getDetailTopik();
      hideModal("modalKesimpulanAnalisisMateri");
      return;
    }

    toast.error(error?.message);
    setButtonState("error");
  };

	return (
		<NewModal
			modalId="modalKesimpulanAnalisisMateri"
			removeFooter={kesimpulan?.kesimpulan?.[0].dibaca}
			title={
				<h4 className="mb-0 fw-extrabold">
          {kesimpulan?.nama}
        </h4>
			}
			content={
				<>
					<h5 className="fs-18-ss color-dark fw-bold">Kesimpulan</h5>
					<p
						className="color-secondary dangerous-html"
						dangerouslySetInnerHTML={{
							__html: kesimpulan?.kesimpulan?.[0]?.kesimpulan,
						}}
					/>
				</>
			}
			submitButton={
				<ReactiveButton
					buttonState={buttonState}
					color={"primary"}
					idleText={"Tandai Sudah Dibaca"}
					loadingText={"Diproses"}
					successText={"Berhasil"}
					errorText={"Gagal"}
					type={"button"}
					data-bs-dismiss="modal"
					className={"btn btn-primary"}
					onClick={() => tandaiSudahDibaca(kesimpulan?.kesimpulan?.[0].id)}
				/>
			}
		/>
	)
}

export default ModalKesimpulanAnalisisMateri;