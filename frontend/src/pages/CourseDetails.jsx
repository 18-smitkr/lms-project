import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import BackButton from "../components/common/BackButton";

function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [ratingSummary, setRatingSummary] = useState({ average_rating: 0, total_reviews: 0 });
  const [reviewForm, setReviewForm] = useState({ rating: 5, review_text: "" });
  const [reviewError, setReviewError] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const loadRazorpay = () => new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await API.get(`course/${courseId}/`);
        setCourse(response.data);
        const [reviewsResponse, summaryResponse] = await Promise.all([
          API.get(`reviews/course-reviews/${courseId}/`),
          API.get(`reviews/rating-summary/${courseId}/`),
        ]);
        setReviews(reviewsResponse.data || []);
        setRatingSummary(summaryResponse.data || { average_rating: 0, total_reviews: 0 });

        if (user) {
          try {
            const enrolledResponse = await API.get("my-courses/");
            const enrolledIds = new Set(
              (enrolledResponse.data || []).map((item) => Number(item.course_id ?? item.course ?? item.id))
            );
            setIsEnrolled(enrolledIds.has(Number(courseId)));
          } catch {
            setIsEnrolled(false);
          }
          if (user.role === "student") {
            try {
              const wishlistResponse = await API.get("wishlist/");
              setIsWishlisted((wishlistResponse.data || []).some((item) => Number(item.course_id) === Number(courseId)));
            } catch {
              setIsWishlisted(false);
            }
          }
        }
      } catch {
        setError("Course could not be loaded.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, user]);

  const handleEnroll = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setEnrolling(true);
      if (Number(course.price) <= 0) {
        await API.post(`enroll/${courseId}/`);
        setIsEnrolled(true);
        setError("");
        return;
      }

      const { data: order } = await API.post(`payments/create-order/${courseId}/`);
      if (!(await loadRazorpay())) {
        throw new Error("Unable to load secure Razorpay checkout. Please try again.");
      }

      const checkout = new window.Razorpay({
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: "Learnova",
        description: course.title,
        order_id: order.order_id,
        prefill: { name: user.username, email: user.email },
        handler: async (paymentResponse) => {
          try {
            await API.post("payments/verify-payment/", {
              ...paymentResponse,
              course_id: Number(courseId),
            });
            setIsEnrolled(true);
            setError("");
          } catch (verificationError) {
            setError(verificationError.response?.data?.error || "Payment could not be verified. Contact support before trying again.");
          } finally {
            setEnrolling(false);
          }
        },
        modal: {
          ondismiss: () => {
            setError("Checkout was closed. If you completed payment, it will remain pending until verified.");
            setEnrolling(false);
          },
        },
      });

      checkout.on("payment.failed", async (paymentError) => {
        const failedPaymentId = paymentError.error?.metadata?.payment_id;
        if (failedPaymentId) {
          try {
            await API.post("payments/payment-failed/", {
              razorpay_order_id: order.order_id,
              razorpay_payment_id: failedPaymentId,
            });
          } catch {
            setError("Payment failed, but Razorpay could not confirm the failure. Please check your payment history.");
          }
        }
        setError(paymentError.error?.description || "Payment failed. Please try again.");
        setEnrolling(false);
      });
      checkout.open();
    } catch (err) {
      const message = err.response?.data?.error || err.message || "Enrollment failed.";
      setError(message);
      setEnrolling(false);
    } finally {
      if (Number(course?.price) <= 0) setEnrolling(false);
    }
  };

  const submitReview = async (event) => {
    event.preventDefault();
    setReviewLoading(true);
    setReviewError("");
    try {
      await API.post(`reviews/create-review/${courseId}/`, {
        rating: Number(reviewForm.rating),
        review_text: reviewForm.review_text.trim(),
      });
      const [reviewsResponse, summaryResponse] = await Promise.all([
        API.get(`reviews/course-reviews/${courseId}/`),
        API.get(`reviews/rating-summary/${courseId}/`),
      ]);
      setReviews(reviewsResponse.data || []);
      setRatingSummary(summaryResponse.data || { average_rating: 0, total_reviews: 0 });
      setReviewForm({ rating: 5, review_text: "" });
    } catch (err) {
      setReviewError(err.response?.data?.error || Object.values(err.response?.data || {}).flat().join(" ") || "Unable to submit your review.");
    } finally {
      setReviewLoading(false);
    }
  };

  const toggleWishlist = async () => {
    try {
      if (isWishlisted) {
        await API.delete(`wishlist/${courseId}/`);
        setIsWishlisted(false);
      } else {
        await API.post(`wishlist/${courseId}/`);
        setIsWishlisted(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Unable to update your wishlist.");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#09090F] flex items-center justify-center text-white">Loading course...</div>;
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#09090F] px-4 py-10 text-white">
        <div className="mx-auto max-w-3xl rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
          <BackButton fallbackTo="/courses" label="Back to Courses" />
          {error || "Course not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090F] px-4 py-10 text-white md:px-8">
      <div className="mx-auto max-w-6xl">
        <BackButton fallbackTo="/courses" label="Back to Courses" />

        <div className="rounded-[32px] border border-white/10 bg-[#101018]/85 p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-purple-300">Course</p>
              <h1 className="mt-3 text-4xl font-black">{course.title}</h1>
              <p className="mt-4 max-w-2xl text-gray-300">{course.description}</p>

              <div className="mt-6 flex flex-wrap gap-3 text-sm text-gray-400">
                <span className="rounded-full bg-white/5 px-3 py-1.5">Instructor: {course.instructor || "Learnova"}</span>
                <span className="rounded-full bg-white/5 px-3 py-1.5">Price: ₹{Number(course.price || 0)}</span>
                <span className="rounded-full bg-white/5 px-3 py-1.5">Rating: {Number(ratingSummary.average_rating || 0).toFixed(1)} ({ratingSummary.total_reviews || 0})</span>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#12121A] p-5">
              <div className="text-sm text-gray-400">Enrollment</div>
              <div className="mt-3 text-3xl font-black text-white">₹{Number(course.price || 0)}</div>
              {error && (
                <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                  {error}
                </div>
              )}

              {isEnrolled ? (
                <Link
                  to={`/courses/${courseId}/learn`}
                  className="mt-5 block w-full rounded-xl bg-gradient-to-r from-purple-600 to-orange-500 px-4 py-3 text-center font-semibold text-white"
                >
                  Resume learning
                </Link>
              ) : user?.role === "student" || !user ? (
                <button
                  type="button"
                  disabled={enrolling}
                  onClick={handleEnroll}
                  className="mt-5 w-full rounded-xl bg-gradient-to-r from-purple-600 to-orange-500 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {enrolling ? "Processing..." : "Enroll now"}
                </button>
              ) : (
                <p className="mt-5 text-sm text-gray-400">Instructor accounts cannot enroll in student courses.</p>
              )}
              {user?.role === "student" && (
                <button
                  type="button"
                  onClick={toggleWishlist}
                  className="mt-3 w-full rounded-xl border border-white/10 px-4 py-3 font-semibold text-purple-200"
                >
                  {isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-white/10 bg-[#101018]/85 p-6">
            <h2 className="text-2xl font-bold text-white">Curriculum</h2>
            <div className="mt-6 space-y-4">
              {(course.modules || []).map((module) => (
                <div key={module.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h3 className="text-lg font-semibold text-white">{module.title}</h3>
                  <div className="mt-4 space-y-2">
                    {(module.lessons || []).map((lesson) => (
                      <div key={lesson.id} className="flex items-center justify-between rounded-xl bg-black/20 px-3 py-2 text-sm text-gray-300">
                        <span>{lesson.title}</span>
                        <span>{lesson.duration || 0} min</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#101018]/85 p-6">
            <h2 className="text-2xl font-bold text-white">Course Overview</h2>
            <ul className="mt-5 space-y-3 text-sm text-gray-300">
              <li>• {course.modules?.length || 0} modules</li>
              <li>• {course.modules?.reduce((total, module) => total + (module.lessons?.length || 0), 0) || 0} lessons</li>
              <li>• Includes structured learning path</li>
            </ul>
          </div>
        </div>

        <section className="mt-8 rounded-3xl border border-white/10 bg-[#101018]/85 p-6">
          <h2 className="text-2xl font-bold text-white">Student reviews</h2>
          {user?.role === "student" && isEnrolled && (
            <form onSubmit={submitReview} className="mt-5 grid gap-3 md:grid-cols-[160px_1fr_auto]">
              <select
                value={reviewForm.rating}
                onChange={(event) => setReviewForm((current) => ({ ...current, rating: event.target.value }))}
                className="rounded-xl border border-white/10 bg-[#151521] px-3 py-3 text-white"
                aria-label="Rating"
              >
                {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} stars</option>)}
              </select>
              <input
                value={reviewForm.review_text}
                onChange={(event) => setReviewForm((current) => ({ ...current, review_text: event.target.value }))}
                required
                maxLength={1000}
                placeholder="Share your experience"
                className="rounded-xl border border-white/10 bg-[#151521] px-4 py-3 text-white placeholder:text-gray-500"
              />
              <button disabled={reviewLoading} className="rounded-xl bg-purple-600 px-4 py-3 font-semibold text-white disabled:opacity-60">
                {reviewLoading ? "Submitting..." : "Submit review"}
              </button>
            </form>
          )}
          {reviewError && <p className="mt-3 text-sm text-red-300">{reviewError}</p>}
          {reviews.length === 0 ? (
            <p className="mt-5 text-sm text-gray-400">No reviews have been submitted yet.</p>
          ) : (
            <div className="mt-5 space-y-3">
              {reviews.map((review) => (
                <article key={review.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-white">{review.student_username || `Student #${review.student}`}</span>
                    <span className="text-orange-300">{review.rating} / 5</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-300">{review.review_text}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default CourseDetails;
