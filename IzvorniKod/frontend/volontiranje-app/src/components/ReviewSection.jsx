import { useState, useEffect } from 'react';
import axios from 'axios';

function ReviewSection({ projectId, userRole, hasParticipated, isFinished, isOrganizer }) {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [replyText, setReplyText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [projectId]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/getreviews/${projectId}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Došlo je do pogreške pri dohvaćanju recenzija.');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (newReview.comment.length > 500) {
      setError('Komentar ne smije biti duži od 500 znakova.');
      return;
    }

    try {
      await axios.post(`/volunteer/activity/${projectId}`, {
        rating: newReview.rating,
        comment: newReview.comment
      });
      setNewReview({ rating: 5, comment: '' });
      fetchReviews();
    } catch (error) {
      setError('Došlo je do pogreške pri slanju recenzije.');
    }
  };

  const handleReplySubmit = async (reviewId) => {
    if (replyText.length > 500) {
      setError('Odgovor ne smije biti duži od 500 znakova.');
      return;
    }

    try {
      await axios.post(`/organization/respond/${reviewId}`, {
        comment: replyText,
        reviewID: reviewId
      });
      setReplyText('');
      fetchReviews();
    } catch (error) {
      setError('Došlo je do pogreške pri slanju odgovora.');
    }
  };

  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-2xl font-bold text-white">Recenzije aktivnosti</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Review Form for eligible volunteers */}
      {userRole === 'VOLUNTEER' && hasParticipated && isFinished && (
        <div className="bg-white rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Napišite recenziju</h3>
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Ocjena</label>
              <div className="flex space-x-2 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                    className={`text-2xl ${
                      star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Komentar ({500 - newReview.comment.length} preostalih znakova)
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                maxLength={500}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                rows={4}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-400 py-2 px-4 rounded hover:bg-yellow-500"
            >
              Objavi recenziju
            </button>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.reviewDate} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{review.volunteerUsername}</p>
                <div className="text-yellow-400">
                  {'★'.repeat(review.rating)}
                  {'☆'.repeat(5 - review.rating)}
                </div>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(review.reviewDate).toLocaleDateString()}
              </span>
            </div>
            
            <p className="mt-2">{review.comment}</p>

            {/* Organization's Response */}
            {review.response && (
              <div className="mt-4 ml-8 p-4 bg-gray-50 rounded">
                <p className="text-sm font-medium">Odgovor organizacije:</p>
                <p className="mt-1">{review.response.comment}</p>
              </div>
            )}

            {/* Reply Form for organization */}
            {isOrganizer && !review.response && (
              <div className="mt-4">
                <div className="space-y-2">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    maxLength={500}
                    className="w-full rounded border p-2"
                    placeholder="Napišite odgovor... (max 500 znakova)"
                  />
                  <button
                    onClick={() => handleReplySubmit(review.reviewID)}
                    className="bg-yellow-400 px-4 py-2 rounded hover:bg-yellow-500"
                  >
                    Odgovori
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewSection; 