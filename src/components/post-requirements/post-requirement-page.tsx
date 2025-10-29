"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, UploadCloud, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";

interface RequirementFormValues {
  fullName: string;
  companyName?: string;
  email: string;
  phone: string;
  productName: string;
  category: string;
  otherCategory?: string;
  subcategory: string;
  otherSubcategory?: string;
  quantity: string;
  budget?: string;
  targetDate?: string;
  country: string;
  city?: string;
  specification: string;
  attachments: File[];
  captchaAnswer: string;
  acceptTerms: boolean;
}

interface CategoryOption {
  _id?: string;
  id?: string;
  name: string;
  slug?: string;
  subcategories?: CategoryOption[];
}

interface PostRequirementPageProps {
  categories: CategoryOption[];
}

const OTHER_OPTION_VALUE = "other";

const getOptionValue = (option: CategoryOption) =>
  option._id ?? option.id ?? option.slug ?? option.name;

const normalizeCategories = (categories: CategoryOption[] = []) =>
  categories.map((category) => ({
    ...category,
    subcategories: Array.isArray(category.subcategories)
      ? category.subcategories
      : [],
  }));

function createCaptcha() {
  const left = Math.floor(Math.random() * 6) + 2;
  const right = Math.floor(Math.random() * 6) + 2;
  return { question: `${left} + ${right}`, answer: (left + right).toString() };
}

export default function PostRequirementPage({
  categories,
}: PostRequirementPageProps) {
  const normalizedCategories = useMemo(
    () => normalizeCategories(categories),
    [categories]
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RequirementFormValues>({
    mode: "onBlur",
    shouldUnregister: true,
    defaultValues: {
      attachments: [],
      category: "",
      subcategory: "",
      captchaAnswer: "",
      acceptTerms: false,
    },
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [captcha, setCaptcha] = useState(createCaptcha);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>(
    ""
  );

  useEffect(() => {
    setValue("category", selectedCategoryId);
    if (!selectedCategoryId || selectedCategoryId === OTHER_OPTION_VALUE) {
      setSelectedSubcategoryId("");
      setValue("subcategory", "");
      setValue("otherSubcategory", "");
    }
    if (selectedCategoryId !== OTHER_OPTION_VALUE) {
      setValue("otherCategory", "");
    }
  }, [selectedCategoryId, setValue]);

  useEffect(() => {
    setValue("subcategory", selectedSubcategoryId);
    if (selectedSubcategoryId !== OTHER_OPTION_VALUE) {
      setValue("otherSubcategory", "");
    }
  }, [selectedSubcategoryId, setValue]);

  const subcategoryOptions = useMemo(() => {
    if (
      !selectedCategoryId ||
      selectedCategoryId === OTHER_OPTION_VALUE ||
      selectedCategoryId === ""
    ) {
      return [];
    }

    const match = normalizedCategories.find(
      (item) => getOptionValue(item) === selectedCategoryId
    );

    return match?.subcategories ?? [];
  }, [normalizedCategories, selectedCategoryId]);

  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) {
      setUploadedFiles([]);
      setValue("attachments", [], { shouldDirty: true });
      return;
    }

    const MAX_FILES = 5;
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB

    let oversize = false;
    const uniqueFiles = files.filter((file) => {
      if (file.size > MAX_SIZE) {
        oversize = true;
        return false;
      }
      return true;
    });

    const limitedFiles = uniqueFiles.slice(0, MAX_FILES);

    if (oversize) {
      toast({
        title: "File too large",
        description: "Each file must be under 10MB.",
        variant: "destructive",
      });
    }

    if (uniqueFiles.length > MAX_FILES) {
      toast({
        title: "File limit reached",
        description: "You can upload up to 5 files per requirement.",
      });
    }

    setUploadedFiles(limitedFiles);
    setValue("attachments", limitedFiles, { shouldDirty: true });
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      setValue("attachments", next, { shouldDirty: true });
      return next;
    });
  };

  const refreshCaptcha = () => {
    setCaptcha(createCaptcha());
    setValue("captchaAnswer", "");
  };

  const onSubmit = async (values: RequirementFormValues) => {
    if (values.captchaAnswer.trim() !== captcha.answer) {
      toast({
        title: "Captcha validation failed",
        description: "Please solve the captcha correctly before submitting.",
        variant: "destructive",
      });
      refreshCaptcha();
      return;
    }

    const payload = {
      ...values,
      category:
        values.category === OTHER_OPTION_VALUE
          ? values.otherCategory
          : values.category,
      subcategory:
        values.subcategory === OTHER_OPTION_VALUE
          ? values.otherSubcategory
          : values.subcategory,
      attachments: undefined,
      fileCount: values.attachments?.length ?? 0,
    };

    await new Promise((resolve) => setTimeout(resolve, 900));

    toast({
      title: "Requirement submitted",
      description:
        "Thanks! Our sourcing experts will get in touch within 24 hours.",
    });

    reset({
      fullName: "",
      companyName: "",
      email: "",
      phone: "",
      productName: "",
      category: "",
      otherCategory: "",
      subcategory: "",
      otherSubcategory: "",
      quantity: "",
      budget: "",
      targetDate: "",
      country: "",
      city: "",
      specification: "",
      attachments: [],
      captchaAnswer: "",
      acceptTerms: false,
    });
    setUploadedFiles([]);
    setSelectedCategoryId("");
    setSelectedSubcategoryId("");
    refreshCaptcha();
    console.info("Submitted requirement", payload);
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <section className="mx-auto flex max-w-6xl flex-col gap-12 px-6 pb-16 pt-12 lg:flex-row lg:items-center lg:pt-20">
        <div className="lg:w-1/2">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-900/5 px-3 py-1 text-xs font-semibold text-slate-600">
            Need something specific?
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Not finding what you&apos;re looking for?
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Tell us about the product you need and our global sourcing team will
            curate suppliers, negotiate pricing, and share options tailored to
            your requirement.
          </p>
          <div className="mt-8 grid gap-4 rounded-2xl bg-white/70 p-6 shadow-lg shadow-slate-900/5 backdrop-blur">
            <div className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#8600f0]/10 text-[#8600f0]">
                1
              </span>
              <div>
                <p className="font-semibold text-slate-900">
                  Share requirement details
                </p>
                <p className="text-sm text-slate-600">
                  Describe the product, expected quality, quantity, and your
                  target timeline.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#8600f0]/10 text-[#8600f0]">
                2
              </span>
              <div>
                <p className="font-semibold text-slate-900">We verify & match</p>
                <p className="text-sm text-slate-600">
                  Experts validate your specs and tap into verified suppliers and
                  catalogues.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#8600f0]/10 text-[#8600f0]">
                3
              </span>
              <div>
                <p className="font-semibold text-slate-900">Get tailored quotes</p>
                <p className="text-sm text-slate-600">
                  Receive curated options, negotiate instantly, and convert your
                  purchase in a few clicks.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/10 sm:p-8">
            <div className="mb-6 flex flex-col gap-1">
              <h2 className="text-2xl font-semibold text-slate-900">
                Post a product requirement
              </h2>
              <p className="text-sm text-slate-600">
                All fields marked with * are mandatory.
              </p>
            </div>
            <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Full name" error={errors.fullName?.message}>
                  <input
                    type="text"
                    placeholder="Jane Doe"
                    {...register("fullName", {
                      required: "Please enter your name.",
                      minLength: {
                        value: 3,
                        message: "Name should be at least 3 characters.",
                      },
                    })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#8600f0] focus:ring-2 focus:ring-[#8600f0]/20"
                  />
                </Field>
                <Field label="Company" optional error={errors.companyName?.message}>
                  <input
                    type="text"
                    placeholder="Company name"
                    {...register("companyName")}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#8600f0] focus:ring-2 focus:ring-[#8600f0]/20"
                  />
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Work email" error={errors.email?.message}>
                  <input
                    type="email"
                    inputMode="email"
                    placeholder="you@company.com"
                    {...register("email", {
                      required: "Enter a valid email.",
                      pattern: {
                        value: /[^\s@]+@[^\s@]+\.[^\s@]+/,
                        message: "Enter a valid email.",
                      },
                    })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#8600f0] focus:ring-2 focus:ring-[#8600f0]/20"
                  />
                </Field>
                <Field label="Phone number" error={errors.phone?.message}>
                  <input
                    type="tel"
                    inputMode="tel"
                    placeholder="Include country code"
                    {...register("phone", {
                      required: "Phone number is required.",
                      minLength: {
                        value: 8,
                        message: "Enter a valid phone number.",
                      },
                    })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#8600f0] focus:ring-2 focus:ring-[#8600f0]/20"
                  />
                </Field>
              </div>

              <Field label="Product name" error={errors.productName?.message}>
                <input
                  type="text"
                  placeholder="e.g., Solar LED Street Light"
                  {...register("productName", {
                    required: "Please tell us the product name.",
                  })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#8600f0] focus:ring-2 focus:ring-[#8600f0]/20"
                />
              </Field>

              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="Category"
                  error={errors.category?.message}
                  helperText={
                    normalizedCategories.length === 0
                      ? "No categories found. Choose Other to describe your requirement."
                      : undefined
                  }
                >
                  <select
                    {...register("category", {
                      required: "Select a category or choose Other.",
                      onChange: (event) => {
                        const value = event.target.value;
                        setSelectedCategoryId(value);
                        setSelectedSubcategoryId("");
                      },
                    })}
                    value={selectedCategoryId}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#8600f0] focus:ring-2 focus:ring-[#8600f0]/20"
                  >
                    <option value="" disabled>
                      {normalizedCategories.length === 0
                        ? "Choose Other"
                        : "Choose category"}
                    </option>
                    {normalizedCategories.map((category) => (
                      <option
                        key={getOptionValue(category)}
                        value={getOptionValue(category)}
                      >
                        {category.name}
                      </option>
                    ))}
                    <option value={OTHER_OPTION_VALUE}>Other</option>
                  </select>
                </Field>

                {selectedCategoryId === OTHER_OPTION_VALUE ? (
                  <Field
                    label="Your category"
                    error={errors.otherCategory?.message}
                  >
                    <input
                      type="text"
                      placeholder="Enter category"
                      {...register("otherCategory", {
                        required: "Please specify your category.",
                      })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#8600f0] focus:ring-2 focus:ring-[#8600f0]/20"
                    />
                  </Field>
                ) : (
                  <Field
                    label="Subcategory"
                    error={errors.subcategory?.message}
                    helperText={
                      selectedCategoryId &&
                      subcategoryOptions.length === 0 &&
                      selectedCategoryId !== ""
                        ? "No preset subcategories. Choose Other to describe yours."
                        : undefined
                    }
                  >
                    <select
                      {...register("subcategory", {
                        required: "Select a subcategory or choose Other.",
                        onChange: (event) => {
                          setSelectedSubcategoryId(event.target.value);
                        },
                      })}
                      value={selectedSubcategoryId}
                      disabled={selectedCategoryId === ""}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#8600f0] focus:ring-2 focus:ring-[#8600f0]/20 disabled:cursor-not-allowed disabled:bg-slate-50"
                    >
                      <option value="" disabled>
                        {selectedCategoryId === ""
                          ? "Select category first"
                          : subcategoryOptions.length === 0
                            ? "No subcategories found"
                            : "Choose subcategory"}
                      </option>
                      {subcategoryOptions.map((subcategory) => (
                        <option
                          key={
                            subcategory._id ??
                            subcategory.id ??
                            subcategory.slug ??
                            subcategory.name
                          }
                          value={
                            subcategory._id ??
                            subcategory.id ??
                            subcategory.slug ??
                            subcategory.name
                          }
                        >
                          {subcategory.name}
                        </option>
                      ))}
                      <option value={OTHER_OPTION_VALUE}>Other</option>
                    </select>
                  </Field>
                )}
              </div>

              {selectedCategoryId !== OTHER_OPTION_VALUE &&
              selectedSubcategoryId === OTHER_OPTION_VALUE ? (
                <Field
                  label="Your subcategory"
                  error={errors.otherSubcategory?.message}
                >
                  <input
                    type="text"
                    placeholder="Enter subcategory"
                    {...register("otherSubcategory", {
                      required: "Please specify your subcategory.",
                    })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#8600f0] focus:ring-2 focus:ring-[#8600f0]/20"
                  />
                </Field>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Required quantity" error={errors.quantity?.message}>
                  <input
                    type="text"
                    placeholder="e.g., 5,000 units"
                    {...register("quantity", {
                      required: "Please mention the quantity.",
                    })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#8600f0] focus:ring-2 focus:ring-[#8600f0]/20"
                  />
                </Field>
                <Field label="Target budget" optional error={errors.budget?.message}>
                  <input
                    type="text"
                    placeholder="e.g., $15,000"
                    {...register("budget")}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#8600f0] focus:ring-2 focus:ring-[#8600f0]/20"
                  />
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Target date" optional error={errors.targetDate?.message}>
                  <input
                    type="date"
                    {...register("targetDate")}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#8600f0] focus:ring-2 focus:ring-[#8600f0]/20"
                  />
                </Field>
                <Field label="Destination country" error={errors.country?.message}>
                  <input
                    type="text"
                    placeholder="Where should we deliver?"
                    {...register("country", {
                      required: "Please add destination country.",
                    })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#8600f0] focus:ring-2 focus:ring-[#8600f0]/20"
                  />
                </Field>
              </div>

              <Field label="Destination city" optional error={errors.city?.message}>
                <input
                  type="text"
                  placeholder="City / Port"
                  {...register("city")}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#8600f0] focus:ring-2 focus:ring-[#8600f0]/20"
                />
              </Field>

              <Field
                label="Specification & quality expectations"
                error={errors.specification?.message}
              >
                <textarea
                  rows={4}
                  placeholder="Share dimensions, certifications, preferred brands, packaging, or any special notes."
                  {...register("specification", {
                    required: "Please share a short description.",
                    minLength: {
                      value: 20,
                      message: "Tell us a bit more so we can source accurately.",
                    },
                  })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#8600f0] focus:ring-2 focus:ring-[#8600f0]/20"
                />
              </Field>

              <div>
                <label className="text-sm font-medium text-slate-900">
                  Reference images (optional)
                </label>
                <p className="mt-1 text-xs text-slate-500">
                  Add product photos, drawings, or past purchase references. Max
                  5 files, up to 10MB each.
                </p>
                <div className="mt-3 flex flex-col gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-5 text-center">
                  <input
                    id="attachments"
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleFilesChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="attachments"
                    className="mx-auto flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#8600f0] shadow-sm transition hover:bg-[#8600f0] hover:text-white"
                  >
                    <UploadCloud className="h-4 w-4" />
                    Upload files
                  </label>
                  {uploadedFiles.length > 0 ? (
                    <ul className="space-y-2 text-left text-sm text-slate-600">
                      {uploadedFiles.map((file, index) => (
                        <li
                          key={`${file.name}-${index}`}
                          className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 shadow-sm"
                        >
                          <span className="truncate">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-red-200 hover:text-red-500"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500">
                      Drag & drop files here or click upload.
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                <label className="text-sm font-medium text-slate-900">
                  Captcha verification*
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                    <span>{captcha.question}</span>
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    {...register("captchaAnswer", {
                      required: "Solve the captcha to continue.",
                    })}
                    placeholder="Your answer"
                    className="w-32 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-[#8600f0] focus:ring-2 focus:ring-[#8600f0]/20"
                  />
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="text-sm font-medium text-[#8600f0] hover:underline"
                  >
                    Refresh
                  </button>
                </div>
                {errors.captchaAnswer?.message ? (
                  <p className="text-xs text-red-600">
                    {errors.captchaAnswer.message}
                  </p>
                ) : null}
              </div>

              <label className="flex items-start gap-3 text-sm text-slate-600">
                <input
                  type="checkbox"
                  {...register("acceptTerms", {
                    required: "You need to accept before submitting.",
                  })}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-[#8600f0] focus:ring-[#8600f0]"
                />
                <span>
                  I agree to be contacted by Eximso regarding this requirement
                  and accept the{" "}
                  <Link
                    href="/policy/privacy-policy"
                    className="font-medium text-[#8600f0] hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
              {errors.acceptTerms?.message ? (
                <p className="text-xs text-red-600">{errors.acceptTerms.message}</p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-xl bg-[#8600f0] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#8600f0]/30 transition hover:bg-[#7200c8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8600f0] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting…
                  </span>
                ) : (
                  "Submit requirement"
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="bg-white/70 py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-3xl font-semibold text-slate-900">
            Frequently asked questions
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Everything you need to know before submitting a requirement.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {faqItems.map((item) => (
              <article
                key={item.question}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h3 className="text-base font-semibold text-slate-900">
                  {item.question}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  error,
  optional,
  helperText,
  children,
}: {
  label: string;
  error?: string;
  optional?: boolean;
  helperText?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-slate-900">
        {label}
        {optional ? <span className="ml-1 text-xs text-slate-400">Optional</span> : <span className="ml-1 text-[#8600f0]">*</span>}
      </label>
      {children}
      {helperText ? (
        <p className="text-xs text-slate-500">{helperText}</p>
      ) : null}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

const faqItems = [
  {
    question: "How soon will I hear back after submitting?",
    answer:
      "Our sourcing consultants review every requirement manually. Expect a call or email within 24 business hours with next steps.",
  },
  {
    question: "Can I negotiate the quotes I receive?",
    answer:
      "Absolutely. We share supplier options and negotiated price ranges so you can compare, counter, and confirm in a single dashboard.",
  },
  {
    question: "Do you work with international shipments?",
    answer:
      "Yes. We manage both domestic and cross-border procurement, including logistics, duties, and compliance documentation.",
  },
  {
    question: "Is there a cost to post a requirement?",
    answer:
      "Posting requirements is free. You only pay when you place an order and confirm fulfilment milestones.",
  },
  {
    question: "Can I add technical drawings or brochures?",
    answer:
      "You can attach up to five reference files including images and PDFs so our teams can source exact specifications.",
  },
  {
    question: "What if I need multiple products?",
    answer:
      "Submit one form per product so we can assign it to the right category expert. Our team will help consolidate shipping if needed.",
  },
];
