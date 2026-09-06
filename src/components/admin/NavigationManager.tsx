'use client';

import { useState } from 'react';

type NavItem = {
  id: string;
  label: string;
  url: string;
  isExternal: boolean;
  order: number;
  isVisible: boolean;
  parentId: string | null;
};

type Nav = {
  id: string;
  name: string;
  location: string;
  items: NavItem[];
};

type Props = {
  navigations: Nav[];
};

export default function NavigationManager({ navigations: initialNavs }: Props) {
  const [navs, setNavs] = useState<Nav[]>(initialNavs);
  const [activeNavId, setActiveNavId] = useState(initialNavs[0]?.id || '');
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState<NavItem | null>(null);

  const activeNav = navs.find((n) => n.id === activeNavId) || navs[0];
  const sortedItems = activeNav
    ? [...activeNav.items].sort((a, b) => a.order - b.order)
    : [];

  const saveItem = async (data: Partial<NavItem>, isNew: boolean, existingId?: string) => {
    if (!activeNav) return;
    try {
      if (isNew) {
        const res = await fetch('/api/admin/navigation/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, navigationId: activeNav.id }),
        });
        const json = await res.json();
        const newItem: NavItem = {
          id: json.id || Math.random().toString(36).slice(2),
          label: data.label || 'Untitled',
          url: data.url || '/',
          isExternal: data.isExternal || false,
          order: data.order ?? 0,
          isVisible: data.isVisible !== false,
          parentId: data.parentId || null,
        };
        setNavs((prev) =>
          prev.map((n) =>
            n.id === activeNav.id ? { ...n, items: [...n.items, newItem] } : n
          )
        );
      } else if (existingId) {
        setNavs((prev) =>
          prev.map((n) =>
            n.id === activeNav.id
              ? {
                  ...n,
                  items: n.items.map((i) =>
                    i.id === existingId ? { ...i, ...data } : i
                  ),
                }
              : n
          )
        );
      }
    } catch (e) {
      if (isNew) {
        const newItem: NavItem = {
          id: Math.random().toString(36).slice(2),
          label: data.label || 'Untitled',
          url: data.url || '/',
          isExternal: data.isExternal || false,
          order: data.order ?? sortedItems.length,
          isVisible: data.isVisible !== false,
          parentId: data.parentId || null,
        };
        setNavs((prev) =>
          prev.map((n) =>
            n.id === activeNav.id ? { ...n, items: [...n.items, newItem] } : n
          )
        );
      } else if (existingId) {
        setNavs((prev) =>
          prev.map((n) =>
            n.id === activeNav.id
              ? {
                  ...n,
                  items: n.items.map((i) =>
                    i.id === existingId ? { ...i, ...data } : i
                  ),
                }
              : n
          )
        );
      }
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this navigation item?')) return;
    try {
      await fetch(`/api/admin/navigation/items/${id}`, { method: 'DELETE' });
    } catch (e) {}
    setNavs((prev) =>
      prev.map((n) =>
        n.id === activeNav.id ? { ...n, items: n.items.filter((i) => i.id !== id) } : n
      )
    );
  };

  const moveItem = (id: string, dir: -1 | 1) => {
    setNavs((prev) =>
      prev.map((n) => {
        if (n.id !== activeNav.id) return n;
        const items = [...n.items].sort((a, b) => a.order - b.order);
        const idx = items.findIndex((i) => i.id === id);
        const swapIdx = idx + dir;
        if (idx < 0 || swapIdx < 0 || swapIdx >= items.length) return n;
        const tmp = items[idx].order;
        items[idx].order = items[swapIdx].order;
        items[swapIdx].order = tmp;
        return { ...n, items };
      })
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b border-earth-brown/10 pb-2">
        {navs.map((n) => (
          <button
            key={n.id}
            onClick={() => setActiveNavId(n.id)}
            className={`px-4 py-2 font-label text-label-sm uppercase tracking-widest transition-colors ${
              activeNavId === n.id
                ? 'text-muted-ochre border-b-2 border-muted-ochre -mb-[2px]'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {n.name} <span className="opacity-60 text-[10px]">({n.items.length})</span>
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center flex-wrap gap-3">
        <p className="font-body text-body-md text-on-surface-variant">
          Manage the <strong className="text-on-surface">{activeNav?.name}</strong> navigation — reorder, rename, show/hide and add links.
        </p>
        <button
          onClick={() => {
            setEditingItem(null);
            setShowItemForm(true);
          }}
          className="px-4 py-2.5 bg-deep-charcoal text-warm-ivory font-label text-label-sm hover:bg-muted-ochre transition-colors uppercase tracking-widest rounded"
        >
          + Add Link
        </button>
      </div>

      {showItemForm && !editingItem && (
        <NavItemForm
          onClose={() => setShowItemForm(false)}
          onSave={(data) => {
            saveItem(data, true);
            setShowItemForm(false);
          }}
          nextOrder={sortedItems.length}
        />
      )}

      {editingItem && (
        <NavItemForm
          initial={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={(data) => {
            saveItem(data, false, editingItem.id);
            setEditingItem(null);
          }}
        />
      )}

      <div className="card-surface overflow-hidden divide-y divide-earth-brown/10">
        {sortedItems.length === 0 ? (
          <div className="py-16 text-center text-on-surface-variant">
            No navigation items yet. Add your first link above.
          </div>
        ) : (
          sortedItems.map((item, idx) => (
            <div
              key={item.id}
              className={`p-5 flex items-center gap-4 hover:bg-surface-container/30 transition-colors ${!item.isVisible ? 'opacity-50' : ''}`}
            >
              <div className="flex flex-col gap-1 text-on-surface-variant">
                <button
                  onClick={() => moveItem(item.id, -1)}
                  disabled={idx === 0}
                  className="hover:text-muted-ochre disabled:opacity-30 disabled:cursor-not-allowed leading-none p-1"
                >
                  ▲
                </button>
                <button
                  onClick={() => moveItem(item.id, 1)}
                  disabled={idx === sortedItems.length - 1}
                  className="hover:text-muted-ochre disabled:opacity-30 disabled:cursor-not-allowed leading-none p-1"
                >
                  ▼
                </button>
              </div>
              <div className="w-10 h-10 rounded-full bg-muted-ochre/10 border border-muted-ochre/20 flex items-center justify-center flex-shrink-0 font-label text-[10px] text-muted-ochre">
                #{item.order}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-on-surface">{item.label}</span>
                  {item.isExternal && (
                    <span className="px-1.5 py-0.5 bg-surface-container-high text-on-surface-variant font-label text-[9px] rounded uppercase tracking-wider">
                      External
                    </span>
                  )}
                  {!item.isVisible && (
                    <span className="px-1.5 py-0.5 bg-surface-container-high text-on-surface-variant font-label text-[9px] rounded uppercase tracking-wider">
                      Hidden
                    </span>
                  )}
                </div>
                <div className="font-label text-label-sm text-on-surface-variant mt-1 truncate">
                  {item.url}
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={() => setEditingItem(item)}
                  className="text-muted-ochre hover:text-earth-brown font-label text-label-sm uppercase tracking-widest"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="text-error hover:opacity-80 font-label text-label-sm uppercase tracking-widest"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function NavItemForm({
  initial,
  onClose,
  onSave,
  nextOrder,
}: {
  initial?: NavItem;
  onClose: () => void;
  onSave: (data: Partial<NavItem>) => void;
  nextOrder?: number;
}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onSave({
      label: fd.get('label') as string,
      url: fd.get('url') as string,
      isExternal: fd.get('isExternal') === 'on',
      order: parseInt(fd.get('order') as string) || 0,
      isVisible: fd.get('isVisible') !== 'off',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card-surface p-6 space-y-5 border-2 border-muted-ochre/20">
      <div className="flex justify-between items-center">
        <h3 className="font-headline text-headline-md text-on-surface">
          {initial ? 'Edit Navigation Item' : 'New Navigation Item'}
        </h3>
        <button type="button" onClick={onClose} className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-on-surface">
          ✕ Close
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">Label *</label>
          <input name="label" type="text" defaultValue={initial?.label} required className="input-field" placeholder="e.g. Home" />
        </div>
        <div>
          <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">URL / Path *</label>
          <input name="url" type="text" defaultValue={initial?.url} required className="input-field" placeholder="/about or https://..." />
        </div>
        <div>
          <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">Sort Order</label>
          <input name="order" type="number" defaultValue={initial?.order ?? nextOrder ?? 0} className="input-field" />
        </div>
        <div className="flex items-end gap-5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input name="isExternal" type="checkbox" defaultChecked={initial?.isExternal} className="w-4 h-4 accent-earth-brown" />
            <span className="font-body text-body-md text-on-surface">External link</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input name="isVisible" type="checkbox" defaultChecked={initial?.isVisible !== false} className="w-4 h-4 accent-earth-brown" />
            <span className="font-body text-body-md text-on-surface">Visible</span>
          </label>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-3 border-t border-earth-brown/10">
        <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
        <button type="submit" className="btn-primary !px-8">{initial ? 'Update' : 'Add Item'}</button>
      </div>
    </form>
  );
}
