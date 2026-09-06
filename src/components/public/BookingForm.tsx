'use client';

import { useState } from 'react';
import { bookingSchema } from '@/lib/validations';
import { cn } from '@/lib/utils';

type Step = 1 | 2 | 3 | 4 | 5;
type BookingType =
  | 'LIVE_PERFORMANCE'
  | 'SCHOOL_RESIDENCY'
  | 'ELDERLY_VISIT'
  | 'CULTURAL_PRESENTATION'
  | 'WORKSHOP'
  | 'FESTIVAL'
  | 'PRIVATE_EVENT'
  | 'OTHER';

const bookingOptions: { value: BookingType; title: string; description: string; icon: string }[] = [  {
    value: 'LIVE_PERFORMANCE',
    title: 'Live Performance',
    description:
      'Solo, small ensemble or full band sets for festivals, venues, concerts and cultural events.',
    icon: '🎤',
  },
  {
    value: 'SCHOOL_RESIDENCY',
    title: 'School Residency',
    description:
      'Educational workshops introducing Ugandan music, instruments and storytelling to students.',
    icon: '🎒',
  },
  {
    value: 'ELDERLY_VISIT',
    title: 'Community / Elderly Visit',
    description:
      'Intimate, interactive musical sessions designed for senior living communities and centers.',
    icon: '🤎',
  },
  {
    value: 'CULTURAL_PRESENTATION',
    title: 'Cultural Presentation',
    description:
      'Talks, demonstrations and performances introducing Ugandan culture to any audience.',
    icon: '🌍',
  },
  {
    value: 'WORKSHOP',
    title: 'Workshop',
    description:
      'Hands-on workshops in Adungu, percussion, singing, rhythm, or cultural listening.',
    icon: '🎶',
  },
  {
    value: 'FESTIVAL',
    title: 'Festival',
    description: 'Full performances for festivals, cultural days, and large outdoor events.',
    icon: '🎪',
  },
  {
    value: 'PRIVATE_EVENT',
    title: 'Private Event',
    description: 'Weddings, parties, galas, fundraisers, celebrations and intimate gatherings.',
    icon: '✨',
  },
  {
    value: 'OTHER',
    title: 'Other Inquiry',
    description: 'Press, collaborations, residencies, commissions, or anything not listed above.',
    icon: '💬',
  },
];

const budgetOptions: { value: string; label: string }[] = [
  { value: '', label: 'Not sure yet' },
  { value: '500000', label: 'Under UGX 500,000' },
  { value: '1500000', label: 'UGX 500,000 – 2M' },
  { value: '5000000', label: 'UGX 2M – 5M' },
  { value: '10000000', label: 'UGX 5M – 10M' },
  { value: '10000001', label: 'Above UGX 10M' },
];

export default function BookingForm() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<Record<string, any>>({
    type: '',
    eventDate: '',
    alternativeDate: '',
    venue: '',
    location: '',
    expectedAudience: '',
    eventDescription: '',
    budget: '',
    customerName: '',
    organization: '',
    customerEmail: '',
    customerPhone: '',
    additionalInfo: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [reference, setReference] = useState('');

  const progress = ((step - 1) / 4) * 100;

  function updateField(key: string, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  }

  function validateStep(s: Step): boolean {
    if (s === 1 && !form.type) {
      setErrors({ type: 'Please select a booking type' });
      return false;
    }
    if (s === 2) {
      if (!form.eventDate || !form.venue || !form.location) {
        setErrors({
          eventDate: !form.eventDate ? 'Date is required' : '',
          venue: !form.venue ? 'Venue name is required' : '',
          location: !form.location ? 'City / location is required' : '',
        });
        return false;
      }
    }
    if (s === 3) {
      if (!form.customerName || !form.customerEmail) {
        setErrors({
          customerName: !form.customerName ? 'Name is required' : '',
          customerEmail: !form.customerEmail ? 'Email is required' : '',
        });
        return false;
      }
    }
    setErrors({});
    return true;
  }

  async function handleSubmit() {
    // Drop empty/optional fields so date/budget coercion doesn't fail on ''
    const cleaned = Object.fromEntries(
      Object.entries(form).filter(([, v]) => v !== '' && v != null)
    );
    const parsed = bookingSchema.safeParse(cleaned);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0]?.toString() || '';
        errs[key] = issue.message;
      });
      setErrors(errs);
      setStep(1);
      return;
    }

    setState('loading');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        setReference(data.reference || '');
        setState('success');
      } else {
        setErrors({ _form: 'Submission failed. Please try again.' });
        setState('idle');
      }
    } catch {
      setErrors({ _form: 'Network error. Please try again.' });
      setState('idle');
    }
  }

  if (state === 'success') {
    return (
      <div className="text-center py-8 md:py-12">
        <div className="w-20 h-20 rounded-full bg-earth-brown/10 text-muted-ochre flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface mb-4 leading-tight">
          Thank you — request received!
        </h2>
        {reference && (
          <div className="inline-block px-4 py-2 bg-surface-container rounded mb-6">
            <span className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant">
              Reference:{' '}
            </span>
            <span className="font-headline text-headline-md text-muted-ochre">{reference}</span>
          </div>
        )}
        <p className="font-body text-body-md md:text-body-lg text-on-surface-variant max-w-lg mx-auto mb-6">
          I will review the details and respond within 2–3 business days with availability,
          suggested formats and pricing.
        </p>
        <p className="font-body text-body-md text-on-surface-variant mb-10">
          If this is urgent, you can also reach me directly at{' '}
          <a href="mailto:hello@boscookema.com" className="text-muted-ochre hover:underline">
            hello@boscookema.com
          </a>
          .
        </p>
        <button
          onClick={() => {
            setState('idle');
            setStep(1);
            setForm({
              type: '',
              eventDate: '',
              alternativeDate: '',
              venue: '',
              location: '',
              expectedAudience: '',
              eventDescription: '',
              budget: '',
              customerName: '',
              organization: '',
              customerEmail: '',
              customerPhone: '',
              additionalInfo: '',
            });
            setReference('');
          }}
          className="btn-ghost"
        >
          SUBMIT ANOTHER REQUEST →
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-10 md:mb-14 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-outline-variant z-0" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-earth-brown z-0 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
        {[1, 2, 3, 4].map((s, i) => {
          const labels = ['Service', 'Details', 'Contact', 'Budget'];
          const isActive = step >= s;
          return (
            <div key={s} className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center font-label text-label-sm border-2 border-surface shadow-sm transition-all',
                  isActive
                    ? 'bg-earth-brown text-warm-ivory'
                    : 'bg-surface-container-high text-on-surface-variant'
                )}
              >
                {s}
              </div>
              <span
                className={cn(
                  'font-label text-label-sm uppercase tracking-widest hidden md:block whitespace-nowrap',
                  isActive ? 'text-earth-brown' : 'text-on-surface-variant opacity-50'
                )}
              >
                {labels[i]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step 1: Type */}
      {step === 1 && (
        <div className="animate-fade-in">
          <h2 className="font-headline text-headline-md md:text-headline-lg text-on-surface mb-2 pb-4 border-b border-earth-brown/10 inline-block">
            What would you like to book?
          </h2>
          {errors.type && <p className="text-error font-body text-sm mt-2 mb-6">{errors.type}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 my-8">
            {bookingOptions.map((opt) => {
              const checked = form.type === opt.value;
              return (
                <label key={opt.value} className="cursor-pointer group relative block h-full">
                  <input
                    type="radio"
                    name="type"
                    value={opt.value}
                    checked={checked}
                    onChange={() => updateField('type', opt.value)}
                    className="peer sr-only"
                  />
                  <div
                    className={cn(
                      'h-full p-5 md:p-6 bg-surface border transition-all duration-300 relative overflow-hidden flex flex-col gap-3 group-hover:border-earth-brown/50',
                      checked
                        ? 'border-earth-brown bg-surface-bright'
                        : 'border-earth-brown/20'
                    )}
                  >
                    <div className="absolute top-4 right-4 w-5 h-5 rounded-full border border-earth-brown flex items-center justify-center">
                      <div
                        className={cn(
                          'w-2 h-2 rounded-full bg-warm-ivory transition-opacity',
                          checked ? 'bg-earth-brown opacity-100' : 'opacity-0'
                        )}
                      />
                    </div>
                    <div className="text-3xl">{opt.icon}</div>
                    <div>
                      <h3 className="font-headline text-body-lg text-on-surface mb-1">
                        {opt.title}
                      </h3>
                      <p className="font-body text-body-md text-on-surface-variant">
                        {opt.description}
                      </p>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
          <div className="flex justify-end pt-4">
            <button
              onClick={() => {
                if (validateStep(1)) setStep(2);
              }}
              className="btn-primary !px-8"
            >
              Next Step →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Event details */}
      {step === 2 && (
        <div className="animate-fade-in">
          <h2 className="font-headline text-headline-md md:text-headline-lg text-on-surface mb-8 pb-4 border-b border-earth-brown/10 inline-block">
            Tell me about your event.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                Proposed Date *
              </label>
              <input
                type="date"
                value={form.eventDate}
                onChange={(e) => updateField('eventDate', e.target.value)}
                className="input-field"
              />
              {errors.eventDate && <p className="mt-2 text-sm text-error">{errors.eventDate}</p>}
            </div>
            <div>
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                Alternative Date
              </label>
              <input
                type="date"
                value={form.alternativeDate}
                onChange={(e) => updateField('alternativeDate', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                Expected Audience
              </label>
              <select
                value={form.expectedAudience}
                onChange={(e) => updateField('expectedAudience', e.target.value)}
                className="input-field appearance-none"
              >
                <option value="">Select size</option>
                <option value="Under 50">Intimate (Under 50)</option>
                <option value="50-200">Medium (50–200)</option>
                <option value="200-500">Large (200–500)</option>
                <option value="500+">Festival / 500+</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                Venue Name *
              </label>
              <input
                type="text"
                value={form.venue}
                onChange={(e) => updateField('venue', e.target.value)}
                placeholder="e.g. The National Theatre, Kampala"
                className="input-field"
              />
              {errors.venue && <p className="mt-2 text-sm text-error">{errors.venue}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                City / Location *
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => updateField('location', e.target.value)}
                placeholder="e.g. Kampala, Uganda"
                className="input-field"
              />
              {errors.location && <p className="mt-2 text-sm text-error">{errors.location}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                Brief Description of Event
              </label>
              <textarea
                value={form.eventDescription}
                onChange={(e) => updateField('eventDescription', e.target.value)}
                rows={4}
                className="input-field resize-none"
                placeholder="Tell me a bit more about the vibe, the purpose, and what you are hoping for..."
              />
            </div>
          </div>
          <div className="flex justify-between items-center pt-8 mt-4">
            <button onClick={() => setStep(1)} className="btn-ghost">
              ← Back
            </button>
            <button
              onClick={() => {
                if (validateStep(2)) setStep(3);
              }}
              className="btn-primary !px-8"
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Contact */}
      {step === 3 && (
        <div className="animate-fade-in">
          <h2 className="font-headline text-headline-md md:text-headline-lg text-on-surface mb-8 pb-4 border-b border-earth-brown/10 inline-block">
            Your contact details.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={form.customerName}
                onChange={(e) => updateField('customerName', e.target.value)}
                className="input-field"
              />
              {errors.customerName && (
                <p className="mt-2 text-sm text-error">{errors.customerName}</p>
              )}
            </div>
            <div>
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                Organization / School / Venue
              </label>
              <input
                type="text"
                value={form.organization}
                onChange={(e) => updateField('organization', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                Email *
              </label>
              <input
                type="email"
                value={form.customerEmail}
                onChange={(e) => updateField('customerEmail', e.target.value)}
                className="input-field"
              />
              {errors.customerEmail && (
                <p className="mt-2 text-sm text-error">{errors.customerEmail}</p>
              )}
            </div>
            <div>
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={form.customerPhone}
                onChange={(e) => updateField('customerPhone', e.target.value)}
                className="input-field"
              />
            </div>
          </div>
          <div className="flex justify-between items-center pt-8 mt-4">
            <button onClick={() => setStep(2)} className="btn-ghost">
              ← Back
            </button>
            <button
              onClick={() => {
                if (validateStep(3)) setStep(4);
              }}
              className="btn-primary !px-8"
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Budget / Review */}
      {step === 4 && (
        <div className="animate-fade-in">
          <h2 className="font-headline text-headline-md md:text-headline-lg text-on-surface mb-8 pb-4 border-b border-earth-brown/10 inline-block">
            Budget & any final details.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                Budget Range (optional)
              </label>
              <select
                value={form.budget}
                onChange={(e) => updateField('budget', e.target.value)}
                className="input-field appearance-none"
              >
                {budgetOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-8">
            <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
              Additional Information
            </label>
            <textarea
              value={form.additionalInfo}
              onChange={(e) => updateField('additionalInfo', e.target.value)}
              rows={4}
              className="input-field resize-none"
              placeholder="Anything else I should know? Tech riders, program themes, timelines, questions..."
            />
          </div>

          {/* Review summary */}
          <div className="bg-surface-container p-6 md:p-8 border border-earth-brown/10 mb-8">
            <h3 className="font-headline text-headline-md text-on-surface mb-6 pb-3 border-b border-earth-brown/10">
              Review your request
            </h3>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {[
                ['Booking Type', bookingOptions.find((b) => b.value === form.type)?.title || '—'],
                ['Date', form.eventDate ? new Date(form.eventDate).toLocaleDateString() : '—'],
                ['Alternative Date', form.alternativeDate ? new Date(form.alternativeDate).toLocaleDateString() : '—'],
                ['Venue', form.venue || '—'],
                ['Location', form.location || '—'],
                ['Audience', form.expectedAudience || '—'],
                ['Budget', form.budget ? (budgetOptions.find((o) => o.value === String(form.budget))?.label || 'Not specified') : 'Not specified'],
                ['Name', form.customerName || '—'],
                ['Organization', form.organization || '—'],
                ['Email', form.customerEmail || '—'],
                ['Phone', form.customerPhone || '—'],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-1">
                    {k}
                  </dt>
                  <dd className="font-body text-body-md text-on-surface break-words">{v}</dd>
                </div>
              ))}
              {(form.eventDescription || form.additionalInfo) && (
                <div className="md:col-span-2">
                  <dt className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-1">
                    Notes
                  </dt>
                  <dd className="font-body text-body-md text-on-surface whitespace-pre-wrap">
                    {[form.eventDescription, form.additionalInfo].filter(Boolean).join('\n\n')}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {errors._form && (
            <div className="p-4 bg-error-container text-on-error-container rounded mb-6 font-body text-body-md">
              {errors._form}
            </div>
          )}

          <div className="flex justify-between items-center">
            <button onClick={() => setStep(3)} className="btn-ghost">
              ← Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={state === 'loading'}
              className="btn-primary !px-8 disabled:opacity-50"
            >
              {state === 'loading' ? 'SUBMITTING...' : 'Submit Request'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
