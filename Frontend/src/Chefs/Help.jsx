import React, { useState } from "react";
import Header from "./Header";
const Help = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const faqs = [
    { question: "How do I change my password?", answer: "Go to view profile and select 'Change Password' to update it." },
    { question: "How can I update my email?", answer: "In View Profile Settings, edit your email and confirm the changes." },
    { question: "How do I contact customer support?", answer: "You can reach out to our support team via the 'Contact Us' page or email us at support@example.com." },
    { question: "How do I reset my password if I forget it?", answer: "Click 'Forgot Password' on the login page and follow the instructions sent to your email." },
    { question: "How do I change my profile picture?", answer: "Go to your Profile Settings and click 'Edit Profile Picture' to upload a new image." },
    { question: "How do I report a bug or issue?", answer: "Use the 'Report a Bug' feature in the Help Center or email us at bugs@example.com." },
    { question: "How do I search for recipes?", answer: "Use the search bar on the Recipe Finder page to search for recipes by name, ingredient, or cuisine." },
    { question: "Can I filter recipes by dietary restrictions?", answer: "Yes, you can filter recipes by dietary restrictions such as gluten-free, vegan, or keto in the Recipe Finder." },
    { question: "How do I save my favorite recipes?", answer: "Click the 'Save' button on any recipe to add it to your favorites. You can access your saved recipes in the 'Favorites' section." },
    { question: "Can I share recipes with friends?", answer: "Yes, you can share recipes via email or social media by clicking the 'Share' button on the recipe page." },
    { question: "How do I print a recipe?", answer: "Click the 'Print' button on the recipe page to print the recipe with a clean, formatted layout." }
  ];
  const toggleQuestion = (index) => {
    setSelectedQuestion(selectedQuestion === index ? null : index);
  };
  return (
    <div>
      <Header />
      <div className="flex justify-center items-center bg-gradient-to-r from-green-100 via-white to-green-100 min-h-screen p-8">
        <style>
          {`
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(-10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .animate-fadeIn {
              animation: fadeIn 0.3s ease-in-out;
            }
            .rotate-180 {
              transform: rotate(180deg);
            }
            .faq-item {
              transition: all 0.3s ease;
              margin-bottom: 20px; /* Adds space between each FAQ item */
            }
            .faq-item:hover {
              transform: scale(1.03);
              box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
            }
            .header-background {
              background: linear-gradient(to right, #80d98a, #56c477, #34a853);
              color: white;
              padding: 20px 0;
              margin: 20px;
              border-radius: 12px;
            }
            button:hover {
              transform: translateY(-2px);
            }
            .content-wrapper {
              padding: 50px 50px 50px 100px; /* Added space to the left */
              border: 2px solid #34a853;
              border-radius: 16px;
            }
          `}
        </style>

        {/* Centered Container with Left and Right Space */}
        <div className="content-wrapper w-full max-w-4xl px-8 mx-auto bg-white shadow-lg">
          {/* Header */}
          <div className="header-background text-center">
            <h2 className="text-4xl font-bold mb-4">Help Center</h2>
            <p className="text-white text-lg">
              Find answers to common questions below. If you need further assistance, feel free to contact us.
            </p>
          </div>

          {/* FAQ Section */}
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="faq-item bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => toggleQuestion(index)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800 flex-grow">{faq.question}</h3>
                  <span
                    className={`text-green-700 text-2xl ml-4 transform transition-transform duration-300 ${
                      selectedQuestion === index ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </div>
                {selectedQuestion === index && (
                  <p className="text-gray-600 mt-4 pl-4 border-l-4 border-green-700 animate-fadeIn">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Contact Support Section */}
          <div className="mt-12 p-8 bg-green-50 rounded-lg shadow-lg text-center">
            <h3 className="text-2xl font-bold text-green-700 mb-4">Still Need Help?</h3>
            <p className="text-gray-600 mb-6 text-lg">
              If you didn't find the answer you were looking for, our support team is here to help!
            </p>
            <button
              className="bg-green-700 text-white px-8 py-3 rounded-lg shadow-md hover:bg-green-800 transition-all duration-300 transform hover:translate-y-1 text-lg"
              onClick={() => alert("Redirecting to contact support...")}
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
