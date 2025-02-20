import  { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ScorePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract evaluationResult and candidateEmail from location.state
  const { evaluationResult, candidateEmail } = location.state || {};
  const [isLoading, setIsLoading]= useState(false);

  // Log the extracted values for debugging
  console.log("Evaluation Result:", evaluationResult);
  console.log("Candidate Email:", candidateEmail);

  const [evaluations, setEvaluations] = useState(
    evaluationResult?.evaluations || []
  );
  const [finalDecision, setFinalDecision] = useState(
    evaluationResult?.final_decision || ""
  );

  const handleEvaluationChange = (index, field, value) => {
    const updatedEvaluations = [...evaluations];
    updatedEvaluations[index][field] = value;
    setEvaluations(updatedEvaluations);
  };

  const handleSendReport = async () => {
    if (!candidateEmail || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          evaluations,
          final_decision: finalDecision,
          candidateEmail,
        }),
      });

      if (!response.ok) throw new Error("Failed to send report");

      alert("Report sent successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send report");
    } finally {
      setIsLoading(false);
    }
  };
return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4">
      <div className="w-full max-w-7xl mx-auto">
        <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 text-center mb-8">
            Evaluation Report
          </h1>
          
          <div className="space-y-6">
            {evaluations.map((evalItem, index) => (
              <div 
                key={index} 
                className="bg-gray-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Question {index + 1}
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Question
                      </label>
                      <textarea
                        value={evalItem.question}
                        onChange={(e) =>
                          handleEvaluationChange(
                            index,
                            "question",
                            e.target.value
                          )
                        }
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[100px] p-3"
                        placeholder="Enter the question..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Answer
                      </label>
                      <textarea
                        value={evalItem.answer}
                        onChange={(e) =>
                          handleEvaluationChange(index, "answer", e.target.value)
                        }
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[100px] p-3"
                        placeholder="Enter the answer..."
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Score
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={evalItem.score}
                          onChange={(e) =>
                            handleEvaluationChange(index, "score", e.target.value)
                          }
                          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-3 pr-12"
                          placeholder="0-100"
                          min="0"
                          max="100"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                          /100
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Areas of Improvement
                      </label>
                      <textarea
                        value={evalItem.areas_of_improvement}
                        onChange={(e) =>
                          handleEvaluationChange(
                            index,
                            "areas_of_improvement",
                            e.target.value
                          )
                        }
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[100px] p-3"
                        placeholder="Suggest areas for improvement..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-gray-50 rounded-xl p-6 shadow-lg mt-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Final Decision
              </h2>
              <textarea
                value={finalDecision}
                onChange={(e) => setFinalDecision(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[120px] p-3"
                placeholder="Enter your final evaluation decision..."
              />
            </div>
          </div>

          <div className="flex justify-center mt-10">
            <button
              onClick={handleSendReport}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg rounded-xl font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              Send Evaluation Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ScorePage;
