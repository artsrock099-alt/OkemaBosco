'use client';

import { useState } from 'react';
import { formatDateShort } from '@/lib/utils';

type TaxonomyItem = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  count?: number;
};

type Props = {
  resourceLabel: { singular: string; plural: string; icon: string };
  endpoint: string;
  initialItems: TaxonomyItem[];
  description?: string;
  extraFields?: { name: string; label: string; type: 'text' | 'color' }[];
};

export default function TaxonomyManager({
  resourceLabel,
  initialItems,
  endpoint,
  description,
  extraFields = [],
}: Props) {
  const [items, setItems] = useState<TaxonomyItem[]>(initialItems);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = items.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.slug.toLowerCase().includes(search.toLowerCase())
  );

  const nameToSlug = (n: string) =>
    n
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  const handleSave = (data: any, isNew: boolean, existingId?: string) => {
    if (isNew) {
      const newItem: TaxonomyItem = {
        id: Math.random().toString(36).slice(2),
        name: data.name,
        slug: data.slug || nameToSlug(data.name),
        createdAt: new Date(),
        updatedAt: new Date(),
        count: 0,
      };
      setItems((prev) => [newItem, ...prev]);
    } else if (existingId) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === existingId
            ? { ...i, name: data.name, slug: data.slug || nameToSlug(data.name), updatedAt: new Date() }
            : i
        )
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Delete this ${resourceLabel.singular.toLowerCase()}?`)) return;
    try {
      await fetch(`/api/admin/${endpoint}/${id}`, { method: 'DELETE' });
    } catch (e) {}
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="space-y-6">
      {description && (
        <p className="font-body text-body-md text-on-surface-variant max-w-2xl">{description}</p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 min-w-[300px]">
          <div className="card-surface p-4 md:col-span-1">
            <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
              Total
            </div>
            <div className="font-display text-headline-lg text-on-surface">{items.length}</div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${resourceLabel.plural.toLowerCase()}...`}
            className="input-field !w-64"
          />
          <button
            onClick={() => {
              setEditingId(null);
              setShowForm(true);
            }}
            className="px-4 py-2.5 bg-deep-charcoal text-warm-ivory font-label text-label-sm hover:bg-muted-ochre transition-colors uppercase tracking-widest rounded"
          >
            + Add {resourceLabel.singular}
          </button>
        </div>
      </div>

      {showForm && !editingId && (
        <TaxonomyForm
          resourceLabel={resourceLabel}
          extraFields={extraFields}
          onClose={() => setShowForm(false)}
          onSave={(data) => {
            handleSave(data, true);
            setShowForm(false);
          }}
        />
      )}

      {editingId && (
        <TaxonomyForm
          initial={items.find((i) => i.id === editingId)}
          resourceLabel={resourceLabel}
          extraFields={extraFields}
          onClose={() => setEditingId(null)}
          onSave={(data) => {
            handleSave(data, false, editingId);
            setEditingId(null);
          }}
        />
      )}

      <div className="card-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body text-body-md min-w-[640px]">
            <thead className="font-label text-label-sm text-on-surface-variant bg-surface-container/50 border-b border-earth-brown/10">
              <tr>
                <th className="py-3 px-6 font-normal">{resourceLabel.singular}</th>
                <th className="py-3 px-6 font-normal">Slug</th>
                {items.some((i) => i.count !== undefined) && (
                  <th className="py-3 px-6 font-normal">Items</th>
                )}
                <th className="py-3 px-6 font-normal">Updated</th>
                <th className="py-3 px-6 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-brown/10">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={items.some((i) => i.count !== undefined) ? 5 : 4}
                    className="py-16 text-center text-on-surface-variant"
                  >
                    No {resourceLabel.plural.toLowerCase()} yet. Add your first above.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-container/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted-ochre/10 border border-muted-ochre/20 flex items-center justify-center text-sm">
                          {resourceLabel.icon}
                        </div>
                        <span className="font-medium text-on-surface">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-mono text-[12px] text-muted-ochre bg-muted-ochre/5 px-2 py-1 rounded">
                        /{item.slug}
                      </span>
                    </td>
                    {items.some((i) => i.count !== undefined) && (
                      <td className="py-4 px-6 text-on-surface-variant">{item.count ?? 0}</td>
                    )}
                    <td className="py-4 px-6 text-on-surface-variant">
                      {formatDateShort(item.updatedAt)}
                    </td>
                    <td className="py-4 px-6 text-right space-x-3">
                      <button
                        onClick={() => setEditingId(item.id)}
                        className="text-muted-ochre hover:text-earth-brown font-label text-label-sm uppercase tracking-widest"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-error hover:opacity-80 font-label text-label-sm uppercase tracking-widest"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TaxonomyForm({
  initial,
  resourceLabel,
  extraFields,
  onClose,
  onSave,
}: {
  initial?: any;
  resourceLabel: { singular: string; plural: string; icon: string };
  extraFields: { name: string; label: string; type: 'text' | 'color' }[];
  onClose: () => void;
  onSave: (data: Record<string, string>) => void;
}) {
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const nameToSlug = (n: string) =>
    n
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    fd.forEach((v, k) => (data[k] = v as string));
    if (!data.name) {
      setMsg({ type: 'err', text: 'Name is required.' });
      return;
    }
    if (!data.slug) data.slug = nameToSlug(data.name);
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit} className="card-surface p-6 space-y-5 border-2 border-muted-ochre/20">
      <div className="flex justify-between items-center">
        <h3 className="font-headline text-headline-md text-on-surface">
          {initial ? `Edit ${resourceLabel.singular}` : `New ${resourceLabel.singular}`}
        </h3>
        <button type="button" onClick={onClose} className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-on-surface">
          ✕ Close
        </button>
      </div>
      {msg && (
        <div className={`p-3 rounded font-body text-sm ${msg.type === 'ok' ? 'bg-earth-brown/10 text-earth-brown' : 'bg-error-container text-on-error-container'}`}>
          {msg.text}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
            Name *
          </label>
          <input name="name" type="text" defaultValue={initial?.name} required className="input-field" placeholder={resourceLabel.singular} />
        </div>
        <div>
          <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
            Slug (auto-generated)
          </label>
          <input name="slug" type="text" defaultValue={initial?.slug} className="input-field font-mono text-sm" />
        </div>
        {extraFields.map((f) => (
          <div key={f.name}>
            <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
              {f.label}
            </label>
            <input name={f.name} type={f.type} defaultValue={initial?.[f.name] || ''} className={f.type === 'color' ? '!p-1 h-[50px] w-24 input-field' : 'input-field'} />
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-3 pt-3 border-t border-earth-brown/10">
        <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
        <button type="submit" className="btn-primary !px-8">{initial ? 'Update' : `Add ${resourceLabel.singular}`}</button>
      </div>
    </form>
  );
}
