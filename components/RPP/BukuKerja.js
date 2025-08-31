import React from "react";
import CardRPP from "components/RPP/CardRPP";
import CardRPPSkeleton from "components/Shared/Skeleton/CardRRPSkeleton";

const BukuKerja = ({
  loading,
  bukuKerja,
  sekolah,
  userAuthor,
  active,
  subnav,
}) => {
  return (
    <>
      {active && (
        <>
          {!subnav && (
            <>
              <h2 className="fw-black mb-4 color-dark">
                Daftar RPP ( {bukuKerja?.rpp?.length} )
              </h2>
              {loading && (
                <>
                  <CardRPPSkeleton count={3} isReadOnly />
                </>
              )}
              {!loading && (
                <>
                  <div className="row gy-4">
                    {bukuKerja?.rpp?.map((d, idx) => {
                      return (
                        <div
                          className="col-md-4"
                          key={`${idx}-${new Date().getTime()}`}
                        >
                          <CardRPP
                            isReadOnly
                            jenjangData={[`${sekolah?.tingkat}`]}
                            mode={d?.moda}
                            dataDb={d}
                            isReadOnlyTingkat={sekolah?.tingkat}
                            isReadOnlyUserAuthor={userAuthor}
                          />
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}
          {subnav == "silabus" && (
            <>
              <h2 className="fw-black mb-4 color-dark">
                Daftar Silabus ( {bukuKerja?.silabus?.length} )
              </h2>
              {loading && (
                <>
                  <CardRPPSkeleton count={3} isReadOnly />
                </>
              )}
              {!loading && (
                <>
                  <div className="row gy-4">
                    {bukuKerja?.silabus?.map((d, idx) => {
                      return (
                        <div
                          className="col-md-4"
                          key={`${idx}-${new Date().getTime()}`}
                        >
                          <CardRPP
                            isReadOnly
                            jenjangData={[`${sekolah?.tingkat}`]}
                            mode={d?.moda}
                            dataDb={d}
                            isReadOnlyTingkat={sekolah?.tingkat}
                            isReadOnlyUserAuthor={userAuthor}
                          />
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}
          {subnav == "perangkat" && (
            <>
              <h2 className="fw-black mb-4 color-dark">
                Daftar Perangkat ( {bukuKerja?.perangkat?.length} )
              </h2>
              {loading && (
                <>
                  <CardRPPSkeleton count={3} isReadOnly />
                </>
              )}
              {!loading && (
                <>
                  <div className="row gy-4">
                    {bukuKerja?.perangkat?.map((d, idx) => {
                      return (
                        <div
                          className="col-md-4"
                          key={`${idx}-${new Date().getTime()}`}
                        >
                          <CardRPP
                            isReadOnly
                            jenjangData={[`${sekolah?.tingkat}`]}
                            mode={d?.moda}
                            dataDb={d}
                            isReadOnlyTingkat={sekolah?.tingkat}
                            isReadOnlyUserAuthor={userAuthor}
                          />
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}
          {subnav == "modul" && (
            <>
              <h2 className="fw-black mb-4 color-dark">
                Daftar Modul ( {bukuKerja?.modul?.length} )
              </h2>
              {loading && (
                <>
                  <CardRPPSkeleton count={3} isReadOnly />
                </>
              )}
              {!loading && (
                <>
                  <div className="row gy-4">
                    {bukuKerja?.modul?.map((d, idx) => {
                      return (
                        <div
                          className="col-md-4"
                          key={`${idx}-${new Date().getTime()}`}
                        >
                          <CardRPP
                            isReadOnly
                            jenjangData={[`${sekolah?.tingkat}`]}
                            mode={d?.moda}
                            dataDb={d}
                            isReadOnlyTingkat={sekolah?.tingkat}
                            isReadOnlyUserAuthor={userAuthor}
                          />
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}
          {subnav == "cp" && (
            <>
              <h2 className="fw-black mb-4 color-dark">
                Daftar Capaian Pembelajaran ( {bukuKerja?.cp?.length} )
              </h2>
              {loading && (
                <>
                  <CardRPPSkeleton count={3} isReadOnly />
                </>
              )}
              {!loading && (
                <>
                  <div className="row gy-4">
                    {bukuKerja?.cp?.map((d, idx) => {
                      return (
                        <div
                          className="col-md-4"
                          key={`${idx}-${new Date().getTime()}`}
                        >
                          <CardRPP
                            isReadOnly
                            jenjangData={[`${sekolah?.tingkat}`]}
                            mode={d?.moda}
                            dataDb={d}
                            isReadOnlyTingkat={sekolah?.tingkat}
                            isReadOnlyUserAuthor={userAuthor}
                          />
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}
          {subnav == "atp" && (
            <>
              <h2 className="fw-black mb-4 color-dark">
                Daftar Alur Tujuan Pembelajaran ( {bukuKerja?.atp?.length} )
              </h2>
              {loading && (
                <>
                  <CardRPPSkeleton count={3} isReadOnly />
                </>
              )}
              {!loading && (
                <>
                  <div className="row gy-4">
                    {bukuKerja?.atp?.map((d, idx) => {
                      return (
                        <div
                          className="col-md-4"
                          key={`${idx}-${new Date().getTime()}`}
                        >
                          <CardRPP
                            isReadOnly
                            jenjangData={[`${sekolah?.tingkat}`]}
                            mode={d?.moda}
                            dataDb={d}
                            isReadOnlyTingkat={sekolah?.tingkat}
                            isReadOnlyUserAuthor={userAuthor}
                          />
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default BukuKerja;
