export const hideModal = (modalId) => {
  const modal = document.getElementById(modalId);
  new bootstrap.Modal(modal, {
    keyboard: false,
    backdrop: "static"
  }).hide();

  modal.classList.remove("show");
  modal.style = "display: none";

  const modalBackdrop = document.querySelectorAll(".modal-backdrop") || [];
  const modalOpen = document.querySelectorAll(".modal-open") || [];

  for (let i=0; i < modalBackdrop.length; i++) {
    modalBackdrop[i].className = "";
  }

  for (let i=0; i < modalOpen.length; i++) {
    modalOpen[i].className = "";
  }

  // if (document.getElementsByClassName("modal-backdrop").length)
  //   document.getElementsByClassName("modal-backdrop")[0].className = "";
  // if (document.getElementsByClassName("modal-open").length)
  //   document.getElementsByClassName("modal-open")[0].className = "";
};


export const showModal = (modalId) => {
  const modal = document.getElementById(modalId);
  new bootstrap.Modal(modal, {
    keyboard: false,
    backdrop: "static"
  }).show();
}