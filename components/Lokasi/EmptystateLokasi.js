import { ssURL } from "../../client/clientAxios"
import Link from "next/link";

const EmptystateLokasi = () => {
    return (
        <div className="card card-ss">
            <div className="p-4">
                <div className="alert alert-danger">
                Anda belum mengaktifkan tahun akademik. Klik{" "}
                <Link href={`${ssURL}/tahun-akademik`}>disini</Link> untuk
                memilih tahun akademik yang aktif
                </div>
            </div>
        </div>
    )
}

export default EmptystateLokasi;