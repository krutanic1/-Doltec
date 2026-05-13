import create from 'zustand';

const usePropertiesStore = create((set, get) => ({
  byId: {},
  lists: {},
  setProperty: (prop) => set((s) => ({ byId: { ...s.byId, [prop._id]: prop } })),
  setList: (key, ids, hasMore = false, cursor = null) =>
    set((s) => ({ lists: { ...s.lists, [key]: { ids, hasMore, cursor } } })),
  appendToList: (key, ids, cursor = null) =>
    set((s) => {
      const existing = s.lists[key] || { ids: [], hasMore: true };
      const newIds = [...existing.ids, ...ids.filter((id) => !existing.ids.includes(id))];
      return { lists: { ...s.lists, [key]: { ids: newIds, hasMore: ids.length > 0, cursor } } };
    }),
}));

export default usePropertiesStore;
