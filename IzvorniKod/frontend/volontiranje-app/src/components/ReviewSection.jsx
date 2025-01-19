import { useState, useEffect } from 'react';
import axios from 'axios';

const BACK_URL = "http://localhost:8080";

function ReviewSection({ projectId, userRole, hasParticipated, isFinished, isOrganizer, token, hasReviewed }) {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [replyTexts, setReplyTexts] = useState({});
  const [error, setError] = useState('');
  const [canReview, setCanReview] = useState(!hasReviewed);


  useEffect(() => {
    setCanReview(!hasReviewed);
  }, [hasReviewed]);

  useEffect(() => {
    if (token) {
      fetchReviews();
    }
  }, [projectId, token]);

  useEffect(() => {
    // Check if the current volunteer has already reviewed
    if (userRole === 'VOLUNTEER' && reviews.length > 0) {
      const userHasReviewed = reviews.some(review => review.volunteerUsername === localStorage.getItem('username'));
      setCanReview(userHasReviewed);
    }
  }, [reviews, userRole]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${BACK_URL}/getreviews/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Reviews data:', response.data);
      setReviews(response.data.map(review => ({
        reviewID: review.reviewID,
        rating: review.rating,
        comment: review.comment,
        reviewDate: review.reviewDate,
        volunteerUsername: review.volunteerUsername,
        response: review.response // This will be ReviewResponseDisplayDto
      })));
    } catch (error) {
      console.error('Error fetching reviews:', error.response || error);
      setError('Došlo je do pogreške pri dohvaćanju recenzija.');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!canReview) {
      setError('Već ste napisali recenziju za ovu aktivnost.');
      return;
    }

    if (newReview.comment.length > 500) {
      setError('Komentar ne smije biti duži od 500 znakova.');
      return;
    }

    try {
      await axios.post(`${BACK_URL}/volunteer/activity/${projectId}`, {
        rating: newReview.rating,
        comment: newReview.comment
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNewReview({ rating: 5, comment: '' });
      window.location.reload();
    } catch (error) {
      setError('Došlo je do pogreške pri slanju recenzije.');
    }
  };

  const handleReplySubmit = async (reviewId) => {
    const currentReplyText = replyTexts[reviewId];
    
    if (!currentReplyText) {
      setError('Odgovor ne može biti prazan.');
      return;
    }

    if (currentReplyText.length > 500) {
      setError('Odgovor ne smije biti duži od 500 znakova.');
      return;
    }

    try {
      const response = await axios.post(
        `${BACK_URL}/organization/respond/${projectId}`,
        {
          comment: currentReplyText,
          reviewID: reviewId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Reply response:', response.data);
      // Clear the specific reply text
      setReplyTexts(prev => ({ ...prev, [reviewId]: '' }));
      // Refresh the reviews to show the new response
      await fetchReviews();
    } catch (error) {
      console.error('Error sending reply:', error.response || error);
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

      {/* Review Form - only show if all conditions are met and canReview is true */}
      {userRole === 'VOLUNTEER' && hasParticipated && isFinished && canReview && (
        <div className="bg-white rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Napišite recenziju</h3>
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Ocjena</label>
              <div className="flex space-x-2 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={`rating-star-${star}`}
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

      {/* Message when volunteer has already reviewed */}
      {userRole === 'VOLUNTEER' && !canReview && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Već ste napisali recenziju za ovu aktivnost.
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.volunteerUsername} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{review.volunteerUsername}</p>
                <div className="text-yellow-400">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={`star-${review.reviewID}-${i}`}>
                      {i < review.rating ? '★' : '☆'}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(review.reviewDate).toLocaleDateString()}
              </span>
            </div>
            
            <p className="mt-2">{review.comment}</p>

            {/* Organization's Response */}
            {review.response && review.response.comment && (
              <div className="mt-4 ml-8 p-4 bg-gray-50 rounded">
                <p className="text-sm font-medium">Odgovor organizacije:</p>
                <p className="mt-1">{review.response.comment}</p>
                {review.response.responseDate && (
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(review.response.responseDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}

            {/* Reply Form for organization - only show if no response exists */}
            {isOrganizer && !review.response && (
              <div className="mt-4">
                <div className="space-y-2">
                  <textarea
                    value={replyTexts[review.volunteerUsername] || ''}
                    onChange={(e) => {
                      setReplyTexts(prev => ({
                        ...prev,
                        [review.volunteerUsername]: e.target.value
                      }));
                    }}
                    maxLength={500}
                    className="w-full rounded border p-2"
                    placeholder="Napišite odgovor... (max 500 znakova)"
                  />
                  <button
                    onClick={() => handleReplySubmit(review.volunteerUsername)}
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