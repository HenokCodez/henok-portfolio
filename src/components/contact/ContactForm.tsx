import { useState, useRef } from 'react';
import { siteConfig } from '../../config/site';
import { sendMessage } from '../../lib/api';
import { Button } from '../ui/Button';
import { cn } from '../../lib/cn';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [projectType, setProjectType] = useState('');
  const [budget, setBudget] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const mountTime = useRef(Date.now());

  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Please enter your name.';
    else if (name.length > 80) errs.name = 'Name must be under 80 characters.';

    if (!email.trim()) errs.email = 'Please enter your email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Please enter a valid email address.';
    else if (email.length > 120) errs.email = 'Email must be under 120 characters.';

    if (!projectType) errs.projectType = 'Please select a project type.';

    if (!message.trim()) errs.message = 'Please tell me about your project.';
    else if (message.trim().length < 10) errs.message = 'Message must be at least 10 characters.';
    else if (message.length > 3000) errs.message = 'Message must be under 3000 characters.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    // Spam honeypot or bot speed check
    if (honeypot || Date.now() - mountTime.current < 3000) {
      setIsSuccess(true);
      return;
    }

    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await sendMessage({
        name: name.trim(),
        email: email.trim(),
        project_type: projectType,
        budget: budget,
        message: message.trim(),
      });
      setIsSuccess(true);
    } catch {
      setServerError(`Something went wrong. Please email me directly at ${siteConfig.email}.`);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    setName('');
    setEmail('');
    setProjectType('');
    setBudget(null);
    setMessage('');
    setErrors({});
    setIsSuccess(false);
    mountTime.current = Date.now();
  }

  if (isSuccess) {
    return (
      <div className="p-8 sm:p-12 rounded-card bg-surface border border-line space-y-6 text-center select-none">
        <h2 className="display text-3xl sm:text-4xl text-text">
          MESSAGE <span className="serif-accent">sent.</span>
        </h2>
        <p className="text-muted text-base max-w-md mx-auto">
          Thanks for reaching out! I&apos;ve received your note and will get back to you within 24 hours.
        </p>
        <div className="pt-4">
          <Button onClick={handleReset} variant="ghost" size="md">
            Send another message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-9" noValidate>
      {/* Hidden honeypot anti-spam field */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="sr-only pointer-events-none"
        aria-hidden="true"
      />

      {/* 01 — Name */}
      <div className="space-y-2">
        <label htmlFor="contact-name" className="block font-mono text-[11px] uppercase tracking-mono text-muted">
          01 — Your name *
        </label>
        <input
          id="contact-name"
          type="text"
          value={name}
          maxLength={80}
          onChange={(e) => setName(e.target.value)}
          placeholder="Henok Tsegaye"
          className={cn(
            'w-full h-14 bg-transparent border-b border-line-strong text-lg text-text placeholder:text-faint transition-colors focus:outline-none focus:border-accent',
            errors.name && 'border-danger focus:border-danger',
          )}
        />
        {errors.name && <p className="font-mono text-xs text-danger">{errors.name}</p>}
      </div>

      {/* 02 — Email */}
      <div className="space-y-2">
        <label htmlFor="contact-email" className="block font-mono text-[11px] uppercase tracking-mono text-muted">
          02 — Email *
        </label>
        <input
          id="contact-email"
          type="email"
          value={email}
          maxLength={120}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="hello@company.com"
          className={cn(
            'w-full h-14 bg-transparent border-b border-line-strong text-lg text-text placeholder:text-faint transition-colors focus:outline-none focus:border-accent',
            errors.email && 'border-danger focus:border-danger',
          )}
        />
        {errors.email && <p className="font-mono text-xs text-danger">{errors.email}</p>}
      </div>

      {/* 03 — What do you need? */}
      <div className="space-y-3">
        <span className="block font-mono text-[11px] uppercase tracking-mono text-muted">
          03 — What do you need? *
        </span>
        <div
          role="radiogroup"
          aria-label="Project Type"
          className="flex flex-wrap gap-2.5"
        >
          {siteConfig.projectTypes.map((type) => {
            const isSelected = projectType === type;
            return (
              <button
                key={type}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setProjectType(type)}
                className={cn(
                  'h-[38px] px-4 rounded-full border font-mono text-xs uppercase tracking-wider transition-all select-none',
                  isSelected
                    ? 'bg-text text-bg border-text font-semibold'
                    : 'bg-surface border-line-strong text-muted hover:border-text hover:text-text',
                )}
              >
                {type}
              </button>
            );
          })}
        </div>
        {errors.projectType && <p className="font-mono text-xs text-danger">{errors.projectType}</p>}
      </div>

      {/* 04 — Budget (optional) */}
      <div className="space-y-3">
        <span className="block font-mono text-[11px] uppercase tracking-mono text-muted">
          04 — Budget (optional)
        </span>
        <div
          role="radiogroup"
          aria-label="Budget"
          className="flex flex-wrap gap-2.5"
        >
          {siteConfig.budgets.map((b) => {
            const isSelected = budget === b;
            return (
              <button
                key={b}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setBudget(isSelected ? null : b)}
                className={cn(
                  'h-[38px] px-4 rounded-full border font-mono text-xs uppercase tracking-wider transition-all select-none',
                  isSelected
                    ? 'bg-text text-bg border-text font-semibold'
                    : 'bg-surface border-line-strong text-muted hover:border-text hover:text-text',
                )}
              >
                {b}
              </button>
            );
          })}
        </div>
      </div>

      {/* 05 — Message */}
      <div className="space-y-2">
        <label htmlFor="contact-msg" className="block font-mono text-[11px] uppercase tracking-mono text-muted">
          05 — Tell me about the project *
        </label>
        <textarea
          id="contact-msg"
          rows={4}
          value={message}
          maxLength={3000}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Share links, deadline, references…"
          className={cn(
            'w-full min-h-[132px] p-4 rounded-xl bg-surface border border-line-strong text-base text-text placeholder:text-faint transition-colors focus:outline-none focus:border-accent resize-y',
            errors.message && 'border-danger focus:border-danger',
          )}
        />
        {errors.message && <p className="font-mono text-xs text-danger">{errors.message}</p>}
      </div>

      {/* Submit Button & Hint */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
        <Button
          type="submit"
          variant="accent"
          size="lg"
          arrow="right"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending…' : 'Send message'}
        </Button>

        <span className="font-mono text-xs uppercase tracking-mono text-muted">
          Reply within 24h
        </span>
      </div>

      {serverError && (
        <p className="font-mono text-sm text-danger">{serverError}</p>
      )}
    </form>
  );
}
