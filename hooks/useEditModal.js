import create from "zustand";

const useEditModal = create((set) => ({
  editModal: {},
  setEditModal: (id, editModalData) => set(state => ({editModal: {...state.editModal, [id]: editModalData}})),
}));

export default useEditModal;
