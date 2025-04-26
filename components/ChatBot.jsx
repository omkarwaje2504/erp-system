
import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, ArrowLeft, Paperclip, Mic, ThumbsUp, ThumbsDown } from "lucide-react";

const questionsAndAnswers = {
  "start": {
    question: "Hello! I'm your ERP Assistant. How can I help you today?",
    options: [
      { text: "Sales & CRM", next: "sales_crm" },
      { text: "Inventory Management", next: "inventory" },
      { text: "Accounting & Finance", next: "accounting" },
      { text: "System Information", next: "system_info" },
    ]
  },
  "sales_crm": {
    question: "What would you like to know about Sales & CRM?",
    options: [
      { text: "Customer Management", next: "customers" },
      { text: "Sales Orders", next: "sales_orders" },
      { text: "Leads & Opportunities", next: "leads" },
      { text: "Go back", next: "start" }
    ]
  },
  "customers": {
    question: "Customer Management helps you track all your customer information. You can add, edit, and view customer details.",
    options: [
      { text: "How to add a customer?", next: "add_customer" },
      { text: "How to view customer list?", next: "view_customers" },
      { text: "Go back", next: "sales_crm" }
    ]
  },
  "add_customer": {
    question: "To add a new customer: Navigate to Sales & CRM > Selling and Customer Management > Add Customer. Fill in the required details like name, contact information, and status.",
    options: [
      { text: "View customer fields", next: "customer_fields" },
      { text: "Go back", next: "customers" }
    ]
  },
  "customer_fields": {
    question: "Customer records include: Name (required), Email, Phone (required), Company, Address, Status (Active/Inactive/Lead), and Notes.",
    options: [
      { text: "Go back", next: "add_customer" },
      { text: "Return to main menu", next: "start" }
    ]
  },
  "view_customers": {
    question: "To view your customer list: Navigate to Sales & CRM > Selling and Customer Management. You'll see a list of all customers with search and filter options.",
    options: [
      { text: "Go back", next: "customers" },
      { text: "Return to main menu", next: "start" }
    ]
  },
  "sales_orders": {
    question: "Sales Orders track all your customer purchases. What would you like to know?",
    options: [
      { text: "Create a sales order", next: "create_order" },
      { text: "View sales orders", next: "view_orders" },
      { text: "Order statuses", next: "order_status" },
      { text: "Go back", next: "sales_crm" }
    ]
  },
  "create_order": {
    question: "To create a sales order: Go to Sales & CRM > Selling > Sales Orders > Add Order. Select a customer, add products, quantities, and prices.",
    options: [
      { text: "Go back", next: "sales_orders" },
      { text: "Return to main menu", next: "start" }
    ]
  },
  "view_orders": {
    question: "To view all sales orders: Navigate to Sales & CRM > Selling > Sales Orders. You can search, filter, and view details of each order.",
    options: [
      { text: "Go back", next: "sales_orders" },
      { text: "Return to main menu", next: "start" }
    ]
  },
  "order_status": {
    question: "Sales orders can have these statuses: Pending (awaiting processing), Completed (fulfilled), and Cancelled (order not fulfilled).",
    options: [
      { text: "Go back", next: "sales_orders" },
      { text: "Return to main menu", next: "start" }
    ]
  },
  "leads": {
    question: "Leads & Opportunities help you track potential customers and sales opportunities.",
    options: [
      { text: "Managing leads", next: "manage_leads" },
      { text: "Converting leads to customers", next: "convert_leads" },
      { text: "Go back", next: "sales_crm" }
    ]
  },
  "manage_leads": {
    question: "To manage leads: Go to Sales & CRM > Selling. Customers with 'Lead' status are your leads. You can track their information and interactions.",
    options: [
      { text: "Go back", next: "leads" },
      { text: "Return to main menu", next: "start" }
    ]
  },
  "convert_leads": {
    question: "To convert a lead to a customer: Edit the lead and change their status from 'Lead' to 'Active'.",
    options: [
      { text: "Go back", next: "leads" },
      { text: "Return to main menu", next: "start" }
    ]
  },
  "inventory": {
    question: "What would you like to know about Inventory Management?",
    options: [
      { text: "Stock & Warehouse", next: "stock_warehouse" },
      { text: "Stock Allocation", next: "stock_allocation" },
      { text: "Procurement & Suppliers", next: "procurement" },
      { text: "Go back", next: "start" }
    ]
  },
  "stock_warehouse": {
    question: "Stock & Warehouse Management helps you track inventory levels and warehouse locations.",
    options: [
      { text: "Managing stock items", next: "manage_stock" },
      { text: "Warehouse operations", next: "warehouse_ops" },
      { text: "Go back", next: "inventory" }
    ]
  },
  "manage_stock": {
    question: "To manage stock items: Go to Stock Inventory > Stock & Warehouse Management. You can add new items, update quantities, and view stock levels.",
    options: [
      { text: "Go back", next: "stock_warehouse" },
      { text: "Return to main menu", next: "start" }
    ]
  },
  "warehouse_ops": {
    question: "Warehouse operations include receiving items, stock transfers between locations, and inventory adjustments.",
    options: [
      { text: "Go back", next: "stock_warehouse" },
      { text: "Return to main menu", next: "start" }
    ]
  },
  "stock_allocation": {
    question: "Stock Allocation helps you assign inventory to specific orders, departments, or purposes.",
    options: [
      { text: "Creating allocations", next: "create_allocation" },
      { text: "Viewing allocations", next: "view_allocations" },
      { text: "Go back", next: "inventory" }
    ]
  },
  "create_allocation": {
    question: "To create a stock allocation: Navigate to Stock Inventory > Stock Allocation > Add. Select items, quantities, and the allocation purpose.",
    options: [
      { text: "Go back", next: "stock_allocation" },
      { text: "Return to main menu", next: "start" }
    ]
  },
  "view_allocations": {
    question: "To view stock allocations: Go to Stock Inventory > Stock Allocation. You'll see all current allocations with their status and details.",
    options: [
      { text: "Go back", next: "stock_allocation" },
      { text: "Return to main menu", next: "start" }
    ]
  },
  "procurement": {
    question: "Procurement & Supplier Management helps you manage vendors and purchase orders.",
    options: [
      { text: "Managing suppliers", next: "manage_suppliers" },
      { text: "Purchase requests", next: "purchase_requests" },
      { text: "Return handling", next: "returns" },
      { text: "Go back", next: "inventory" }
    ]
  },
  "manage_suppliers": {
    question: "To manage suppliers: Go to Stock Inventory > Procurement & Supplier Management. You can add, edit, and view supplier information.",
    options: [
      { text: "Go back", next: "procurement" },
      { text: "Return to main menu", next: "start" }
    ]
  },
  "purchase_requests": {
    question: "To create purchase requests: Navigate to Stock Inventory > Procurement > Add Purchase Request. Specify items, quantities, and the supplier.",
    options: [
      { text: "Go back", next: "procurement" },
      { text: "Return to main menu", next: "start" }
    ]
  },
  "returns": {
    question: "For handling returns and defective materials: Go to Stock Inventory > Procurement > Add Return Request. Document the returned items and reason.",
    options: [
      { text: "Go back", next: "procurement" },
      { text: "Return to main menu", next: "start" }
    ]
  },
  "accounting": {
    question: "What would you like to know about Accounting & Finance?",
    options: [
      { text: "Invoices & Payments", next: "invoices" },
      { text: "Chart of Accounts", next: "chart_accounts" },
      { text: "Tax Reports", next: "tax_reports" },
      { text: "Go back", next: "start" }
    ]
  },
  "invoices": {
    question: "Invoices & Payments help you track billing and payment collection.",
    options: [
      { text: "Creating invoices", next: "create_invoice" },
      { text: "Managing payments", next: "manage_payments" },
      { text: "Go back", next: "accounting" }
    ]
  },
  "create_invoice": {
    question: "To create an invoice: Go to Accounting & Finance > Invoices > Add Invoice. Select the customer, add line items, and set payment terms.",
    options: [
      { text: "Go back", next: "invoices" },
      { text: "Return to main menu", next: "start" }
    ]
  },
  "manage_payments": {
    question: "To record payments: Navigate to Accounting & Finance > Invoices, find the invoice, and add a payment record with the amount and payment method.",
    options: [
      { text: "Go back", next: "invoices" },
      { text: "Return to main menu", next: "start" }
    ]
  },
  "chart_accounts": {
    question: "Chart of Accounts organizes your financial accounts into categories like assets, liabilities, income, and expenses.",
    options: [
      { text: "Account types", next: "account_types" },
      { text: "Managing accounts", next: "manage_accounts" },
      { text: "Go back", next: "accounting" }
    ]
  },
  "account_types": {
    question: "Account types include: Assets, Liabilities, Equity, Revenue, and Expenses. Each type helps categorize your financial transactions.",
    options: [
      { text: "Go back", next: "chart_accounts" },
      { text: "Return to main menu", next: "start" }
    ]
  },
  "manage_accounts": {
    question: "To manage accounts: Go to Accounting & Finance > Chart of Accounts. You can add, edit, and view account details and balances.",
    options: [
      { text: "Go back", next: "chart_accounts" },
      { text: "Return to main menu", next: "start" }
    ]
  },
  "tax_reports": {
    question: "Tax Reports help you track tax obligations and prepare for filing.",
    options: [
      { text: "Creating tax reports", next: "create_tax_report" },
      { text: "Viewing tax data", next: "view_tax_data" },
      { text: "Go back", next: "accounting" }
    ]
  },
  "create_tax_report": {
    question: "To create a tax report: Navigate to Accounting & Finance > Tax Reports > Add Report. Select the report type, period, and enter the relevant tax data.",
    options: [
      { text: "Go back", next: "tax_reports" },
      { text: "Return to main menu", next: "start" }
    ]
  },
  "view_tax_data": {
    question: "To view tax data: Go to Accounting & Finance > Tax Reports. You'll see all tax reports with their status and details.",
    options: [
      { text: "Go back", next: "tax_reports" },
      { text: "Return to main menu", next: "start" }
    ]
  },
  "system_info": {
    question: "What would you like to know about the ERP system?",
    options: [
      { text: "System overview", next: "system_overview" },
      { text: "User management", next: "user_management" },
      { text: "Technical support", next: "tech_support" },
      { text: "Go back", next: "start" }
    ]
  },
  "system_overview": {
    question: "This ERP system integrates Sales & CRM, Inventory Management, and Accounting & Finance modules to streamline your business operations.",
    options: [
      { text: "Go back", next: "system_info" },
      { text: "Return to main menu", next: "start" }
    ]
  },
  "user_management": {
    question: "User management is handled through the login system. Contact your system administrator to create new user accounts or modify permissions.",
    options: [
      { text: "Go back", next: "system_info" },
      { text: "Return to main menu", next: "start" }
    ]
  },
  "tech_support": {
    question: "For technical support, please contact your system administrator or IT department. You can also check the documentation for common issues and solutions.",
    options: [
      { text: "Go back", next: "system_info" },
      { text: "Return to main menu", next: "start" }
    ]
  }
};



const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState("start");
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    if (isOpen && chatHistory.length === 0) {
      setChatHistory([{
        text: questionsAndAnswers.start.question,
        isUser: false,
        options: questionsAndAnswers.start.options,
      }]);
    }
  }, [chatHistory, isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const simulateTyping = (message, nextStep) => {
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      setChatHistory(prev => [
        ...prev,
        {
          text: message,
          isUser: false,
          options: questionsAndAnswers[nextStep].options,
        },
      ]);
      setCurrentStep(nextStep);
    }, 1200); // Simulate typing delay
  };

  const handleOptionClick = (optionText, nextStep) => {
    setChatHistory(prev => [...prev, { text: optionText, isUser: true }]);
    simulateTyping(questionsAndAnswers[nextStep].question, nextStep);
  };

  const handleSendMessage = () => {
    if (userInput.trim() === "") return;

    setChatHistory(prev => [...prev, { text: userInput, isUser: true }]);
    setUserInput("");

    // Simulate AI typing response
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      setChatHistory(prev => [
        ...prev,
        {
          text: "I've received your message. Let me help you with that.",
          isUser: false,
          options: [
            { text: "See more options", next: "start" }
          ],
        },
      ]);
      // Show feedback option after AI response
      setShowFeedback(true);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setChatHistory([]);
      setCurrentStep("start");
      setUnreadCount(0);
    }
  };

  const handleFeedback = (isPositive) => {
    setChatHistory(prev => [...prev, { 
      text: isPositive ? "Thanks for the positive feedback!" : "Thanks for your feedback. We'll work to improve.",
      isUser: false 
    }]);
    setShowFeedback(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating chat button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-all relative"
        >
          <MessageCircle size={28} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="w-96 h-[550px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Chat header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-indigo-600 font-bold mr-3">
                <MessageCircle size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-lg">Assistant</h2>
                <p className="text-xs text-indigo-100">Online • Typically replies in minutes</p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="text-black hover:text-gray-200 bg-white bg-opacity-20 rounded-full p-1"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat messages area */}
          <div className="flex-1 p-2 overflow-y-auto bg-gray-50 overflow-x-hidden">
            <div className="space-y-2">
              {/* Chat history */}
              {chatHistory.map((message, index) => (
                <React.Fragment key={index}>
                  <div
                    className={`flex ${
                      message.isUser ? "justify-end" : "justify-start"
                    } animate-fadeIn`}
                  >
                    {!message.isUser && (
                      <div className="w-6 h-6 text-sm rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center text-indigo-600 font-bold mr-2 mt-1">
                        A
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] p-2 rounded-lg shadow-sm text-sm ${
                        message.isUser
                          ? "bg-indigo-600 text-white rounded-br-none"
                          : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                      }`}
                    >
                      <p>{message.text}</p>
                    </div>
                    {message.isUser && (
                      <div className="w-6 h-6 text-sm rounded-full bg-indigo-200 flex-shrink-0 flex items-center justify-center text-indigo-600 font-bold ml-2 mt-1">
                        U
                      </div>
                    )}
                  </div>

                  {/* Feedback buttons after AI responses */}
                  {showFeedback && !message.isUser && index === chatHistory.length - 1 && (
                    <div className="flex justify-start ml-10 space-x-2">
                      <button 
                        onClick={() => handleFeedback(true)}
                        className="text-gray-500 hover:text-green-500 p-1"
                      >
                        <ThumbsUp size={10} />
                      </button>
                      <button 
                        onClick={() => handleFeedback(false)}
                        className="text-gray-500 hover:text-red-500 p-1"
                      >
                        <ThumbsDown size={16} />
                      </button>
                    </div>
                  )}

                  {/* Options after bot message */}
                  {message.options && !message.isUser && (
                    <div className="flex justify-start ml-10">
                      <div className="max-w-[90%] grid grid-cols-1 gap-1">
                        {message.options.map((option, i) => (
                          <button
                            key={i}
                            onClick={() =>
                              option.next === "close"
                                ? toggleChat()
                                : handleOptionClick(option.text, option.next)
                            }
                            className="w-full text-left p-2 text-sm bg-white text-indigo-600 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition font-medium shadow-sm hover:shadow flex justify-between items-center"
                          >
                            <span>{option.text}</span>
                            <ArrowLeft size={16} className="transform rotate-180" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center text-indigo-600 font-bold mr-2">
                    A
                  </div>
                  <div className="max-w-[80%] bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "600ms" }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input area */}
          <div className="p-3 bg-white border-t border-gray-200">
            <div className="flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 py-3 px-4 border border-gray-200 rounded-xl mx-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!userInput.trim()}
                className={`p-3 rounded-xl ${
                  userInput.trim() 
                    ? "bg-indigo-600 text-white hover:bg-indigo-700" 
                    : "bg-gray-200 text-gray-400"
                } transition`}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default ChatBot;
