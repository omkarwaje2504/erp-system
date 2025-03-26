"use client";

const Card = ({ title, amount, discription }) => {
  return (
    <div className="bg-white p-5 shadow rounded-lg">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold">{amount}</h2>
      {discription && <p className="text-green-600 text-sm">{discription}</p>}
    </div>
  );
};

export default Card;
