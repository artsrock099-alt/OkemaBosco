'use client';

import { useState } from 'react';
import { formatDateShort } from '@/lib/utils';

type User = {
  id: string;
  name: string | null;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'CONTRIBUTOR';
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
};

const roleColors: Record<string, string> = {
  SUPER_ADMIN: 'bg-earth-brown/20 text-earth-brown border border-earth-brown/30',
  ADMIN: 'bg-muted-ochre/20 text-earth-brown border border-muted-ochre/30',
  EDITOR: 'bg-surface-container-high text-on-surface-variant border border-earth-brown/20',
  CONTRIBUTOR: 'bg-warm-ivory text-on-surface-variant border border-earth-brown/10',
};

const roleDescriptions: Record<string, string> = {
  SUPER_ADMIN: 'Full access, user management',
  ADMIN: 'Full CMS access, no user management',
  EDITOR: 'Content creation, publishing, media',
  CONTRIBUTOR: 'Content creation only',
};

export default function UsersManager({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    try {
      await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    } catch (e) {}
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const handleSave = (user: User) => {
    setUsers((prev) => {
      const exists = prev.find((u) => u.id === user.id);
      if (exists) {
        return prev.map((u) => (u.id === user.id ? user : u));
      }
      return [user, ...prev];
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'CONTRIBUTOR'] as const).map((role) => (
          <div key={role} className="card-surface p-4">
            <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">{role.replace('_', ' ')}</div>
            <div className="font-display text-headline-md text-on-surface">
              {users.filter((u) => u.role === role).length}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center flex-wrap gap-3">
        <p className="font-body text-body-md text-on-surface-variant">
          Manage team members and their permission levels.
        </p>
        <button
          onClick={() => {
            setEditingUser(null);
            setShowForm(true);
          }}
          className="px-4 py-2.5 bg-deep-charcoal text-warm-ivory font-label text-label-sm hover:bg-muted-ochre transition-colors uppercase tracking-widest rounded"
        >
          + Invite User
        </button>
      </div>

      {showForm && !editingUser && (
        <UserForm
          onClose={() => setShowForm(false)}
          onSave={(u) => {
            handleSave(u);
            setShowForm(false);
          }}
        />
      )}

      {editingUser && (
        <UserForm
          initial={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={(u) => {
            handleSave(u);
            setEditingUser(null);
          }}
        />
      )}

      <div className="card-surface overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-left font-body text-body-md min-w-[720px]">
          <thead className="font-label text-label-sm text-on-surface-variant bg-surface-container/50 border-b border-earth-brown/10">
            <tr>
              <th className="py-3 px-6 font-normal">User</th>
              <th className="py-3 px-6 font-normal">Role</th>
              <th className="py-3 px-6 font-normal">Added</th>
              <th className="py-3 px-6 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-earth-brown/10">
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-16 text-center text-on-surface-variant">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-surface-container/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted-ochre/15 border border-muted-ochre/30 flex items-center justify-center flex-shrink-0">
                        <span className="font-headline text-muted-ochre text-body-md leading-none">
                          {(u.name || u.email).charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-on-surface">{u.name || '—'}</div>
                        <div className="font-label text-label-sm text-on-surface-variant truncate">
                          {u.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <span className={`inline-block px-2 py-1 font-label text-[10px] rounded uppercase tracking-wider ${roleColors[u.role] || roleColors.CONTRIBUTOR}`}>
                        {u.role}
                      </span>
                      <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-2">
                        {roleDescriptions[u.role]}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-on-surface-variant">{formatDateShort(u.createdAt)}</td>
                  <td className="py-4 px-6 text-right space-x-3">
                    <button
                      onClick={() => setEditingUser(u)}
                      className="text-muted-ochre hover:text-earth-brown font-label text-label-sm uppercase tracking-widest"
                    >
                      Edit
                    </button>
                    {u.role !== 'SUPER_ADMIN' && (
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="text-error hover:opacity-80 font-label text-label-sm uppercase tracking-widest"
                      >
                        Remove
                      </button>
                    )}
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

function UserForm({
  initial,
  onClose,
  onSave,
}: {
  initial?: User;
  onClose: () => void;
  onSave: (u: User) => void;
}) {
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = fd.get('email') as string;
    const name = fd.get('name') as string;
    const role = fd.get('role') as User['role'];

    if (!email) {
      setMsg({ type: 'err', text: 'Email is required.' });
      return;
    }
    if (!initial && !fd.get('password')) {
      setMsg({ type: 'err', text: 'Password is required for new users.' });
      return;
    }

    try {
      const res = await fetch(initial ? `/api/admin/users/${initial.id}` : '/api/admin/users', {
        method: initial ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          role,
          password: fd.get('password'),
        }),
      });
      const data = await res.json();
      if (res.ok || data.success) {
        setMsg({ type: 'ok', text: 'User saved successfully.' });
        setTimeout(() => {
          onSave({
            id: data.id || initial?.id || Math.random().toString(36).slice(2),
            name,
            email,
            role,
            image: null,
            createdAt: initial?.createdAt || new Date(),
            updatedAt: new Date(),
          });
        }, 500);
      } else {
        setMsg({ type: 'err', text: data.message || 'Failed to save user.' });
      }
    } catch (err) {
      onSave({
        id: initial?.id || Math.random().toString(36).slice(2),
        name,
        email,
        role,
        image: null,
        createdAt: initial?.createdAt || new Date(),
        updatedAt: new Date(),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-surface p-6 space-y-5 border-2 border-muted-ochre/20">
      <div className="flex justify-between items-center">
        <h3 className="font-headline text-headline-md text-on-surface">
          {initial ? 'Edit User' : 'Invite New User'}
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
          <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">Full Name</label>
          <input name="name" type="text" defaultValue={initial?.name || undefined} className="input-field" placeholder="John Doe" />
        </div>
        <div>
          <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">Email *</label>
          <input name="email" type="email" defaultValue={initial?.email} required className="input-field" placeholder="john@example.com" />
        </div>
        <div>
          <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">Role</label>
          <select name="role" defaultValue={initial?.role || 'EDITOR'} className="input-field">
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="ADMIN">Admin</option>
            <option value="EDITOR">Editor</option>
            <option value="CONTRIBUTOR">Contributor</option>
          </select>
        </div>
        <div>
          <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
            {initial ? 'New Password (leave blank to keep)' : 'Password *'}
          </label>
          <input name="password" type="password" className="input-field" placeholder="••••••••" />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-3 border-t border-earth-brown/10">
        <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
        <button type="submit" className="btn-primary !px-8">{initial ? 'Update User' : 'Create User'}</button>
      </div>
    </form>
  );
}
