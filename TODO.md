# Email Subscription Component Task

## Information Gathered
- Home page structure: `src/components/layout/home/homepage.tsx` renders sections and Footer.
- Footer: `src/components/layout/footer.tsx`, shown only on home page.
- Form validation: Use `react-hook-form` as in other components (e.g., post-requirements).
- Toast: Use existing `useToast` hook for success message.
- Component placement: Above footer on home page.
- Content: Text "get our updates for more subscribe", email input, submit button with validation.

## Plan
- Create new component `src/components/layout/home/email-subscription.tsx` with form, validation, and toast.
- Update `src/components/layout/footer.tsx` to import and render the component above Footer on home page.

## Dependent Files to be edited
- `src/components/layout/home/email-subscription.tsx` (new file)
- `src/components/layout/footer.tsx`

## Followup steps
- Test component on home page.
- User will implement backend API later.

## Steps to Complete
- [x] Create `src/components/layout/home/email-subscription.tsx` component with form, email input, submit button, validation, and success toast.
- [x] Update `src/components/layout/home/homepage.tsx` to import and add the component before Footer.
- [x] Verify component renders correctly on home page.
