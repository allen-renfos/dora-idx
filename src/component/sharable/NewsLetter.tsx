"use client";

import { postNewsLetter } from "@/services/auth/AuthServices";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { FormDisclaimer } from "@/component/sharable/FormDisclaimer";
import { IoCheckmarkCircle, IoAlertCircle } from "react-icons/io5";
import { useProfile } from "@/services/profile/ProfileQueries";

export const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [touched, setTouched] = useState(false);
  const [isConsentChecked, setIsConsentChecked] = useState(false);
  const [consentError, setConsentError] = useState<string | null>(null);
  const { data: profileData } = useProfile();

  useEffect(() => {
    if (profileData?.data?.email) {
      setEmail(profileData.data.email);
    }
  }, [profileData]);

  // Real-time email validation
  useEffect(() => {
    if (!email.trim()) {
      setIsValidEmail(false);
      if (touched) {
        setError(null);
      }
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    setIsValidEmail(isValid);

    if (touched) {
      if (!isValid) {
        setError("Please enter a valid email address");
      } else {
        setError(null);
      }
    }
  }, [email, touched]);

  const newsletterMutation = useMutation({
    mutationFn: (user: { email: string; lagnt: string | undefined }) => postNewsLetter(user),
    onSuccess: (data) => {
      console.log("Subscribed successfully:", data);
      setSuccess("Subscription successful!");
      setEmail("");
      setTouched(false);
      setIsValidEmail(false);
      setIsConsentChecked(false); // Reset consent on success
      setConsentError(null); // Clear consent error

      toast.success("You've been subscribed to our newsletter!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
    onError: (error: any) => {
      console.error("Subscription error:", error);
      const errorMessage =
        error?.response?.data?.message ||
        "Subscription failed. Please try again.";
      setError(errorMessage);

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setTouched(true);
      setError("Please enter your email address");
      toast.error("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setTouched(true);
      setError("Please enter a valid email address");
      toast.error("Please enter a valid email address");
      return;
    }

    if (!isConsentChecked) {
      setConsentError("Please review and accept our mandatory disclaimer.");
      toast.error("Please review and accept our mandatory disclaimer.");
      return;
    }

    const data = {
      email: email,
      lagnt: process.env.NEXT_PUBLIC_REALTY_PRO_AGENT_ID,
    };

    console.log("Calling newsletterMutation.mutate with:", data);
    newsletterMutation.mutate(data);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setTouched(true);
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <section
        className="newsletter py-10 md:py-16"
        style={{ backgroundImage: "url('/images/sample8.jpg')" }}
      >
        <div className="newsletter-overlay"></div>
        <div className="container" style={{ margin: "0 auto" }}>
          <div className="newsletter-content">
            <h2>Subscribe to our newsletter</h2>
            <p>
              Top priority, and she is committed to walking with them
              consistently walking.
            </p>
            <form className="newsletter-form" onSubmit={handleSubmit}>
              <div className="flex justify-space-between mt-4 text-white relative">
                <div
                  className="newsletter-input-wrap"
                  style={{ flex: 1, position: "relative", marginRight: "10px" }}
                >
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={() => setTouched(true)}
                    disabled={newsletterMutation.isPending}
                    readOnly={!!profileData?.data?.email}
                    className="text-white flex-grow p-3 rounded-none newsletter-email w-full"
                    style={{
                      background: "transparent",
                      borderWidth: "0",
                      borderBottomWidth: "1px",
                      borderStyle: "solid",
                      borderColor: !touched
                        ? "rgba(255,255,255,0.3)"
                        : email && isValidEmail
                          ? "#10b981"
                          : email && !isValidEmail
                            ? "#ef4444"
                            : "rgba(255,255,255,0.3)",
                      paddingRight: email ? "40px" : "12px",
                      transition: "all 0.3s ease",
                      color: profileData?.data?.email ? 'rgba(255,255,255,0.5)' : "#fff",
                      fontSize: "14px",
                      cursor: profileData?.data?.email ? 'not-allowed' : 'text'
                    }}
                  />
                  {/* Validation Icon */}
                  {email && (
                    <div
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {isValidEmail ? (
                        <IoCheckmarkCircle
                          size={20}
                          color="#10b981"
                          title="Email is valid"
                        />
                      ) : (
                        <IoAlertCircle
                          size={20}
                          color="#ef4444"
                          title="Invalid email"
                        />
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={
                    newsletterMutation.isPending ||
                    (touched && !isValidEmail) ||
                    !email ||
                    !isConsentChecked
                  }
                  className="btn-subscribe marginLeft-10 rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    transition: "all 0.3s ease",
                    opacity:
                      newsletterMutation.isPending ||
                        (touched && !isValidEmail) ||
                        !email ||
                        !isConsentChecked
                        ? 0.5
                        : 1,
                    cursor:
                      newsletterMutation.isPending ||
                        (touched && !isValidEmail) ||
                        !email ||
                        !isConsentChecked
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  {newsletterMutation.isPending ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-2 inline-block"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Subscribing...
                    </>
                  ) : (
                    <>
                      Subscribe
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="21"
                        height="16"
                        viewBox="0 0 21 16"
                        fill="none"
                      >
                        <path
                          d="M1.5 7C0.947715 7 0.5 7.44772 0.5 8C0.5 8.55228 0.947715 9 1.5 9V7ZM20.2071 8.70711C20.5976 8.31658 20.5976 7.68342 20.2071 7.29289L13.8431 0.928932C13.4526 0.538408 12.8195 0.538408 12.4289 0.928932C12.0384 1.31946 12.0384 1.95262 12.4289 2.34315L18.0858 8L12.4289 13.6569C12.0384 14.0474 12.0384 14.6805 12.4289 15.0711C12.8195 15.4616 13.4526 15.4616 13.8431 15.0711L20.2071 8.70711ZM1.5 8V9H19.5V8V7H1.5V8Z"
                          fill="black"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </div>

              {/* Helpful Validation Message */}
              {/* {touched && error && (
                <div
                  style={{
                    marginTop: "8px",
                    color: "#ef4444",
                    fontSize: "13px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <IoAlertCircle size={16} />
                  {error}
                </div>
              )}
              {touched && email && isValidEmail && (
                <div
                  style={{
                    marginTop: "8px",
                    color: "#10b981",
                    fontSize: "13px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <IoCheckmarkCircle size={16} />
                  Email is valid
                </div>
              )} */}
            </form>

            <div style={{ marginTop: "20px", display: 'flex', justifyContent: 'center' }}>
              <FormDisclaimer
                checked={isConsentChecked}
                onChange={(checked) => {
                  setIsConsentChecked(checked);
                  setConsentError(null);
                }}
                error={consentError || ""}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
