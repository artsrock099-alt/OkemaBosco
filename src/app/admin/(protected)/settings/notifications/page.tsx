import { getNotificationPreferences, NOTIFICATION_LABELS, NOTIFICATION_TYPES } from '@/lib/notifications';
import { saveNotificationPreferences } from './actions';

export const metadata = { title: 'Notification preferences' };

export default async function NotificationPreferencesPage() {
  const preferences = await getNotificationPreferences();

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
          Settings
        </div>
        <h1 className="font-display text-headline-lg text-on-surface tracking-tight">
          Notification preferences
        </h1>
        <p className="font-body text-body-md text-on-surface-variant mt-2">
          Choose how each kind of event reaches you. Dashboard notifications appear behind the bell
          in the header; email notifications are sent to the configured admin address.
        </p>
      </div>

      <form action={saveNotificationPreferences} className="space-y-6">
        <div className="card-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body text-body-md min-w-[640px]">
              <thead className="font-label text-label-sm text-on-surface-variant bg-surface-container/50 border-b border-earth-brown/10">
                <tr>
                  <th className="py-3 px-6 font-normal">Event</th>
                  <th className="py-3 px-6 font-normal text-center">Dashboard</th>
                  <th className="py-3 px-6 font-normal text-center">Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-earth-brown/10">
                {NOTIFICATION_TYPES.map((type) => {
                  const meta = NOTIFICATION_LABELS[type];
                  const value = preferences[type];
                  const locked = type === 'SECURITY';
                  return (
                    <tr key={type}>
                      <td className="py-4 px-6">
                        <div className="text-on-surface">{meta.label}</div>
                        <div className="font-body text-body-sm text-on-surface-variant">
                          {meta.description}
                        </div>
                        {locked && (
                          <div className="font-label text-[10px] uppercase tracking-widest text-muted-ochre mt-1">
                            Always on
                          </div>
                        )}
                      </td>
                      {(['dashboard', 'email'] as const).map((channel) => (
                        <td key={channel} className="py-4 px-6 text-center">
                          <input
                            type="checkbox"
                            name={`${channel}:${type}`}
                            defaultChecked={value[channel]}
                            disabled={locked}
                            className="w-5 h-5 accent-muted-ochre disabled:opacity-60"
                            aria-label={`${meta.label} by ${channel}`}
                          />
                          {locked && (
                            <input type="hidden" name={`${channel}:${type}`} value="on" />
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" className="btn-primary !px-8">
            SAVE PREFERENCES
          </button>
          <p className="font-body text-body-sm text-on-surface-variant">
            Security alerts cannot be turned off: they are how you find out about unexpected
            sign-ins.
          </p>
        </div>
      </form>
    </div>
  );
}
